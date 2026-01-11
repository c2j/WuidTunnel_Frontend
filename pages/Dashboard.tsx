import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { TestStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6B7280'];

const StatCard = ({ title, count, icon: Icon, color, bg }: any) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{count}</h3>
    </div>
    <div className={`p-4 rounded-full ${bg} ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { state } = useAppState();
  const { testCases } = state;

  const stats = {
    passed: testCases.filter(t => t.status === TestStatus.PASSED).length,
    failed: testCases.filter(t => t.status === TestStatus.FAILED).length,
    waiting: testCases.filter(t => t.status === TestStatus.WAITING).length,
    running: testCases.filter(t => t.status === TestStatus.RUNNING).length,
    total: testCases.length
  };

  const pieData = [
    { name: '通过', value: stats.passed },
    { name: '失败', value: stats.failed },
    { name: '等待', value: stats.waiting },
    { name: '未执行', value: stats.total - stats.passed - stats.failed - stats.waiting - stats.running },
  ];

  const activityData = [
    { name: 'Mon', passed: 4, failed: 1 },
    { name: 'Tue', passed: 3, failed: 2 },
    { name: 'Wed', passed: 7, failed: 0 },
    { name: 'Thu', passed: 5, failed: 1 },
    { name: 'Fri', passed: 6, failed: 1 },
    { name: 'Sat', passed: 2, failed: 0 },
    { name: 'Sun', passed: 1, failed: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-500 text-sm mt-1">测试执行概览与统计分析</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="测试通过" count={stats.passed} icon={CheckCircle} color="text-green-600" bg="bg-green-100" />
        <StatCard title="测试失败" count={stats.failed} icon={XCircle} color="text-red-600" bg="bg-red-100" />
        <StatCard title="等待执行" count={stats.waiting} icon={Clock} color="text-orange-600" bg="bg-orange-100" />
        <StatCard title="系统异常" count={0} icon={AlertCircle} color="text-blue-600" bg="bg-blue-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Rate Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">测试通过率</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">本周执行趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                <Legend />
                <Bar dataKey="passed" name="通过" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="失败" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table (Simplified) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">最近执行记录</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium">
              <tr>
                <th className="px-6 py-3">测试用例</th>
                <th className="px-6 py-3">执行时间</th>
                <th className="px-6 py-3">耗时</th>
                <th className="px-6 py-3">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testCases.slice(0, 5).map((tc) => (
                <tr key={tc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{tc.name}</td>
                  <td className="px-6 py-4">{tc.lastRun || 'N/A'}</td>
                  <td className="px-6 py-4">32s</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${tc.status === TestStatus.PASSED ? 'bg-green-100 text-green-800' : 
                        tc.status === TestStatus.FAILED ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {tc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};