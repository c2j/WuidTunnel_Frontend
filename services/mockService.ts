import { TestCase, TestStatus, BrowserType, LogEntry } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockTestCases: TestCase[] = [
  {
    id: 'tc-001',
    name: '用户登录测试',
    description: '验证管理员账号能否正常登录系统',
    requirementText: '打开登录页面，输入用户名"admin"和密码"123456"，点击登录按钮，验证是否成功跳转到首页并显示用户信息。',
    targetUrl: 'https://example.com/login',
    browserType: BrowserType.Chrome,
    timeoutSeconds: 30,
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-09T10:00:00Z',
    status: TestStatus.PASSED,
    lastRun: '2 hours ago',
    tags: ['Login', 'Critical'],
    automationSteps: [
      { id: 's1', order: 1, action: 'navigate', value: 'https://example.com/login', description: '导航至登录页' },
      { id: 's2', order: 2, action: 'input', targetSelector: '#username', value: 'admin', description: '输入用户名' },
      { id: 's3', order: 3, action: 'input', targetSelector: '#password', value: '123456', description: '输入密码' },
      { id: 's4', order: 4, action: 'click', targetSelector: 'button[type="submit"]', description: '点击登录按钮' },
      { id: 's5', order: 5, action: 'verify', targetSelector: '.user-profile', value: 'Admin', description: '验证登录成功' }
    ]
  },
  {
    id: 'tc-002',
    name: '搜索功能验证',
    description: '验证全局搜索能否找到特定商品',
    requirementText: '在首页搜索框输入"iPhone 15"，点击搜索图标，验证搜索结果列表中包含"iPhone 15 Pro Max"。',
    targetUrl: 'https://example.com',
    browserType: BrowserType.Edge,
    timeoutSeconds: 45,
    createdAt: '2024-01-08T14:30:00Z',
    updatedAt: '2024-01-08T14:30:00Z',
    status: TestStatus.WAITING,
    tags: ['Search', 'Product'],
    automationSteps: []
  },
  {
    id: 'tc-003',
    name: '购物车结算流程',
    description: '验证添加商品到购物车并结算',
    requirementText: '进入商品详情页，点击"加入购物车"，进入购物车页面，点击"去结算"，验证进入订单确认页。',
    targetUrl: 'https://example.com/product/123',
    browserType: BrowserType.Firefox,
    timeoutSeconds: 60,
    createdAt: '2024-01-07T09:15:00Z',
    updatedAt: '2024-01-07T09:15:00Z',
    status: TestStatus.FAILED,
    lastRun: '1 day ago',
    tags: ['Cart', 'Checkout'],
    automationSteps: []
  }
];

export const mockLogs: LogEntry[] = [
  { 
    id: '1', 
    timestamp: '14:30:15', 
    level: 'INFO', 
    message: '系统初始化完成，准备执行测试...',
    details: { duration: '120ms', params: { os: 'Linux', memory: '16GB' } }
  },
  { 
    id: '2', 
    timestamp: '14:30:16', 
    level: 'INFO', 
    message: '启动浏览器会话: Chrome (Session ID: 8f9a2b)',
    details: { params: { browser: 'Chrome', version: '114.0', headless: false } }
  },
  { 
    id: '3', 
    timestamp: '14:30:17', 
    level: 'INFO', 
    message: '导航至目标URL: https://example.com/login',
    details: { duration: '850ms', params: { url: 'https://example.com/login' } }
  },
  { 
    id: '4', 
    timestamp: '14:30:18', 
    level: 'DEBUG', 
    message: 'ObserverAgent: 识别页面元素 (15 interactive elements found)',
    details: { selector: 'body', params: { elementCount: 15 } }
  },
];