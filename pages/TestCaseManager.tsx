import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { TestStatus, BrowserType } from '../types';
import { 
  Plus, Trash2, Search, FileText, Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TestCaseManager: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredCases = state.testCases.filter(tc => tc.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-blue-500" size={24} />
            Test Case Management
          </h1>
          <p className="text-gray-400 text-xs mt-1">Manage and organize your automation assets</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search test cases..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 outline-none w-64"
                />
            </div>
            <button onClick={() => navigate('/create-test-case')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
              <Plus size={16} /> New Test Case
            </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto custom-scrollbar p-0 bg-gray-900">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-900 z-10 shadow-sm">
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Browser</th>
              <th className="px-6 py-3 font-semibold">Tags</th>
              <th className="px-6 py-3 font-semibold">Last Run</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredCases.map((tc) => (
              <tr key={tc.id} className="hover:bg-gray-800/50 transition-colors group">
                <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${tc.status === TestStatus.PASSED ? 'bg-green-500' : tc.status === TestStatus.FAILED ? 'bg-red-500' : 'bg-gray-600'}`} />
                        <div>
                            <span className="font-medium text-gray-200 block text-sm">{tc.name}</span>
                            <span className="text-gray-500 text-xs truncate max-w-xs block mt-0.5">{tc.description}</span>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide
                    ${tc.status === TestStatus.PASSED ? 'bg-green-900/30 text-green-400 border-green-800' : 
                      tc.status === TestStatus.FAILED ? 'bg-red-900/30 text-red-400 border-red-800' :
                      tc.status === TestStatus.RUNNING ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                      'bg-gray-800 text-gray-500 border-gray-700'}`}>
                    {tc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 flex items-center gap-2">
                    {tc.browserType}
                </td>
                <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                        {tc.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded border border-gray-700">{tag}</span>
                        ))}
                    </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 font-mono">{tc.lastRun || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate('/execution')}
                        className="text-gray-400 hover:text-green-400 p-1.5 rounded hover:bg-gray-800 transition-colors" title="Run">
                          <Play size={14} />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-400 p-1.5 rounded hover:bg-gray-800 transition-colors" 
                        onClick={() => dispatch({type: 'DELETE_TEST_CASE', payload: tc.id})} title="Delete">
                          <Trash2 size={14} />
                      </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCases.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                         <div className="flex flex-col items-center justify-center">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p>No test cases found. Create one to get started.</p>
                         </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};