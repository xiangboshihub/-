import React, { useState } from 'react';
import { MonitorKeyword } from '../types';

interface KeywordInputProps {
  keywords: MonitorKeyword[];
  setKeywords: React.Dispatch<React.SetStateAction<MonitorKeyword[]>>;
  disabled: boolean;
}

export const KeywordInput: React.FC<KeywordInputProps> = ({ keywords, setKeywords, disabled }) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAdd = () => {
    if (newKeyword.trim()) {
      setKeywords([...keywords, { id: Date.now().toString(), term: newKeyword.trim() }]);
      setNewKeyword('');
    }
  };

  const handleRemove = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Level 3: 全网监控 (Alerts)</h3>
        <p className="text-sm text-slate-500">添加自定义关键词，让 Google 帮你盯着全网动态 (例如: "生成式 AI", "NVIDIA")。</p>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入监控关键词..."
          className="flex-1 rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
          disabled={disabled}
        />
        <button
          onClick={handleAdd}
          disabled={disabled || !newKeyword.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          添加
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {keywords.map((k) => (
          <span
            key={k.id}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800 border border-slate-200"
          >
            {k.term}
            {!disabled && (
              <button
                onClick={() => handleRemove(k.id)}
                className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </span>
        ))}
        {keywords.length === 0 && (
          <span className="text-sm text-slate-400 italic">暂无自定义关键词，将默认监控通用 AI 新闻。</span>
        )}
      </div>
    </div>
  );
};