import React, { useState, useRef, useEffect } from 'react';
import { Play, Trash2, Terminal, Code, FileText, Layers, Globe, Camera, Maximize2, RefreshCw } from 'lucide-react';

export const ScriptPlayground: React.FC = () => {
  const [scriptContent, setScriptContent] = useState('');
  const [language, setLanguage] = useState<'karate' | 'robot'>('karate');
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRun = () => {
    if (!scriptContent.trim()) return;
    setIsRunning(true);
    setLogs(['> Initializing test environment...', '> Compiling script...']);
    
    // Simulation
    let step = 0;
    const interval = setInterval(() => {
        step++;
        if (step > 5) {
            clearInterval(interval);
            setIsRunning(false);
            setLogs(prev => [...prev, '> Execution completed successfully.', '> Result: PASSED']);
            return;
        }
        setLogs(prev => [...prev, `> [INFO] Executing step ${step}: ${language === 'robot' ? 'Keyword' : '* Action'}...`]);
    }, 800);
  };

  const placeholder = language === 'karate' 
    ? "Feature: Validating API\n\n  Scenario: Get User Details\n    * url 'https://api.example.com/users/1'\n    * method get\n    * status 200"
    : "*** Test Cases ***\nExample Test\n    Open Browser    https://example.com    chrome\n    Page Should Contain    Example Domain";

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center shrink-0">
         <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
                 <Code size={20} />
             </div>
             <div>
                <h1 className="text-xl font-bold text-white">Script Playground</h1>
                <p className="text-gray-400 text-xs">Verify and debug your automation scripts instantly</p>
             </div>
         </div>
         <div className="flex bg-gray-700 rounded-lg p-1">
             <button onClick={() => setLanguage('karate')} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${language === 'karate' ? 'bg-gray-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                 <FileText size={14} /> Karate
             </button>
             <button onClick={() => setLanguage('robot')} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${language === 'robot' ? 'bg-gray-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                 <Layers size={14} /> Robot
             </button>
         </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col min-h-0">
          
          {/* Top Section: Editor (Left) & Preview (Right) */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
              
              {/* Left: Script Editor */}
              <div className="flex-1 bg-gray-900 relative border-b md:border-b-0 md:border-r border-gray-700 flex flex-col min-h-[50%] md:min-h-0">
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                     <button 
                        onClick={() => setScriptContent('')}
                        className="p-2 bg-gray-800 text-gray-400 rounded hover:text-white hover:bg-gray-700 border border-gray-700 transition-colors"
                        title="Clear"
                     >
                         <Trash2 size={16} />
                     </button>
                     <button 
                        onClick={handleRun}
                        disabled={isRunning || !scriptContent.trim()}
                        className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm transition-colors ${isRunning || !scriptContent.trim() ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'}`}
                     >
                         {isRunning ? <span className="animate-spin">⟳</span> : <Play size={16} />} 
                         {isRunning ? 'Run' : 'Run Script'}
                     </button>
                  </div>
                  <textarea 
                    className="flex-1 w-full bg-gray-900 text-gray-300 font-mono text-sm p-4 pt-16 md:pt-4 resize-none focus:outline-none leading-relaxed"
                    placeholder={placeholder}
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    spellCheck={false}
                  />
                  <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-800 text-[10px] text-gray-500 flex justify-between">
                     <span>Ln {scriptContent.split('\n').length}, Col 1</span>
                     <span>UTF-8</span>
                  </div>
              </div>

              {/* Right: Browser Preview */}
              <div className="flex-1 bg-gray-100 flex flex-col min-h-[50%] md:min-h-0">
                 {/* Browser Toolbar */}
                 <div className="bg-gray-200 px-3 py-2 border-b border-gray-300 flex items-center gap-3 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-500/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-500/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-green-500/20"></div>
                    </div>
                    <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-600 flex items-center border border-gray-300 shadow-sm">
                       <Globe size={10} className="mr-2 text-gray-400" />
                       <span className="truncate">about:blank</span>
                    </div>
                    <div className="flex gap-2 text-gray-500">
                       <RefreshCw size={14} className="cursor-pointer hover:text-gray-800" />
                       <Camera size={14} className="cursor-pointer hover:text-gray-800" />
                       <Maximize2 size={14} className="cursor-pointer hover:text-gray-800" />
                    </div>
                 </div>
                 
                 {/* Browser Viewport */}
                 <div className="flex-1 bg-white relative flex items-center justify-center p-4">
                     {isRunning ? (
                         <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-sm font-medium text-gray-600">Executing Step...</p>
                            <p className="text-xs text-gray-400 mt-1">Interacting with DOM elements</p>
                            
                            {/* Simulated Content Skeleton */}
                            <div className="mt-8 w-3/4 space-y-3 opacity-30">
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-32 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </div>
                         </div>
                     ) : (
                         <div className="text-center">
                             <Globe size={48} className="mx-auto text-gray-300 mb-3" />
                             <p className="text-gray-400 text-sm font-medium">Browser Preview</p>
                             <p className="text-gray-500 text-xs mt-1">Run your script to see live execution</p>
                         </div>
                     )}
                 </div>
              </div>
          </div>

          {/* Bottom: Console/Logs */}
          <div className="h-48 bg-black/40 border-t border-gray-700 flex flex-col shrink-0">
              <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <Terminal size={12} /> 
                  <span>Console Output</span>
                  <span className="bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded ml-2">{language === 'karate' ? 'Karate Runner' : 'Robot Framework'}</span>
              </div>
              <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-1">
                  {logs.length === 0 && <span className="text-gray-600 italic">Ready to execute...</span>}
                  {logs.map((log, i) => (
                      <div key={i} className={`${log.includes('ERROR') ? 'text-red-400' : log.includes('PASSED') ? 'text-green-400' : 'text-gray-300'}`}>
                          {log}
                      </div>
                  ))}
                  <div ref={logsEndRef} />
              </div>
          </div>
      </div>
    </div>
  );
};