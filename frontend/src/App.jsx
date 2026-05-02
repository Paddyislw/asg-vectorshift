import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { PipelineToolbar } from '@/components/toolbar';
import { PipelineCanvas } from '@/components/canvas';
import { SubmitButton } from '@/components/ui';
import { SavedPipelinesPanel } from '@/components/ui/SavedPipelinesPanel';

function App() {
  const [savedPanelOpen, setSavedPanelOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-canvas-bg">
      <PipelineToolbar />
      <PipelineCanvas />
      <SubmitButton onOpenSaved={() => setSavedPanelOpen(true)} />
      <SavedPipelinesPanel
        isOpen={savedPanelOpen}
        onClose={() => setSavedPanelOpen(false)}
      />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          },
        }}
      />
    </div>
  );
}

export default App;
