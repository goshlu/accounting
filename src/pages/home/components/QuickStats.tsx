import React from 'react';

interface QuickStatsProps {
  monthlyExpense: number;
  monthlyIncome: number;
  todayExpense: number;
  todayIncome: number;
  balance: number;
}

export function QuickStats({
  monthlyExpense,
  monthlyIncome,
  todayExpense,
  todayIncome,
  balance
}: QuickStatsProps) {
  const monthlyBalance = monthlyIncome - monthlyExpense;
  const todayBalance = todayIncome - todayExpense;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">财务概览</h1>
          <p className="text-blue-100 text-sm">本月收支情况</p>
        </div>
        <div className="text-4xl opacity-20">💰</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">¥{monthlyExpense.toLocaleString()}</div>
          <div className="text-blue-100 text-xs">本月支出</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">¥{monthlyIncome.toLocaleString()}</div>
          <div className="text-blue-100 text-xs">本月收入</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold mb-1 ${monthlyBalance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            ¥{monthlyBalance.toLocaleString()}
          </div>
          <div className="text-blue-100 text-xs">本月结余</div>
        </div>
      </div>

      {/* 今日数据 */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-blue-100 text-sm">今日</span>
          <div className="flex space-x-4 text-xs">
            <span className="text-green-300">收入 ¥{todayIncome.toLocaleString()}</span>
            <span className="text-red-300">支出 ¥{todayExpense.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-2 text-center">
          <span className={`text-sm font-medium ${todayBalance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            今日结余: ¥{todayBalance.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
} 