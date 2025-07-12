import React from 'react';
import { useNavigate } from 'react-router-dom';

export function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">还没有交易记录</h3>
      <p className="text-gray-500 text-sm mb-6">
        开始记录您的第一笔交易，让理财变得简单有趣
      </p>
      
      <div className="space-y-3">
        <button
          onClick={() => navigate('/add-record')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-medium hover:shadow-lg transition-all"
        >
          📝 记一笔
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/assets')}
            className="bg-gray-50 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-100 transition-colors"
          >
            💰 管理资产
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="bg-gray-50 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-100 transition-colors"
          >
            📈 数据分析
          </button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
        <div className="text-blue-600 text-sm font-medium mb-2">💡 小贴士</div>
        <div className="text-blue-600 text-xs space-y-1">
          <p>• 定期记录收支，了解消费习惯</p>
          <p>• 设置预算目标，控制支出</p>
          <p>• 分析数据趋势，优化理财策略</p>
        </div>
      </div>
    </div>
  );
} 