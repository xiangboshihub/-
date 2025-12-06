import React, { useState } from 'react';
import { Header } from './components/Header';
import { KeywordInput } from './components/KeywordInput';
import { ReportDisplay } from './components/ReportDisplay';
import { generateDailyReport } from './services/geminiService';
import { LoadingState, MonitorKeyword, ReportData } from './types';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Default keywords
  const [keywords, setKeywords] = useState<MonitorKeyword[]>([
    { id: '1', term: 'OpenAI 动态' },
    { id: '2', term: 'LLM 开源模型' },
  ]);

  const handleGenerate = async () => {
    setLoadingState(LoadingState.GENERATING);
    setError(null);
    setReportData(null);

    try {
      const keywordList = keywords.map(k => k.term);
      const data = await generateDailyReport(keywordList);
      setReportData(data);
      setLoadingState(LoadingState.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("采集任务执行失败。请检查网络连接或 API Key 配额。");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-12 font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        情报采集任务配置
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        目标源: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">tldr.tech</span> <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">therundown.ai</span> <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">stratechery.com</span>
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                     {loadingState === LoadingState.IDLE || loadingState === LoadingState.COMPLETE || loadingState === LoadingState.ERROR ? (
                        <button
                        onClick={handleGenerate}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all active:scale-95"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        启动爬虫任务
                        </button>
                    ) : (
                        <button
                            disabled
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 cursor-wait opacity-80"
                        >
                             <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            正在抓取中...
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Configuration Section */}
        <KeywordInput 
          keywords={keywords} 
          setKeywords={setKeywords} 
          disabled={loadingState === LoadingState.GENERATING} 
        />
        
        {/* Loading Visuals */}
        {loadingState === LoadingState.GENERATING && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center animate-pulse">
                <div className="inline-block p-4 rounded-full bg-indigo-50 mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900">正在连接数据源...</h3>
                <div className="mt-2 space-y-1 text-sm text-slate-500">
                    <p>正在扫描 site:tldr.tech...</p>
                    <p>正在扫描 site:therundown.ai...</p>
                    <p>正在分析 Google Search 索引...</p>
                </div>
            </div>
        )}

        {/* Error State */}
        {loadingState === LoadingState.ERROR && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">采集失败</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Output */}
        {reportData && (
          <ReportDisplay report={reportData} />
        )}
      </main>
    </div>
  );
};

export default App;