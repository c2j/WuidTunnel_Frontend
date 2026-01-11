// Status Enums
export enum TestStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  RUNNING = 'RUNNING',
  WAITING = 'WAITING',
  IDLE = 'IDLE'
}

export enum BrowserType {
  Chrome = 'Chrome',
  Firefox = 'Firefox',
  Edge = 'Edge',
  Safari = 'Safari'
}

// Automation Models
export type ActionType = 'navigate' | 'input' | 'click' | 'wait' | 'verify' | 'scroll' | 'condition' | 'loop';

// AUITestAgent Concepts
export type AgentRole = 'planner' | 'observer' | 'executor' | 'verifier';

export interface AutomationStep {
  id: string;
  order: number;
  action: ActionType;
  targetSelector?: string; // CSS Selector or XPath
  value?: string; // Input value or expected text
  description: string; // Human readable description
  
  // AUITestAgent Extensions
  agentRole?: AgentRole; // Which agent generated this?
  reasoning?: string; // Why did the agent choose this?
  
  trueSteps?: AutomationStep[]; // Steps to execute if condition is true
  falseSteps?: AutomationStep[]; // Steps to execute if condition is false
  loopSteps?: AutomationStep[]; // Steps to execute inside a loop
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  agentRole?: AgentRole;
}

// Data Models
export interface TestCase {
  id: string;
  name: string;
  description: string;
  requirementText: string;
  targetUrl: string;
  browserType: BrowserType;
  timeoutSeconds: number;
  createdAt: string;
  updatedAt: string;
  status: TestStatus;
  lastRun?: string;
  tags: string[];
  automationSteps?: AutomationStep[]; // New field for structured steps
  scripts?: Record<string, string>; // Store generated/edited scripts (karate, robot, etc.)
}

export interface DraftState {
  agentState: 'idle' | 'planning' | 'observing' | 'executing' | 'verifying' | 'waiting_for_user';
  recordingState: 'idle' | 'recording' | 'paused' | 'spy';
  chatHistory: ChatMessage[];
  userInput: string;
  generatedSteps: AutomationStep[];
  browserUrl: string;
  urlInput: string;
  activeTab: 'steps' | 'karate' | 'robot' | 'json';
  formData: Partial<TestCase>;
  editorContent: string;
  scriptCache: Record<string, string>; // Cache to hold script content per tab
}

export interface LogDetails {
  stackTrace?: string;
  selector?: string;
  screenshot?: string;
  duration?: string;
  params?: Record<string, any>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS';
  message: string;
  details?: LogDetails;
}

export interface ExecutionStep {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: string;
}

export interface VerificationPoint {
  id: string;
  description: string;
  status: 'passed' | 'failed' | 'pending';
  result?: string;
}

export interface AppConfiguration {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  defaultBrowser: BrowserType;
  headless: boolean;
  webDriverPath: string;
  maxHistory: number;
}