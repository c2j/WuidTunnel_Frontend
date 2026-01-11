import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Activity, Database, Cpu, Wifi } from 'lucide-react';

const CheckItem = ({ icon: Icon, title, status, desc }: any) => (
  <div className="flex items-start p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
    <div className={`p-2 rounded-lg mr-4 ${
      status === 'ok' ? 'bg-green-100 text-green-600' :
      status === 'warn' ? 'bg-yellow-100 text-yellow-600' :
      'bg-red-100 text-red-600'
    }`}>
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        {status === 'ok' && <CheckCircle size={16} className="text-green-500" />}
        {status === 'warn' && <AlertTriangle size={16} className="text-yellow-500" />}
        {status === 'err' && <XCircle size={16} className="text-red-500" />}
      </div>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </div>
);

export const SystemValidation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统验证</h1>
        <p className="text-gray-500 text-sm mt-1">检查组件健康状态和环境依赖</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CheckItem 
          icon={Activity} 
          title="Tauri API" 
          status="ok" 
          desc="核心 API 响应时间正常 (< 5ms)" 
        />
        <CheckItem 
          icon={Database} 
          title="SQLite 数据库" 
          status="ok" 
          desc="连接池活动，读写延迟正常" 
        />
        <CheckItem 
          icon={Cpu} 
          title="WebDriver" 
          status="warn" 
          desc="ChromeDriver 版本 (v114) 与浏览器 (v116) 可能不匹配" 
        />
        <CheckItem 
          icon={Wifi} 
          title="IPC 通信" 
          status="ok" 
          desc="Rust 后端通信信道稳定" 
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="text-blue-800 font-semibold mb-2">系统日志摘要</h3>
        <div className="font-mono text-sm text-blue-900 opacity-80 space-y-1">
          <p>[INFO] System startup initiated at 10:00:01</p>
          <p>[INFO] Loaded configuration from /etc/wuidtunnel/config.toml</p>
          <p>[WARN] WebDriver version mismatch detected, attempting auto-fix...</p>
          <p>[INFO] Database schema validation passed</p>
          <p>[INFO] Ready to accept commands</p>
        </div>
      </div>
    </div>
  );
};