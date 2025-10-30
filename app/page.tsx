"use client";
import JsonInput from '@/src/components/JsonInput';
import SearchBar from '@/src/components/SearchBar';
import TreeVisualizer from '@/src/components/TreeVisualizer';
import { FileJson, GitBranch, Search } from 'lucide-react';
import React, { useState, useRef, useCallback } from 'react';
import type { ReactFlowInstance } from 'reactflow';
import { jsonToTreeNodesEdges } from '@/utils/jsonToTree';

type Edge = {
  id: string;
  source: string;
  target: string;
};

type Node = {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: { label: string };
  style?: React.CSSProperties;
};

const Home: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [treeNodes, setTreeNodes] = useState<Node[]>([]);
  const [treeEdges, setTreeEdges] = useState<Edge[]>([]);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [inputResetKey, setInputResetKey] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const onLoad = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const handleSearchResult = (matchedNodeId?: string) => {
    if (!matchedNodeId) {
      setSearchMessage('No match found');
      return;
    }
    setSearchMessage('Match found!');

    const updatedNodes = treeNodes.map(node => ({
      ...node,
      style: node.id === matchedNodeId
        ? { ...node.style, border: '3px solid #EF4444', backgroundColor: '#FEE2E2' }
        : { ...node.style, border: '1px solid #777', backgroundColor: undefined },
    }));

    setTreeNodes(updatedNodes);

    const matchedNode = treeNodes.find(node => node.id === matchedNodeId);
    if (matchedNode && reactFlowInstance.current) {
      const { x, y } = matchedNode.position;
      reactFlowInstance.current.setCenter(x + 100, y + 50, { duration: 800 });
    }
  };

  const handleClearAll = () => {
    setJsonData(null);
    setTreeNodes([]);
    setTreeEdges([]);
    setSearchMessage(null);
    setInputResetKey(prev => prev + 1);
  };

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const mainBg = theme === 'dark'
    ? 'bg-gradient-to-br from-zinc-900 via-blue-900 to-indigo-900'
    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50';

  return (
    <div className={`min-h-screen ${mainBg} transition-colors duration-300`}>
      {/* Navbar START */}
      <div className={`border-b shadow-sm ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              JSON Tree Visualizer
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 border border-indigo-500 bg-indigo-100 hover:bg-indigo-200 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? "🌙" : "🔆"}
          </button>
        </div>
      </div>
      {/* Navbar END */}

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4">
        {/* JSON Input Panel */}
        <div className="w-full lg:w-2/5">
          <div className={`rounded-xl shadow-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'} overflow-visible p-4`}>
            <div className="flex items-center gap-2 mb-2 text-indigo-700">
              <FileJson className="w-5 h-5" />
              <h2 className="font-semibold">JSON Input</h2>
            </div>
            <JsonInput
              key={inputResetKey}
              onValidJson={(data) => {
                setJsonData(data);
                const { nodes, edges } = jsonToTreeNodesEdges(data);
                setTreeNodes(nodes);
                setTreeEdges(edges);
              }}
            />
            <button className="w-full mt-2 py-2 rounded text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition" onClick={handleClearAll}>
              Clear
            </button>
          </div>
        </div>
        {/* Output & Search Panel */}
        <div className="w-full lg:w-3/5 flex flex-col gap-3">
          {jsonData ? (
            <>
              <div className={`rounded-xl shadow-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'} overflow-hidden min-h-[70px] max-w-xs mx-auto`}>
                <div className="flex items-center gap-2 text-indigo-700 px-4 py-2">
                  <Search className="w-5 h-5" />
                  <h2 className="font-semibold">Search</h2>
                </div>
                <div className="px-4 pb-3">
                  <SearchBar nodes={treeNodes} onSearchResult={handleSearchResult} />
                  {searchMessage && (
                    <div className={`mt-2 text-xs text-center font-medium ${searchMessage === 'No match found' ? 'text-red-700' : 'text-green-700'}`}>
                      {searchMessage}
                    </div>
                  )}
                </div>
              </div>
              <div className={`flex-1 rounded-xl shadow-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'} min-h-[340px]`}>
                <TreeVisualizer nodes={treeNodes} edges={treeEdges} />
              </div>
            </>
          ) : (
            <div className={`rounded-xl shadow-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'} min-h-[340px] flex items-center justify-center`}>
              <span className="text-indigo-600 font-semibold">Paste JSON and visualize!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
