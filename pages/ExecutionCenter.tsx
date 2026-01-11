import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../context/AppStateContext';
import { LogEntry, TestStatus } from '../types';
import { mockLogs } from '../services/mockService';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  RefreshCw, 
  Camera, 
  Terminal, 
  Globe,
  Maximize2,
  X,
  FileJson,
  AlertOctagon,
  MousePointer,
  Info,
  ChevronDown,
  Activity
} from 'lucide-react';

export const ExecutionCenter: React.FC = () => {
  const { state } = useAppState();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(state.testCases[0]?.id || '');
  const [status, setStatus] = useState<TestStatus>(TestStatus.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const activeCase = state.testCases.find(tc => tc.id === selectedCaseId);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Simulation Logic
  useEffect(() => {
    let interval: any;
    if (status === TestStatus.RUNNING) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setStatus(TestStatus.PASSED);
            return 100;
          }
          // Add random log
          const msgs = [
            { msg: "Wait for element '#submit-btn' visible", details: { selector: '#submit-btn', duration: '200ms' } },
            { msg: "Click element '#submit-btn'", details: { selector: '#submit-btn', params: { x: 120, y: 450, button: 'left' } } },
            { msg: "Check URL contains '/dashboard'", details: { params: { expected: '/dashboard', actual: '/dashboard' } } },
            { msg: "Verify text content 'Welcome'", details: { selector: '.welcome-msg', params: { text: 'Welcome Admin', matchType: 'exact' } } },
            { msg: "Scroll to bottom of page", details: { params: { scrollHeight: 2000, scrollTop: 2000, behavior: 'smooth' } } }
          ];
          const randomItem = msgs[Math.floor(Math.random() * msgs.length)];
          const newLog: LogEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            level: 'INFO',
            message: randomItem.msg,
            details: randomItem.details
          };
          setLogs(prevLogs => [...prevLogs, newLog]);
          return prev + 5;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleStart = () => {
    setStatus(TestStatus.RUNNING);
    setLogs(mockLogs);
    setProgress(0);
  };

  const handleStop = () => {
    setStatus(TestStatus.FAILED);
    const stopLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: 'ERROR',
        message: 'User stopped execution manually',
        details: {
            stackTrace: 'Error: Execution interrupted by user...',
            params: { userId: 'admin', reason: 'manual_stop' }
        }
    }
    setLogs(prev => [...prev, stopLog]);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
      {/* Top Control Panel */}
      <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
                className="pl-9 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none w-full md:w-64 appearance-none"
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
            >
                {state.testCases.map(tc => (
                <option key={tc.id} value={tc.id}>{tc.name}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
          
          <div className="h-6 w-px bg-gray-700 mx-2"></div>

          <div className="flex gap-2">
            {status !== TestStatus.RUNNING ? (
              <button onClick={handleStart} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-wide">
                <Play size={14} fill="currentColor" /> Run
              </button>
            ) : (
              <button onClick={() => setStatus(TestStatus.WAITING)} className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-wide">
                <Pause size={14} fill="currentColor" /> Pause
              </button>
            )}
            <button onClick={handleStop} className="flex items-center gap-2 bg-red-900/50 hover:bg-red-900/80 text-red-400 border border-red-800 px-4 py-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-wide">
              <Square size={14} fill="currentColor" /> Stop
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors" title="Step Over">
              <SkipForward size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="flex-1 md:w-64">
             <div className="flex justify-between text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-bold">
               <span>Progress</span>
               <span>{progress}%</span>
             </div>
             <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
               <div 
                  className={`h-full transition-all duration-300 ${
                    status === TestStatus.FAILED ? 'bg-red-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${progress}%` }}
                ></div>
             </div>
          </div>
          <div className="text-right pl-4 border-l border-gray-700">
             <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Duration</div>
             <div className="font-mono text-sm text-gray-200">00:0{Math.floor(progress / 10)}:23</div>
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-gray-900">
        
        {/* Left: Logs */}
        <div className="flex-1 flex flex-col border-r border-gray-700 bg-gray-900/50">
          <div className="bg-gray-800/50 px-4 py-2 flex justify-between items-center border-b border-gray-700">
             <div className="flex items-center gap-2 text-gray-300 text-xs font-bold uppercase tracking-wider">
               <Terminal size={14} />
               <span>Execution Logs</span>
             </div>
             <div className="flex gap-2">
                <button className="text-gray-500 hover:text-white transition-colors" title="Clear"><RefreshCw size={12} /></button>
             </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs custom-scrollbar space-y-1">
            {logs.length === 0 && <span className="text-gray-600 italic">Waiting to start execution...</span>}
            {logs.map((log) => (
              <div 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className="flex gap-3 group cursor-pointer hover:bg-gray-800 rounded p-1.5 -mx-1.5 transition-colors border border-transparent hover:border-gray-700"
              >
                <span className="text-gray-600 shrink-0 select-none">[{log.timestamp}]</span>
                <span className={`
                  ${log.level === 'INFO' ? 'text-blue-400' : ''}
                  ${log.level === 'ERROR' ? 'text-red-400' : ''}
                  ${log.level === 'WARN' ? 'text-yellow-400' : ''}
                  ${log.level === 'DEBUG' ? 'text-gray-500' : ''}
                  ${log.level === 'SUCCESS' ? 'text-green-400' : ''}
                  w-14 shrink-0 font-bold
                `}>{log.level}</span>
                <div className="flex-1 flex justify-between items-start gap-2 min-w-0">
                    <span className="text-gray-300 break-all leading-relaxed">{log.message}</span>
                    <Info size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" />
                </div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Right: Browser Preview */}
        <div className="lg:w-1/2 flex flex-col bg-gray-100">
           {/* Browser Toolbar (Light Theme for Browser simulation) */}
           <div className="bg-gray-200 px-3 py-2 border-b border-gray-300 flex items-center gap-3 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-green-500/20"></div>
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-600 flex items-center border border-gray-300 shadow-sm truncate">
                 <Globe size={10} className="mr-2 text-gray-400" />
                 {activeCase?.targetUrl || 'about:blank'}
              </div>
              <div className="flex gap-2 text-gray-500">
                 <Camera size={14} className="cursor-pointer hover:text-gray-800 transition-colors" />
                 <Maximize2 size={14} className="cursor-pointer hover:text-gray-800 transition-colors" />
              </div>
           </div>
           
           {/* Browser Viewport */}
           <div className="flex-1 relative bg-white flex items-center justify-center overflow-hidden">
             {status === TestStatus.IDLE ? (
               <div className="text-center text-gray-300">
                  <Globe size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">Browser Preview Inactive</p>
               </div>
             ) : (
               <div className="w-full h-full p-6 overflow-y-auto relative">
                 <div className="border-2 border-dashed border-gray-200 rounded-xl h-[120%] flex flex-col items-center justify-center p-8 bg-gray-50/50">
                    <p className="text-gray-400 font-medium text-sm">Remote WebDriver Session Active</p>
                    <p className="text-gray-300 text-xs mt-1 animate-pulse">Streaming visual output...</p>
                    
                    {/* Simulated DOM Skeleton */}
                    <div className="mt-12 space-y-6 w-full max-w-lg opacity-50">
                       <div className="h-12 bg-blue-100 rounded-lg border border-blue-200 w-full"></div>
                       <div className="flex gap-4">
                           <div className="h-32 bg-gray-100 rounded-lg border border-gray-200 w-1/3"></div>
                           <div className="h-32 bg-gray-100 rounded-lg border border-gray-200 w-2/3"></div>
                       </div>
                       <div className="h-64 bg-gray-100 rounded-lg border border-gray-200 w-full"></div>
                    </div>
                 </div>
                 
                 {/* Interaction Highlight Overlay */}
                 {status === TestStatus.RUNNING && (
                   <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-12 border-2 border-red-500 bg-red-500/10 rounded-lg pointer-events-none animate-ping opacity-75">
                        <span className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-1 rounded">Action Target</span>
                   </div>
                 )}
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Log Details Modal (Dark Theme Updated) */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedLog(null)}>
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                    <h3 className="font-bold text-gray-100 flex items-center gap-3">
                    Log Details
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-wide ${
                        selectedLog.level === 'ERROR' ? 'bg-red-900/30 text-red-400 border-red-800' : 
                        selectedLog.level === 'WARN' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 
                        selectedLog.level === 'SUCCESS' ? 'bg-green-900/30 text-green-400 border-green-800' :
                        'bg-blue-900/30 text-blue-400 border-blue-800'
                    }`}>{selectedLog.level}</span>
                    </h3>
                    <button onClick={() => setSelectedLog(null)} className="text-gray-500 hover:text-white"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Message */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Message</label>
                        <div className="text-gray-300 font-mono text-sm bg-gray-900 p-3 rounded border border-gray-700 break-words">
                            {selectedLog.message}
                        </div>
                    </div>

                    {/* Details Grid */}
                    {selectedLog.details && (
                        <div className="grid grid-cols-2 gap-4">
                            {selectedLog.details.selector && (
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                                        <MousePointer size={12} /> Target Element
                                    </label>
                                    <code className="block text-blue-400 bg-blue-900/20 p-2 rounded border border-blue-900/50 text-xs font-mono">
                                        {selectedLog.details.selector}
                                    </code>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4 col-span-2">
                                {selectedLog.details.duration && (
                                    <div className="bg-gray-900/50 p-2 rounded border border-gray-700/50">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Duration</label>
                                        <p className="text-sm text-gray-300 font-mono mt-0.5">{selectedLog.details.duration}</p>
                                    </div>
                                )}
                                {selectedLog.timestamp && (
                                    <div className="bg-gray-900/50 p-2 rounded border border-gray-700/50">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Timestamp</label>
                                        <p className="text-sm text-gray-300 font-mono mt-0.5">{selectedLog.timestamp}</p>
                                    </div>
                                )}
                            </div>

                            {/* Params */}
                            {selectedLog.details.params && (
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                                        <FileJson size={12} /> Context Data
                                    </label>
                                    <pre className="text-xs bg-gray-950 text-green-400 p-3 rounded overflow-x-auto border border-gray-800 custom-scrollbar">
                                        {JSON.stringify(selectedLog.details.params, null, 2)}
                                    </pre>
                                </div>
                            )}
                            {/* Stack Trace */}
                            {selectedLog.details.stackTrace && (
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 text-red-400 mb-2">
                                        <AlertOctagon size={12} /> Stack Trace
                                    </label>
                                    <pre className="text-xs bg-red-950/30 text-red-300 p-3 rounded border border-red-900/50 overflow-x-auto whitespace-pre-wrap font-mono custom-scrollbar">
                                        {selectedLog.details.stackTrace}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {!selectedLog.details && (
                        <div className="text-center py-8 bg-gray-900/50 rounded-lg border border-dashed border-gray-700">
                            <Info size={32} className="mx-auto text-gray-600 mb-2" />
                            <p className="text-sm text-gray-500 italic">No additional details available.</p>
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex justify-end">
                    <button onClick={() => setSelectedLog(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-lg text-sm font-medium transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};