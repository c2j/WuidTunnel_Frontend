import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TestCase, AppConfiguration, BrowserType, DraftState } from '../types';
import { mockTestCases } from '../services/mockService';

interface AppState {
  testCases: TestCase[];
  config: AppConfiguration;
  draft: DraftState;
}

type Action = 
  | { type: 'ADD_TEST_CASE'; payload: TestCase }
  | { type: 'DELETE_TEST_CASE'; payload: string }
  | { type: 'UPDATE_CONFIG'; payload: Partial<AppConfiguration> }
  | { type: 'UPDATE_DRAFT'; payload: Partial<DraftState> }
  | { type: 'RESET_DRAFT' };

const initialDraft: DraftState = {
  agentState: 'idle',
  recordingState: 'idle',
  chatHistory: [{
    id: 'init',
    role: 'system',
    content: 'AUITestAgent Initialized. Describe your test requirement (e.g., "Verify login flow").',
    timestamp: new Date().toLocaleTimeString()
  }],
  userInput: '',
  generatedSteps: [],
  browserUrl: 'about:blank',
  urlInput: '',
  activeTab: 'steps',
  formData: {
    name: '',
    description: '',
    targetUrl: 'https://',
    browserType: BrowserType.Chrome,
    tags: []
  },
  editorContent: '',
  scriptCache: {}
};

const initialState: AppState = {
  testCases: mockTestCases,
  config: {
    language: 'zh-CN',
    theme: 'light',
    autoSave: true,
    defaultBrowser: BrowserType.Chrome,
    headless: false,
    webDriverPath: '/usr/local/bin/chromedriver',
    maxHistory: 1000
  },
  draft: initialDraft
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TEST_CASE':
      return { ...state, testCases: [action.payload, ...state.testCases] };
    case 'DELETE_TEST_CASE':
      return { ...state, testCases: state.testCases.filter(tc => tc.id !== action.payload) };
    case 'UPDATE_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };
    case 'UPDATE_DRAFT':
      return { ...state, draft: { ...state.draft, ...action.payload } };
    case 'RESET_DRAFT':
      return { ...state, draft: initialDraft };
    default:
      return state;
  }
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => useContext(AppContext);