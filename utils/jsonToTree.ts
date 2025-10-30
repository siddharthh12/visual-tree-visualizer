import { Node, Edge } from 'react-flow-renderer';

let idCounter = 0;

const getId = () => `node_${idCounter++}`;
let globalY = 0;
const NODE_VERTICAL_GAP = 100;

export function jsonToTreeNodesEdges(
  data: any,
): { nodes: Node[]; edges: Edge[] } {
  idCounter = 0;
  globalY = 0;
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Always create a visible root node, then traverse children as its children
  const rootId = getId();
  nodes.push({
    id: rootId,
    data: { label: 'Root' },
    position: { x: 0, y: globalY },
    style: {
      border: '1px solid #444',
      padding: 10,
      borderRadius: 6,
      backgroundColor: '#f8fafc',
    },
  });
  globalY += NODE_VERTICAL_GAP;

  const traverse = (
    value: any,
    key: string,
    parentId: string,
    depth: number = 1
  ) => {
    const nodeId = getId();
    let type: 'object' | 'array' | 'primitive' = 'primitive';
    if (Array.isArray(value)) {
      type = 'array';
    } else if (typeof value === 'object' && value !== null) {
      type = 'object';
    }

    let label = '';
    if (type === 'primitive') {
      label = key ? `${key}: ${String(value)}` : `${String(value)}`;
    } else if (type === 'array') {
      label = key ? `${key} [Array]` : '[Array]';
    } else {
      label = key ? `${key} [Object]` : '[Object]';
    }

    const position = { x: depth * 200, y: globalY };
    globalY += NODE_VERTICAL_GAP;

    nodes.push({
      id: nodeId,
      data: { label },
      position,
      style: {
        border: '1px solid #777',
        padding: 10,
        borderRadius: 6,
        backgroundColor:
          type === 'object'
            ? '#a0c4ff'
            : type === 'array'
            ? '#b5ead7'
            : '#ffb4a2',
      },
    });

    edges.push({ id: `e_${parentId}_${nodeId}`, source: parentId, target: nodeId });

    if (type === 'object') {
      for (const childKey in value) {
        if (Object.hasOwnProperty.call(value, childKey)) {
          traverse(value[childKey], childKey, nodeId, depth + 1);
        }
      }
    } else if (type === 'array') {
      value.forEach((item: any, idx: number) => {
        traverse(item, `[${idx}]`, nodeId, depth + 1);
      });
    }
  };

  // For root, connect top-level keys as children
  if (Array.isArray(data)) {
    traverse(data, '', rootId);
  } else if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        traverse(data[key], key, rootId);
      }
    }
  } else {
    traverse(data, '', rootId);
  }

  return { nodes, edges };
}
