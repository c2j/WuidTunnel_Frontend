import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { Save, RotateCcw } from 'lucide-react';

export const Configuration: React.FC = () => {
  const { state } = useAppState();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div>
        <h1 className="text-2xl font-bold text-gray-900">系统配置</h1>
        <p className="text-gray-500 text-sm mt-1">管理环境参数、浏览器设置和全局偏好</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button className="px-6 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">常规设置</button>
            <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent">浏览器引擎</button>
            <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent">网络代理</button>
            <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent">高级</button>
          </nav>
        </div>

        <div className="p-8 space-y-8">
          
          {/* General Section */}
          <section className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">基础偏好</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">界面语言</label>
                <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3 border">
                  <option>简体中文</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">主题模式</label>
                <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3 border">
                  <option>跟随系统</option>
                  <option>浅色</option>
                  <option>深色</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
              <label className="text-sm text-gray-700">启用自动保存 (每5分钟)</label>
            </div>
          </section>

          {/* WebDriver Section */}
          <section className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">WebDriver 配置</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">默认浏览器</label>
              <div className="flex space-x-4">
                {['Chrome', 'Firefox', 'Edge'].map(b => (
                  <label key={b} className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                    <input type="radio" name="browser" className="text-blue-600 focus:ring-blue-500" defaultChecked={b === 'Chrome'} />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chrome Driver 路径</label>
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   defaultValue={state.config.webDriverPath}
                   className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3 border font-mono text-sm" 
                 />
                 <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">浏览...</button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label className="text-sm text-gray-700">启用无头模式 (Headless Mode) - 执行时不显示浏览器窗口</label>
            </div>
          </section>

        </div>

        <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-t border-gray-200">
           <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium">
             <RotateCcw size={16} className="mr-2" />
             恢复默认设置
           </button>
           <button className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-sm font-medium">
             <Save size={18} className="mr-2" />
             保存更改
           </button>
        </div>
      </div>
    </div>
  );
};