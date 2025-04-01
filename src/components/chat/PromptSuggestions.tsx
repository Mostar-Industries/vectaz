
import React from 'react';

interface PromptSuggestionsProps {
  promptIdeas: string[];
  onPromptClick: (prompt: string) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ promptIdeas, onPromptClick }) => {
  return (
    <div className="px-4 py-2 border-t border-blue-500/20 bg-black/30">
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {promptIdeas.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="text-xs shrink-0 px-2 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition-colors text-blue-400"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;
