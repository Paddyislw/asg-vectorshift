import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import defaultdict, deque
from uuid import uuid4
from datetime import datetime


app = FastAPI()

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ──

class Node(BaseModel):
    id: str


class Edge(BaseModel):
    source: str
    target: str


class PipelineRequest(BaseModel):
    nodes: list[Node]
    edges: list[Edge]


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


class SavePipelineRequest(BaseModel):
    name: str
    nodes: list[dict]
    edges: list[dict]


class SavedPipeline(BaseModel):
    id: str
    name: str
    node_count: int
    edge_count: int
    created_at: str
    nodes: list[dict]
    edges: list[dict]


class SavedPipelineSummary(BaseModel):
    id: str
    name: str
    node_count: int
    edge_count: int
    created_at: str


# ── In-Memory Storage ──

pipelines_db: dict[str, dict] = {}


# ── Helpers ──

def is_dag(nodes: list[Node], edges: list[Edge]) -> bool:
    """Check if the graph is a DAG using Kahn's algorithm (topological sort)."""
    node_ids = {node.id for node in nodes}

    adj = defaultdict(list)
    in_degree = {nid: 0 for nid in node_ids}

    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            adj[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    queue = deque(nid for nid, deg in in_degree.items() if deg == 0)
    visited_count = 0

    while queue:
        current = queue.popleft()
        visited_count += 1

        for neighbor in adj[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == len(node_ids)


# ── Endpoints ──

@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: PipelineRequest) -> PipelineResponse:
    return PipelineResponse(
        num_nodes=len(pipeline.nodes),
        num_edges=len(pipeline.edges),
        is_dag=is_dag(pipeline.nodes, pipeline.edges),
    )


@app.post("/pipelines/save")
def save_pipeline(request: SavePipelineRequest) -> SavedPipeline:
    pipeline_id = str(uuid4())[:8]
    pipeline = {
        "id": pipeline_id,
        "name": request.name,
        "node_count": len(request.nodes),
        "edge_count": len(request.edges),
        "created_at": datetime.now().isoformat(),
        "nodes": request.nodes,
        "edges": request.edges,
    }
    pipelines_db[pipeline_id] = pipeline
    return SavedPipeline(**pipeline)


@app.get("/pipelines")
def list_pipelines() -> list[SavedPipelineSummary]:
    return [
        SavedPipelineSummary(
            id=p["id"],
            name=p["name"],
            node_count=p["node_count"],
            edge_count=p["edge_count"],
            created_at=p["created_at"],
        )
        for p in sorted(
            pipelines_db.values(),
            key=lambda x: x["created_at"],
            reverse=True,
        )
    ]


@app.get("/pipelines/{pipeline_id}")
def get_pipeline(pipeline_id: str) -> SavedPipeline:
    if pipeline_id not in pipelines_db:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return SavedPipeline(**pipelines_db[pipeline_id])


@app.delete("/pipelines/{pipeline_id}")
def delete_pipeline(pipeline_id: str):
    if pipeline_id not in pipelines_db:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    del pipelines_db[pipeline_id]
    return {"status": "deleted"}
