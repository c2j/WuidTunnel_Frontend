import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlayCircle, 
  Settings, 
  Activity, 
  Menu, 
  X, 
  User, 
  LogOut, 
  BookOpen,
  MonitorPlay,
  PlusCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
      active 
        ? 'bg-blue-100 text-blue-700 font-medium' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col z-20
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}
          absolute md:relative h-full
        `}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
          <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl overflow-hidden whitespace-nowrap">
            <MonitorPlay size={28} />
            <span className={`${!isSidebarOpen && 'md:hidden'}`}>WuidTunnel</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="space-y-1">
            <SidebarItem 
              to="/" 
              icon={LayoutDashboard} 
              label="仪表盘" 
              active={location.pathname === '/'} 
            />
            <SidebarItem 
              to="/test-cases" 
              icon={FileText} 
              label="测试用例" 
              active={location.pathname === '/test-cases'} 
            />
            <SidebarItem 
              to="/create-test-case" 
              icon={PlusCircle} 
              label="新建测试用例" 
              active={location.pathname === '/create-test-case'} 
            />
            <SidebarItem 
              to="/execution" 
              icon={PlayCircle} 
              label="执行中心" 
              active={location.pathname === '/execution'} 
            />
            <SidebarItem 
              to="/config" 
              icon={Settings} 
              label="系统配置" 
              active={location.pathname === '/config'} 
            />
          </div>

          <div className="mt-8">
            <h3 className={`px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ${!isSidebarOpen && 'md:hidden'}`}>
              开发工具
            </h3>
            <SidebarItem 
              to="/system-check" 
              icon={Activity} 
              label="系统验证" 
              active={location.pathname === '/system-check'} 
            />
            <SidebarItem 
              to="/guide" 
              icon={BookOpen} 
              label="用户指南" 
              active={location.pathname === '/guide'} 
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
           <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 w-full px-2 py-2 rounded transition-colors">
              <LogOut size={20} />
              <span className={`${!isSidebarOpen && 'md:hidden'}`}>退出登录</span>
           </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 focus:outline-none"
          >
            {isSidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-600">系统正常</span>
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={16} />
              </div>
              <span className="text-sm font-medium hidden sm:block">Admin User</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 relative">
           {children}
        </main>

        {/* Footer */}
        <footer className="h-8 bg-gray-800 text-white flex items-center justify-between px-4 text-xs z-10">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span> IPC: 连接正常</span>
            <span className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span> 数据库: 在线</span>
          </div>
          <div className="text-gray-400">WuidTunnel v1.0.0</div>
        </footer>
      </div>
    </div>
  );
};