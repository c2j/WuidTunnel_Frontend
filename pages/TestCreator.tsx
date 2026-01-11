import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';
import { TestStatus, BrowserType, TestCase, AutomationStep, AgentRole, ChatMessage } from '../types';
import { 
  Bot, Sparkles, X,
  Square, Circle, Pause, MousePointer, RefreshCcw, ChevronRight,
  Brain, Eye, Zap, ShieldCheck, Send, List, FileText, Layers, Code, Save, RotateCcw,
  Plus, ShoppingCart, User, LayoutGrid, Settings, LogOut, Lock, Search as MagnifyingGlass,
  GitBranch, Repeat, CornerDownRight
} from 'lucide-react';
import { generateId } from '../services/mockService';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

// --- Agent Visualization Components ---
const AgentBadge = ({ role }: { role?: AgentRole }) => {
  if (!role) return null;
  const config = {
    planner: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Brain, label: 'Planner' },
    observer: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Eye, label: 'Observer' },
    executor: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Zap, label: 'Executor' },
    verifier: { color: 'bg-green-100 text-green-700 border-green-200', icon: ShieldCheck, label: 'Verifier' },
  };
  const C = config[role];
  return (
    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${C.color} mr-2`}>
      <C.icon size={10} /> {C.label}
    </span>
  );
};

interface AgentProcessStepProps {
  active: boolean;
  completed: boolean;
  icon: any;
  title: string;
}

const AgentProcessStep: React.FC<AgentProcessStepProps> = ({ active, completed, icon: Icon, title }) => (
  <div className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all flex-1 border ${active ? 'bg-white border-blue-200 shadow-sm relative overflow-hidden' : 'bg-gray-100 border-transparent opacity-70'}`}>
    {active && <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 animate-pulse" />}
    <div className={`mb-1.5 p-1 rounded-full ${active ? 'bg-blue-100 text-blue-600' : completed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
       <Icon size={14} />
    </div>
    <h4 className={`text-[10px] font-bold ${active ? 'text-blue-700' : 'text-gray-600'}`}>{title}</h4>
  </div>
);

// --- Mock Element ---
interface MockElementProps {
  selector: string;
  type: 'button' | 'input' | 'text' | 'container' | 'link';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onRecord: (action: string, selector: string, value?: string) => void;
  isRecording: boolean;
  isSpying: boolean;
}

const MockElement: React.FC<MockElementProps> = ({ selector, type, children, className, onRecord, isRecording, isSpying, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
    if (isSpying) { onRecord('spy', selector); return; }
    if (isRecording) {
      if (type === 'input') {
         const val = prompt(`Enter value for ${selector}:`, 'test-value');
         if (val !== null) onRecord('input', selector, val);
      } else if (type === 'text') {
         onRecord('verify', selector, children?.toString() || '');
      } else {
         onRecord('click', selector);
      }
    }
  };

  let borderClass = '';
  if (isSpying && isHovered) borderClass = 'ring-2 ring-purple-500 cursor-crosshair';
  else if (isRecording && isHovered) borderClass = 'ring-2 ring-red-500 cursor-pointer';

  return (
    <div 
      className={`transition-all duration-200 relative ${className} ${borderClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      title={selector}
    >
       {children}
       {isHovered && (isRecording || isSpying) && (
         <span className={`absolute -top-5 left-0 text-[10px] px-1 text-white z-50 rounded shadow-sm whitespace-nowrap
            ${isSpying ? 'bg-purple-600' : 'bg-red-600'}`}>
            {selector}
         </span>
       )}
    </div>
  );
};

// --- Mock TodoMVC App ---
const MockTodoApp = ({ commonProps }: { commonProps: any }) => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Analyze requirements', completed: true },
    { id: 2, text: 'Design test cases', completed: false },
    { id: 3, text: 'Run automation scripts', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    setTodos([...todos, { id: Date.now(), text: inputValue.trim(), completed: false }]);
    setInputValue('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };
  
  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  }

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center pt-12 font-sans overflow-y-auto">
       <div className="mb-8 text-center shrink-0">
          <h1 className="text-6xl font-thin text-red-900/20 mb-2">todos</h1>
          <p className="text-xs text-gray-500">AI Testing Playground</p>
       </div>
       
       <div className="w-full max-w-[550px] bg-white shadow-xl relative shrink-0 mb-10">
          <div className="flex items-center border-b border-gray-200 pl-4 bg-white/95">
             <span className="text-gray-300 transform rotate-90 text-xl">&#10095;</span>
             <MockElement selector="input.new-todo" type="input" className="flex-1" {...commonProps}>
                <input 
                   className="w-full py-4 px-4 text-xl italic placeholder-gray-300 focus:outline-none"
                   placeholder="What needs to be done?"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => {
                       if(e.key === 'Enter') {
                           handleAdd();
                           if(commonProps.isRecording) commonProps.onRecord('input', 'input.new-todo', inputValue);
                           if(commonProps.isRecording) commonProps.onRecord('press', 'Enter');
                       }
                   }}
                />
             </MockElement>
          </div>

          <ul className="bg-white">
             {todos.map(todo => (
                 <li key={todo.id} className="group flex items-center border-b border-gray-100 py-3 pl-2 pr-4 hover:bg-gray-50/50 transition-colors">
                     <MockElement selector={`input.toggle[data-id="${todo.id}"]`} type="button" className="mr-2" {...commonProps} onClick={() => toggleTodo(todo.id)}>
                        <div className={`w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer ${todo.completed ? 'border-green-500' : ''}`}>
                             {todo.completed && <span className="text-green-500 text-lg">&#10003;</span>}
                        </div>
                     </MockElement>
                     <MockElement selector={`label.todo-label[data-id="${todo.id}"]`} type="text" className="flex-1 select-none" {...commonProps}>
                        <span className={`text-xl transition-all ${todo.completed ? 'text-gray-300 line-through' : 'text-gray-700'}`}>
                           {todo.text}
                        </span>
                     </MockElement>
                     <MockElement selector={`button.destroy[data-id="${todo.id}"]`} type="button" {...commonProps} onClick={() => deleteTodo(todo.id)}>
                        <button className="text-red-900/40 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all font-light text-xl px-2">
                           &times;
                        </button>
                     </MockElement>
                 </li>
             ))}
          </ul>
          
          <div className="px-4 py-3 flex justify-between items-center text-sm text-gray-500 border-t border-gray-200 bg-white relative z-10">
              <MockElement selector=".todo-count" type="text" {...commonProps}>
                 <span><strong>{todos.filter(t => !t.completed).length}</strong> items left</span>
              </MockElement>
              
              <div className="flex gap-4">
                 <MockElement selector="a.filter-all" type="link" {...commonProps}>
                    <button className="hover:underline font-bold px-1 rounded border border-transparent hover:border-red-100">All</button>
                 </MockElement>
                 <MockElement selector="a.filter-active" type="link" {...commonProps}>
                    <button className="hover:underline px-1 rounded border border-transparent hover:border-red-100">Active</button>
                 </MockElement>
                 <MockElement selector="a.filter-completed" type="link" {...commonProps}>
                    <button className="hover:underline px-1 rounded border border-transparent hover:border-red-100">Completed</button>
                 </MockElement>
              </div>

              {todos.some(t => t.completed) && (
                  <MockElement selector="button.clear-completed" type="button" {...commonProps} onClick={clearCompleted}>
                     <button className="hover:underline">Clear completed</button>
                  </MockElement>
              )}
          </div>
          
          {/* Stacked paper effect */}
          <div className="absolute inset-x-1 -bottom-1 h-2 bg-white shadow-sm border border-gray-200 z-0" />
          <div className="absolute inset-x-2 -bottom-2 h-2 bg-white shadow-sm border border-gray-200 -z-10" />
       </div>
       
       <div className="mt-8 text-center text-[10px] text-gray-400 shrink-0">
           <p>Double-click to edit a todo</p>
           <p>Created by <a href="#" className="hover:underline">WuidTunnel</a></p>
           <p>Part of <a href="#" className="hover:underline">TodoMVC</a></p>
       </div>
    </div>
  );
};

