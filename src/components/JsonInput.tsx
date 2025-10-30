import React, { useState } from 'react';

interface JsonInputProps {
  onValidJson: (data: any) => void;
}

const SAMPLE_JSON = `{
  "user": {
    "name": "Siddharth",
    "email": "siddharthtiwari1265@gmail.com",
    "address": {
      "city": "Mumbai",
      "pincode": 400083
    }
  },
  "active": true
}`;

const JsonInput: React.FC<JsonInputProps> = ({ onValidJson }) => {
  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [error, setError] = useState<string>('');

  const handleVisualize = () => {
    try {
      const parsedData = JSON.parse(input);
      setError('');
      onValidJson(parsedData);
    } catch (err: any) {
      setError('Invalid JSON: ' + err.message);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <textarea
        className="w-full h-40 border rounded p-2 text-sm font-mono text-gray-800 bg-white placeholder-gray-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JSON here"
        aria-label="JSON input area"
      />
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mt-2 rounded font-semibold" role="alert">
          {error}
        </div>
      )}
      <button
        className="bg-blue-600 hover:bg-blue-700 w-full mt-2 py-2 rounded text-sm font-semibold shadow-md"
        onClick={handleVisualize}
        type="button"
      >
        Visualize Tree
      </button>
    </div>
  );
};

export default JsonInput;
