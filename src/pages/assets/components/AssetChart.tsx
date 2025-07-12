import React from 'react';
import { Account } from '../../../types';

interface AssetChartProps {
  accounts: Account[];
  period: 'week' | 'month' | 'year';
}

export function AssetChart({ accounts, period }: AssetChartProps) {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentage = (amount: number) => {
    return totalBalance > 0 ? ((amount / totalBalance) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="bg-white mx-4 rounded-lg shadow-sm mb-4">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">资产分布</h3>
      </div>

      <div className="p-4">
        {/* 饼图模拟 - 使用条形图表示 */}
        <div className="space-y-3">
          {accounts.map((account) => {
            const percentage = parseFloat(getPercentage(account.balance));
            return (
              <div key={account.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: account.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{account.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(account.balance)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: account.color,
                      width: `${percentage}%`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 总计 */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">总计</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(totalBalance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}