// --- Recursive Step Renderer ---
const StepRenderer = ({ steps, depth = 0 }: { steps: AutomationStep[], depth?: number }) => {
    return (
        <div className={`w-full ${depth > 0 ? 'border-l-2 border-gray-700 ml-3 pl-3 my-1' : 'divide-y divide-gray-800'}`}>
            {steps.map((step, index) => (
                <div key={step.id} className="relative">
                   <div className={`group flex items-start p-2 hover:bg-gray-800 transition-colors rounded ${depth > 0 ? 'bg-gray-800/30 mb-1' : ''}`}>
                        {/* Connecting line for nested items */}
                        {depth > 0 && <div className="absolute -left-3.5 top-5 w-3 h-px bg-gray-700"></div>}
                        
                        <div className="w-6 text-center text-gray-600 text-xs font-mono mr-2 pt-0.5 shrink-0">{step.order}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <AgentBadge role={step.agentRole as AgentRole} />
                                {step.action === 'condition' ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border text-purple-400 border-purple-900 bg-purple-900/20">
                                        <GitBranch size={10} /> IF
                                    </span>
                                ) : step.action === 'loop' ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border text-orange-400 border-orange-900 bg-orange-900/20">
                                        <Repeat size={10} /> LOOP
                                    </span>
                                ) : (
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${step.action === 'verify' ? 'text-green-400 border-green-900 bg-green-900/20' : 'text-gray-400 border-gray-700 bg-gray-800'}`}>
                                        {step.action}
                                    </span>
                                )}
                                <span className="text-gray-300 text-xs font-mono truncate max-w-[150px]" title={step.targetSelector}>{step.targetSelector}</span>
                            </div>
                            <p className="text-gray-500 text-xs">{step.description}</p>
                            {step.reasoning && (
                                <p className="text-gray-600 text-[10px] mt-1 italic pl-2 border-l-2 border-gray-700/50">
                                    Logic: {step.reasoning}
                                </p>
                            )}
                        </div>
                   </div>
                   
                   {/* Recursive Children */}
                   {step.action === 'condition' && (
                       <div className="mt-1">
                           {step.trueSteps && step.trueSteps.length > 0 && (
                               <div className="relative">
                                    <div className="flex items-center gap-2 ml-4 mb-1">
                                        <CornerDownRight size={12} className="text-green-500/50" />
                                        <span className="text-[10px] font-bold text-green-500/80 uppercase tracking-wider">True Branch</span>
                                    </div>
                                    <StepRenderer steps={step.trueSteps} depth={depth + 1} />
                               </div>
                           )}
                           {step.falseSteps && step.falseSteps.length > 0 && (
                               <div className="relative mt-2">
                                    <div className="flex items-center gap-2 ml-4 mb-1">
                                        <CornerDownRight size={12} className="text-red-500/50" />
                                        <span className="text-[10px] font-bold text-red-500/80 uppercase tracking-wider">False Branch</span>
                                    </div>
                                    <StepRenderer steps={step.falseSteps} depth={depth + 1} />
                               </div>
                           )}
                       </div>
                   )}

                   {step.action === 'loop' && step.loopSteps && step.loopSteps.length > 0 && (
                        <div className="mt-1 relative">
                            <div className="flex items-center gap-2 ml-4 mb-1">
                                <CornerDownRight size={12} className="text-orange-500/50" />
                                <span className="text-[10px] font-bold text-orange-500/80 uppercase tracking-wider">Loop Body</span>
                            </div>
                            <StepRenderer steps={step.loopSteps} depth={depth + 1} />
                        </div>
                   )}
                </div>
            ))}
        </div>
    );
};

export const TestCreator: React.FC = () => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const draft = state.draft;
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [draft.chatHistory]);

  // Sync generated steps to script cache (overwrites manual edits if steps change)
  useEffect(() => {
     const scripts = generateScripts(draft.generatedSteps);
     const jsonContent = JSON.stringify(draft.generatedSteps, null, 2);
     
     dispatch({ 
        type: 'UPDATE_DRAFT', 
        payload: { 
            scriptCache: {
                karate: scripts.karate,
                robot: scripts.robot,
                json: jsonContent,
                steps: '' // steps tab doesn't use editorContent
            },
            // If currently viewing a script tab, update editor content immediately to reflect new steps
            editorContent: draft.activeTab === 'json' ? jsonContent :
                           draft.activeTab === 'karate' ? scripts.karate :
                           draft.activeTab === 'robot' ? scripts.robot : 
                           draft.editorContent
        } 
     });
  }, [draft.generatedSteps, draft.formData]);

  // Handle Tab Switch: Load content from cache into editor
  useEffect(() => {
      if (draft.activeTab === 'steps') return;
      
      const content = draft.scriptCache[draft.activeTab] || '';
      if (content !== draft.editorContent) {
          dispatch({ type: 'UPDATE_DRAFT', payload: { editorContent: content } });
      }
  }, [draft.activeTab]);

  // --- Handlers ---
  const handleSave = () => {
    if (!draft.formData.name || !draft.formData.name.trim()) {
        alert("Please enter a Scenario Name before saving.");
        return;
    }

    const newCase: TestCase = {
      id: generateId(),
      name: draft.formData.name,
      description: draft.formData.description || 'Generated by WuidTunnel Agent',
      requirementText: draft.chatHistory.filter(m => m.role === 'user').map(m => m.content).join('\n'),
      targetUrl: draft.formData.targetUrl || '',
      browserType: draft.formData.browserType || BrowserType.Chrome,
      timeoutSeconds: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: TestStatus.IDLE,
      tags: draft.formData.tags || [],
      automationSteps: draft.generatedSteps,
      scripts: draft.scriptCache // Save the manually edited scripts
    };
    dispatch({ type: 'ADD_TEST_CASE', payload: newCase });
    dispatch({ type: 'RESET_DRAFT' });
    navigate('/test-cases');
  };

  const generateScripts = (steps: AutomationStep[]) => {
    const safeName = draft.formData.name || 'AI Generated Test';
    const safeDesc = draft.formData.description || 'Automated flow generated by WuidTunnel';
    const safeUrl = draft.formData.targetUrl || 'about:blank';
    const browser = (draft.formData.browserType || 'Chrome').toLowerCase();

    // Karate Template
    let karate = `Feature: ${safeName}\n\n  Background:\n    * configure driver = { type: '${browser}', showDriverLog: true }\n\n  Scenario: ${safeDesc}\n`;
    
    // Robot Template
    let robot = `*** Settings ***\nLibrary           SeleniumLibrary\n\n*** Variables ***\n\${BROWSER}        ${browser}\n\${URL}            ${safeUrl}\n\n*** Test Cases ***\n${safeName}\n    Open Browser    \${URL}    \${BROWSER}\n    Maximize Browser Window\n`;

    const processSteps = (stepList: AutomationStep[], indent: number, lang: 'karate' | 'robot'): string => {
        let output = '';
        const pad = (n: number) => '    '.repeat(n);

        stepList.forEach(step => {
            const selector = step.targetSelector || 'body';
            const val = step.value || '';
            const desc = step.description || '';

            if (lang === 'karate') {
                const p = pad(indent);
                output += `${p}# ${desc}\n`;
                if (step.action === 'navigate') output += `${p}* driver '${val}'\n`;
                else if (step.action === 'click') output += `${p}* click('${selector}')\n`;
                else if (step.action === 'input') output += `${p}* input('${selector}', '${val}')\n`;
                else if (step.action === 'wait') output += `${p}* delay(${parseInt(val) || 1000})\n`;
                else if (step.action === 'verify') output += `${p}* match text('${selector}') contains '${val}'\n`;
                else if (step.action === 'scroll') output += `${p}* scroll('${selector}')\n`;
                else if (step.action === 'condition') {
                    output += `${p}# Logic: ${desc}\n`;
                    output += `${p}* if (exists('${selector}')) {\n`;
                    if (step.trueSteps) output += processSteps(step.trueSteps, indent + 1, 'karate');
                    output += `${p}}\n`;
                    if (step.falseSteps && step.falseSteps.length > 0) {
                        output += `${p}* else {\n`;
                        output += processSteps(step.falseSteps, indent + 1, 'karate');
                        output += `${p}}\n`;
                    }
                } else if (step.action === 'loop') {
                    output += `${p}# Loop: ${desc}\n`;
                    output += `${p}* eval karate.forEach(${selector}, function(item){ /* Loop logic placeholder */ })\n`;
                    if (step.loopSteps) output += processSteps(step.loopSteps, indent + 1, 'karate');
                }
            } else {
                const p = '    ';
                output += `    # ${desc}\n`;
                if (step.action === 'navigate') output += `${p}Go To    ${val}\n`;
                else if (step.action === 'click') output += `${p}Click Element    css:${selector}\n`;
                else if (step.action === 'input') output += `${p}Input Text    css:${selector}    ${val}\n`;
                else if (step.action === 'wait') output += `${p}Sleep    ${(parseInt(val) || 1000)/1000}s\n`;
                else if (step.action === 'verify') output += `${p}Element Should Contain    css:${selector}    ${val}\n`;
                else if (step.action === 'scroll') output += `${p}Scroll Element Into View    css:${selector}\n`;
                else if (step.action === 'condition') {
                    output += `${p}\${status}=    Run Keyword And Return Status    Page Should Contain Element    css:${selector}\n`;
                    output += `${p}IF    '\${status}' == 'True'\n`;
                    if (step.trueSteps) output += processSteps(step.trueSteps, 1, 'robot'); 
                    if (step.falseSteps && step.falseSteps.length > 0) {
                        output += `${p}ELSE\n`;
                        output += processSteps(step.falseSteps, 1, 'robot');
                    }
                    output += `${p}END\n`;
                } else if (step.action === 'loop') {
                     output += `${p}@{elements} =    Get WebElements    css:${selector}\n`;
                     output += `${p}FOR    \${element}    IN    @{elements}\n`;
                     if (step.loopSteps) output += processSteps(step.loopSteps, 1, 'robot');
                     output += `${p}END\n`;
                }
            }
        });
        return output;
    };

    karate += processSteps(steps, 1, 'karate');
    robot += processSteps(steps, 1, 'robot');
    robot += '    Close Browser\n';

    return { karate, robot };
  };

  const handleManualRecord = (action: string, selector: string, value?: string) => {
      if (draft.recordingState === 'spy') {
          dispatch({ type: 'UPDATE_DRAFT', payload: { 
             userInput: `${draft.userInput} ${selector}`.trim(),
             recordingState: 'idle' 
          }});
          return;
      }
      const newStep: AutomationStep = {
          id: generateId(),
          order: draft.generatedSteps.length + 1,
          action: action as any,
          targetSelector: selector,
          value: value,
          description: `Manual: ${action} on ${selector}`,
          agentRole: 'executor'
      };
      
      dispatch({ type: 'UPDATE_DRAFT', payload: {
          generatedSteps: [...draft.generatedSteps, newStep],
          chatHistory: [...draft.chatHistory, {
              id: generateId(),
              role: 'system',
              content: `⏺ Recorded: ${action} on ${selector}`,
              timestamp: new Date().toLocaleTimeString(),
              agentRole: 'executor'
          }]
      }});
  };

  const handleNavigate = () => {
      if (draft.urlInput) {
          let target = draft.urlInput;
          if (!target.startsWith('http')) target = 'https://' + target;
          
          const updates: Partial<typeof draft> = { browserUrl: target, formData: { ...draft.formData, targetUrl: target } };
          
          handleManualRecord('navigate', 'url', target);
          
          dispatch({ type: 'UPDATE_DRAFT', payload: updates });
      }
  };

  const handleSendMessage = async () => {
    if (!draft.userInput.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: draft.userInput,
      timestamp: new Date().toLocaleTimeString()
    };

    dispatch({ type: 'UPDATE_DRAFT', payload: {
        chatHistory: [...draft.chatHistory, userMsg],
        userInput: '',
        agentState: 'planning'
    }});

    try {
        await processUserInstruction(userMsg.content);
    } catch (e) {
        dispatch({ type: 'UPDATE_DRAFT', payload: {
             chatHistory: [...draft.chatHistory, userMsg, { id: generateId(), role: 'system', content: `Error: ${e}`, timestamp: new Date().toLocaleTimeString() }],
             agentState: 'waiting_for_user'
        }});
    }
  };

  const processUserInstruction = async (instruction: string) => {
      const hasKey = !!process.env.API_KEY;
      
      const urlMatch = instruction.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
           const url = urlMatch[0];
           dispatch({ type: 'UPDATE_DRAFT', payload: {
              browserUrl: url,
              urlInput: url,
              formData: { ...draft.formData, targetUrl: url }
           }});
      }

      let scenarios: string[] = [];
      let newSteps: AutomationStep[] = [];
      let stepsForHistory = [...draft.generatedSteps];
      
      if (hasKey) {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          // Phase 1: Planner
          const planPrompt = `
             User Requirement: "${instruction}"
             Current URL: "${draft.browserUrl}"
             Task: 
             1. Analyze the requirement and intent (e.g. Login, Form Fill, Data validation).
             2. Suggest a short "testCaseName".
             3. Suggest a "testCaseDescription".
             4. Break down this requirement into logical high-level Scenarios.
             
             Return JSON: { "testCaseName": "...", "testCaseDescription": "...", "scenarios": ["Precondition: Logged out", "Scenario 1: ..."], "reasoning": "..." }
          `;
          
          const planResponse = await ai.models.generateContent({
             model: "gemini-3-flash-preview",
             contents: planPrompt,
             config: { responseMimeType: "application/json" }
          });
          const planResult = JSON.parse(planResponse.text || '{}');
          scenarios = planResult.scenarios || ["Default Scenario"];

          dispatch({ type: 'UPDATE_DRAFT', payload: {
             formData: {
                ...draft.formData,
                name: planResult.testCaseName || draft.formData.name,
                description: planResult.testCaseDescription || draft.formData.description
             },
             chatHistory: [...draft.chatHistory, { id: generateId(), role: 'user', content: instruction, timestamp: new Date().toLocaleTimeString() }, {
                id: generateId(),
                role: 'model',
                content: `Planner: Decomposed into ${scenarios.length} scenarios: ${scenarios.join(', ')}.`,
                timestamp: new Date().toLocaleTimeString(),
                agentRole: 'planner'
             }],
             agentState: 'observing'
          }});

          await new Promise(r => setTimeout(r, 600)); 

          // Phase 2: Observer & Selector & Executor
           dispatch({ type: 'UPDATE_DRAFT', payload: {
             chatHistory: [...draft.chatHistory, {
                id: generateId(),
                role: 'model',
                content: `Observer: Analyzing page structure for interactive elements...`,
                timestamp: new Date().toLocaleTimeString(),
                agentRole: 'observer'
             }],
             agentState: 'executing'
          }});
          
          const actionPrompt = `
             Role: Senior SDET (Software Development Engineer in Test).
             Task: Generate precise, robust automation steps for the provided User Requirement and Scenarios.

             Context:
             - User Requirement: "${instruction}"
             - Plan: ${JSON.stringify(scenarios)}
             - URL: "${draft.browserUrl}"

             Step Generation Rules:
             1. **Selectors**: strict preference order: ID (#) > data-attributes ([data-test]) > Name ([name]) > Unique Class (.) > Text Content. *Avoid brittle structure-based selectors (e.g., div > div > span).*
             2. **Oracles (Verify)**: You MUST include verification steps to ensure quality.
                - **Text Content**: Action='verify', Value='Expected Text'. (e.g. "Welcome, User")
                - **Visibility**: Action='verify', Value='visible' or 'hidden'. (e.g. "Dialog should appear")
                - **State/Attribute**: Action='verify', Value='enabled', 'disabled', 'checked'.
             3. **Complex Logic**:
                - Use 'condition' only when the flow has branching paths (e.g., "If popup exists, close it").
                - Use 'loop' when processing dynamic lists of items (e.g., "Delete all todo items").
             4. **Wait Strategies**: implicit waits are preferred, but use explicit 'wait' actions for anticipated async operations (spinners, animations).

             Output Schema (JSON):
             {
               "new_steps": [
                 {
                   "action": "navigate" | "input" | "click" | "wait" | "verify" | "scroll" | "condition" | "loop",
                   "targetSelector": "CSS selector string",
                   "value": "input text, expected value, or wait time (ms)",
                   "description": "Concise, business-readable step description",
                   "agentRole": "executor" | "verifier",
                   "reasoning": "Why this selector/action was chosen (chain-of-thought)",
                   "trueSteps": [ ...Recursive Step Schema... ],
                   "falseSteps": [ ...Recursive Step Schema... ],
                   "loopSteps": [ ...Recursive Step Schema... ]
                 }
               ]
             }
          `;

          const actionResponse = await ai.models.generateContent({
             model: "gemini-3-flash-preview",
             contents: actionPrompt,
             config: { responseMimeType: "application/json" }
          });
          const actionResult = JSON.parse(actionResponse.text || '{}');
          newSteps = (actionResult.new_steps || []).map((s: any) => ({ ...s, id: generateId() }));

      } else {
          // --- Fallback Simulation ---
          await new Promise(r => setTimeout(r, 800));
          
          const isLogin = instruction.toLowerCase().includes('login') || draft.browserUrl.includes('login');
          const isSearch = instruction.toLowerCase().includes('search') || draft.browserUrl.includes('search');
          
          scenarios = isLogin ? ['Enter Credentials', 'Submit Form', 'Verify Success'] :
                      isSearch ? ['Enter Query', 'Click Search', 'Verify Results'] :
                      ['Interact with Element', 'Verify State'];
          
          dispatch({ type: 'UPDATE_DRAFT', payload: {
             formData: {
                 ...draft.formData,
                 name: isLogin ? 'Login Verification' : isSearch ? 'Search Functionality' : 'UI Interaction Test',
                 description: 'Auto-generated test case based on user prompt.'
             },
             agentState: 'observing',
             chatHistory: [...draft.chatHistory, {
                id: generateId(),
                role: 'model',
                content: `Planner: Decomposed task into: ${scenarios.join(' -> ')}`,
                timestamp: new Date().toLocaleTimeString(),
                agentRole: 'planner'
             }]
          }});

          await new Promise(r => setTimeout(r, 600));
          
          dispatch({ type: 'UPDATE_DRAFT', payload: { agentState: 'executing' }});

          if (isLogin) {
              newSteps = [
                  { id: generateId(), order: 0, action: 'input', targetSelector: 'input#username', value: 'user@example.com', description: 'Input Username', agentRole: 'executor' },
                  { id: generateId(), order: 0, action: 'input', targetSelector: 'input#password', value: '********', description: 'Input Password', agentRole: 'executor' },
                  { id: generateId(), order: 0, action: 'click', targetSelector: 'button.login-btn', description: 'Click Login', agentRole: 'executor' },
                  { id: generateId(), order: 0, action: 'verify', targetSelector: 'div.welcome', value: 'Welcome', description: 'Oracle: Check Welcome Message', agentRole: 'verifier' }
              ];
          } else if (isSearch) {
              newSteps = [
                  { id: generateId(), order: 0, action: 'input', targetSelector: 'input[name="q"]', value: 'MacBook Pro', description: 'Enter search query', agentRole: 'executor' },
                  { id: generateId(), order: 0, action: 'click', targetSelector: 'button.search-icon', description: 'Click Search', agentRole: 'executor' },
                  { id: generateId(), order: 0, action: 'verify', targetSelector: '.result-count', value: 'results found', description: 'Oracle: Verify results appear', agentRole: 'verifier' }
              ];
          } else {
              newSteps = [
                  { id: generateId(), order: 0, action: 'click', targetSelector: 'nav a.active', description: 'Click Nav Link', agentRole: 'executor' },
                  { id: generateId(), order: 0, action: 'wait', value: '1000', description: 'Wait for load', agentRole: 'executor' }
              ];
          }
      }

      const nextOrder = stepsForHistory.length + 1;
      const orderedSteps = newSteps.map((s, i) => ({...s, order: nextOrder + i}));
      
      dispatch({ type: 'UPDATE_DRAFT', payload: {
          generatedSteps: [...stepsForHistory, ...orderedSteps],
          chatHistory: [...draft.chatHistory, { 
             id: generateId(), 
             role: 'model', 
             content: `Executor: Generated ${newSteps.length} steps based on plan.`, 
             timestamp: new Date().toLocaleTimeString(),
             agentRole: 'executor'
          }],
          agentState: 'waiting_for_user'
      }});
  };

  const renderMockPage = () => {
    const commonProps = { 
        onRecord: handleManualRecord, 
        isRecording: draft.recordingState === 'recording', 
        isSpying: draft.recordingState === 'spy' 
    };
    
    // Always render Todo Mock
    return <MockTodoApp commonProps={commonProps} />;
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col overflow-hidden bg-gray-900 rounded-xl border border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3 flex-1">
           <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-1.5 rounded-lg shrink-0">
              <Bot size={20} className="text-white" />
           </div>
           <div className="flex flex-col w-full max-w-md">
              <input 
                type="text" 
                className="bg-gray-700 border-none text-white text-sm font-bold rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 w-full placeholder-gray-400"
                placeholder="Scenario Name (e.g. Verify Login)"
                value={draft.formData.name || ''}
                onChange={(e) => dispatch({type: 'UPDATE_DRAFT', payload: { formData: { ...draft.formData, name: e.target.value } }})}
              />
              <input 
                type="text" 
                className="bg-transparent border-none text-gray-400 text-xs px-2 py-0.5 focus:ring-0 w-full placeholder-gray-500"
                placeholder="Description (Optional)"
                value={draft.formData.description || ''}
                onChange={(e) => dispatch({type: 'UPDATE_DRAFT', payload: { formData: { ...draft.formData, description: e.target.value } }})}
              />
           </div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => dispatch({type: 'RESET_DRAFT'})} className="text-gray-400 hover:text-white flex items-center text-xs px-3 py-1.5 rounded hover:bg-gray-700 transition-colors">
                <RotateCcw size={14} className="mr-1.5" /> Reset
            </button>
            <button onClick={() => navigate('/test-cases')}><X size={24} className="text-gray-400 hover:text-white" /></button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
         {/* LEFT: Browser */}
         <div className="flex-1 flex flex-col border-r border-gray-700 bg-gray-100 relative">
            <div className="bg-gray-200 border-b border-gray-300 px-3 py-2 flex items-center gap-3 shadow-sm shrink-0">
                <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
                   <button onClick={() => dispatch({type: 'UPDATE_DRAFT', payload: {recordingState: draft.recordingState === 'recording' ? 'idle' : 'recording'}})} className={`p-2 rounded hover:bg-gray-300 transition-colors ${draft.recordingState === 'recording' ? 'bg-red-200 text-red-600' : 'text-gray-600'}`}>
                       {draft.recordingState === 'recording' ? <Square size={16} fill="currentColor" /> : <Circle size={16} fill="currentColor" className="text-red-500" />}
                   </button>
                   <button onClick={() => dispatch({type: 'UPDATE_DRAFT', payload: {recordingState: draft.recordingState === 'spy' ? 'idle' : 'spy'}})} className={`p-2 rounded hover:bg-gray-300 transition-colors ${draft.recordingState === 'spy' ? 'bg-purple-200 text-purple-600' : 'text-gray-600'}`}>
                       <MousePointer size={16} />
                   </button>
                </div>
                <div className="flex-1 flex items-center gap-2">
                   <button onClick={() => dispatch({type: 'UPDATE_DRAFT', payload: {browserUrl: draft.urlInput}})} className="text-gray-500 hover:text-gray-700"><RefreshCcw size={14} /></button>
                   <input 
                      type="text" 
                      className="flex-1 bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-mono" 
                      value={draft.urlInput} 
                      onChange={(e) => dispatch({type: 'UPDATE_DRAFT', payload: {urlInput: e.target.value}})} 
                      onKeyDown={(e) => e.key === 'Enter' && handleNavigate()} 
                      placeholder="Enter URL..." 
                   />
                   <button onClick={handleNavigate} className="text-blue-600"><ChevronRight size={18} /></button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative bg-white">
                {renderMockPage()}
                {draft.agentState !== 'idle' && draft.agentState !== 'waiting_for_user' && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
                        <div className="bg-black/80 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-xl">
                            <Sparkles size={18} className="animate-spin text-purple-400" />
                            <span className="font-medium capitalize">{draft.agentState}...</span>
                        </div>
                    </div>
                )}
            </div>
         </div>

         {/* RIGHT: Agent Panel */}
         <div className="w-[450px] flex flex-col bg-gray-900 border-l border-gray-700">
            {/* Agent Process */}
            <div className="bg-gray-50 p-2 border-b border-gray-200">
                <div className="flex items-center justify-between mb-1 px-1">
                     <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agent Workflow</h3>
                </div>
                <div className="flex gap-2">
                    <AgentProcessStep active={draft.agentState === 'planning'} completed={draft.agentState !== 'planning' && draft.agentState !== 'idle' && draft.generatedSteps.length > 0} icon={Brain} title="Planner" />
                    <AgentProcessStep active={draft.agentState === 'observing'} completed={draft.agentState === 'executing' || (draft.agentState === 'waiting_for_user' && draft.generatedSteps.length > 0)} icon={Eye} title="Observer" />
                    <AgentProcessStep active={draft.agentState === 'executing' || draft.agentState === 'verifying'} completed={draft.agentState === 'waiting_for_user' && draft.generatedSteps.length > 0} icon={Zap} title="Executor" />
                </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
               <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                  {draft.chatHistory.map((msg) => (
                     <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] rounded-xl px-4 py-2 text-sm leading-relaxed shadow-sm flex flex-col
                           ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}>
                           <div className="flex items-center mb-1"><AgentBadge role={msg.agentRole} /></div>
                           {msg.content}
                        </div>
                     </div>
                  ))}
                  <div ref={chatEndRef} />
               </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-900 border-t border-gray-800 shrink-0">
                <div className="relative">
                    <input 
                        type="text" 
                        className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-4 pr-12 py-3 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Describe test requirements..."
                        value={draft.userInput}
                        onChange={(e) => dispatch({type: 'UPDATE_DRAFT', payload: {userInput: e.target.value}})}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={draft.agentState !== 'idle' && draft.agentState !== 'waiting_for_user'}
                    />
                    <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg"><Send size={16} /></button>
                </div>
            </div>

            {/* Artifacts */}
            <div className="h-1/3 border-t border-gray-700 flex flex-col bg-gray-900 shrink-0">
                <div className="flex border-b border-gray-700 bg-gray-800">
                    {[{id: 'steps', icon: List, label: 'Timeline'}, {id: 'karate', icon: FileText, label: 'Karate'}, {id: 'robot', icon: Layers, label: 'Robot'}, {id: 'json', icon: Code, label: 'JSON'}].map(tab => (
                        <button key={tab.id} onClick={() => dispatch({type: 'UPDATE_DRAFT', payload: {activeTab: tab.id as any}})} className={`flex-1 flex items-center justify-center py-2 text-xs font-medium border-r border-gray-700 hover:bg-gray-700 transition-colors ${draft.activeTab === tab.id ? 'bg-gray-900 text-white border-t-2 border-t-blue-500' : 'text-gray-500'}`}>
                            <tab.icon size={12} className="mr-1.5" />{tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-auto p-0 custom-scrollbar bg-gray-900">
                    {draft.activeTab === 'steps' ? (
                       <StepRenderer steps={draft.generatedSteps} />
                    ) : (
                        <textarea 
                            className="w-full h-full bg-gray-900 text-xs font-mono text-gray-300 p-4 resize-none focus:outline-none" 
                            value={draft.editorContent} 
                            onChange={(e) => {
                                const val = e.target.value;
                                dispatch({
                                    type: 'UPDATE_DRAFT', 
                                    payload: { 
                                        editorContent: val,
                                        scriptCache: {
                                            ...draft.scriptCache,
                                            [draft.activeTab]: val
                                        }
                                    }
                                });
                            }} 
                        />
                    )}
                </div>
            </div>
            <div className="p-3 bg-gray-900 border-t border-gray-800 flex justify-end items-center shrink-0">
                <button onClick={handleSave} disabled={draft.generatedSteps.length === 0} className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                    <Save size={16} className="mr-2" /> Save Test Case
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};