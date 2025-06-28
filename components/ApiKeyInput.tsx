import React, { useState } from 'react';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
  error?: string | null;
  title: string;
  promptText: string;
  placeholder: string;
  linkUrl: string;
  linkText: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ 
  onApiKeySubmit, 
  error,
  title,
  promptText,
  placeholder,
  linkUrl,
  linkText
}) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-gray-800 border border-gray-700 rounded-lg text-center shadow-2xl animate-fade-in">
      <h2 className="text-xl font-semibold text-purple-300 mb-2">{title}</h2>
      {error && (
        <div className="text-red-300 bg-red-900/50 p-3 rounded-md mb-4 border border-red-700">
          <p className="font-semibold">오류</p>
          <p>{error}</p>
        </div>
      )}
      <p className="text-gray-400 mb-4">{promptText}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-500"
          aria-label="API Key Input"
          autoComplete="off"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!apiKey.trim()}
        >
          키 저장 및 계속하기
        </button>
      </form>
       <p className="text-xs text-gray-500 mt-4">
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
          {linkText}
        </a>
      </p>
    </div>
  );
};

export default ApiKeyInput;