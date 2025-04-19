import React from 'react';

interface CodeBlockRendererProps {
  response: string;
}

const CodeBlockRenderer: React.FC<CodeBlockRendererProps> = ({ response }) => {
  // Simple implementation that wraps code blocks in pre tags
  const formattedResponse = response.split('```').map((block, index) => {
    if (index % 2 === 1) {
      // This is a code block
      return <pre key={index} className="bg-gray-800 p-4 rounded-lg my-2 overflow-x-auto"><code>{block}</code></pre>;
    }
    // This is regular text
    return <p key={index}>{block}</p>;
  });

  return <div className="code-block-renderer">{formattedResponse}</div>;
};

export default CodeBlockRenderer;