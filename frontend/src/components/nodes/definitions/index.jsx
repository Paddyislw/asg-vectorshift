import { BaseNode } from '../BaseNode';

import { inputNodeConfig } from './InputNode';
import { outputNodeConfig } from './OutputNode';
import { llmNodeConfig } from './LLMNode';
import { textNodeConfig, TextNode } from './TextNode';
import { apiNodeConfig } from './APINode';
import { conditionalNodeConfig } from './ConditionalNode';
import { timerNodeConfig } from './TimerNode';
import { noteNodeConfig } from './NoteNode';
import { dataTransformNodeConfig } from './DataTransformNode';

/**
 * Creates a React component from a node config object.
 */
function createNodeComponent(config) {
  const Component = (props) => <BaseNode {...props} config={config} />;
  Component.displayName = `${config.label}Node`;
  return Component;
}

/**
 * All node configs — used by the toolbar for rendering draggable items.
 */
export const NODE_CONFIGS = [
  inputNodeConfig,
  outputNodeConfig,
  llmNodeConfig,
  textNodeConfig,
  apiNodeConfig,
  conditionalNodeConfig,
  timerNodeConfig,
  noteNodeConfig,
  dataTransformNodeConfig,
];

/**
 * ReactFlow nodeTypes map , maps type string to React component.
 */
export const NODE_TYPES = {
  customInput: createNodeComponent(inputNodeConfig),
  customOutput: createNodeComponent(outputNodeConfig),
  llm: createNodeComponent(llmNodeConfig),
  text: TextNode,
  api: createNodeComponent(apiNodeConfig),
  conditional: createNodeComponent(conditionalNodeConfig),
  timer: createNodeComponent(timerNodeConfig),
  note: createNodeComponent(noteNodeConfig),
  dataTransform: createNodeComponent(dataTransformNodeConfig),
};
