import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ReportData } from '../types';

interface ReportDisplayProps {
  report: ReportData;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  // Filter out duplicate sources based on URI
  const uniqueSources = report.sources.filter((source, index, self) =>
    index === self.findIndex((t) => (
      t.web?.uri === source.web?.uri
    ))
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-sm font-medium text-slate-600">
                    生成时间: {new Date(report.timestamp).toLocaleDateString('zh-CN')} {new Date(report.timestamp).toLocaleTimeString('zh-CN')}
                </p>
            </div>
            <button
                onClick={() => window.print()}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="打印报告"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
            </button>
        </div>
        
        <div className="p-8 sm:p-10">
          <div className="markdown-content">
            <ReactMarkdown>
                {report.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {uniqueSources.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            已验证信源 (Google 搜索)
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {uniqueSources.map((source, idx) => (
              <a
                key={idx}
                href={source.web?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 truncate">
                    {source.web?.title || "未知来源"}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {source.web?.uri}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0 text-slate-300 group-hover:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};