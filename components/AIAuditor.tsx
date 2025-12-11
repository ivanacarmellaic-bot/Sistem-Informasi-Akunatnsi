import React, { useState } from 'react';
import { useSystem } from '../store';
import { auditSystemState } from '../services/geminiService';
import { Bot, RefreshCw, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AIAuditor = () => {
  const { sopbs, journals } = useSystem();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAudit = async () => {
    setLoading(true);
    const result = await auditSystemState(sopbs, journals);
    setAnalysis(result);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 z-50"
      >
        <Bot className="w-6 h-6" />
        <span className="font-semibold">AI Auditor</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-[600px]">
      <div className="p-4 bg-slate-900 text-white rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold">System Auditor</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:text-slate-300"><X className="w-5 h-5" /></button>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-700 leading-relaxed">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-4">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-slate-500">Analyzing transactions...</p>
          </div>
        ) : analysis ? (
          <div className="prose prose-sm prose-purple">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            <p>Click "Run Audit" to analyze current Purchase Orders and Journals for discrepancies using Gemini AI.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-slate-50 rounded-b-xl">
        <button 
          onClick={handleAudit}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors font-medium flex justify-center items-center gap-2"
        >
          {loading ? 'Thinking...' : 'Run Audit'}
        </button>
      </div>
    </div>
  );
};