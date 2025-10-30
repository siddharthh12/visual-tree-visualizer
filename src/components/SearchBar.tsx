import React, { useState } from 'react';

interface SearchBarProps {
  nodes: any[];
  onSearchResult: (matchedNodeId?: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ nodes, onSearchResult }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const foundNode = nodes.find(node => node.data.label.toLowerCase().includes(query.trim().toLowerCase()));
    if (foundNode) {
      onSearchResult(foundNode.id);
    } else {
      onSearchResult(undefined);
    }
  };

  return (
    <div className="flex gap-2 max-w-md mx-auto items-center">
  <input
    type="text"
    placeholder="Enter JSON path or key"
    className="flex-grow border rounded p-2 text-gray-800 bg-white placeholder-gray-500 font-mono min-w-0"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  <button
    onClick={handleSearch}
    className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 rounded shadow-md whitespace-nowrap"
    style={{ minWidth: '80px' }}
  >
    Search
  </button>
</div>

  );
};

export default SearchBar;
