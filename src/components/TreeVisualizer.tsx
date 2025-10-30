import React, { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
} from 'react-flow-renderer';

interface TreeVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  onInit?: (reactFlowInstance: ReactFlowInstance) => void;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ nodes, edges, onInit }) => {
  const [rfNodes, setRfNodes] = React.useState<Node[]>(nodes);
  const [rfEdges, setRfEdges] = React.useState<Edge[]>(edges);

  React.useEffect(() => {
    setRfNodes(nodes);
    setRfEdges(edges);
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => setRfEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleInit = React.useCallback((reactFlowInstance: ReactFlowInstance) => {
    if (onInit) {
      onInit(reactFlowInstance);
    }
  }, [onInit]);

return (
  <div 
    style={{ height: 600, border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}
    className="w-full max-w-4xl mx-auto"
  >
    <ReactFlowProvider>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onConnect={onConnect}
        fitView
        onInit={handleInit}
        nodesDraggable
        nodesConnectable
        zoomOnScroll
        panOnScroll
        zoomOnPinch
        snapToGrid
        snapGrid={[15, 15]}
        style={{ height: '100%', width: '100%' }}
      >
        <MiniMap nodeColor={(node) => node.style?.backgroundColor || '#888'} />
        <Controls />
        <Background gap={16} color="#aaa" />
      </ReactFlow>
    </ReactFlowProvider>
  </div>
);
}

export default TreeVisualizer;
