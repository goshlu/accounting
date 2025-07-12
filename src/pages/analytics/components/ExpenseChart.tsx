import { useAppStore } from '../../../store';

interface ExpenseChartProps {
  period: string;
}

export function ExpenseChart({ period }: ExpenseChartProps) {
  const { transactions } = useAppStore();

  // 获取最近7天的数据
  const getChartData = () => {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.toDateString() === date.toDateString();
      });
      
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      days.push({
        date: date.getDate(),
        dayName: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
        income,
        expense
      });
    }
    
    return days;
  };

  const chartData = getChartData();
  const maxAmount = Math.max(
    ...chartData.map(d => Math.max(d.income, d.expense)),
    1000
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">最近7天收支趋势</h3>
      
      <div className="flex items-end justify-between h-40 space-x-2">
        {chartData.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="flex-1 flex flex-col justify-end space-y-1 w-full">
              {/* 收入柱 */}
              <div
                className="bg-green-200 rounded-t"
                style={{
                  height: `${(day.income / maxAmount) * 100}%`,
                  minHeight: day.income > 0 ? '4px' : '0'
                }}
              />
              {/* 支出柱 */}
              <div
                className="bg-red-200 rounded-t"
                style={{
                  height: `${(day.expense / maxAmount) * 100}%`,
                  minHeight: day.expense > 0 ? '4px' : '0'
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{day.dayName}</p>
          </div>
        ))}
      </div>
      
      {/* 图例 */}
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <span className="text-sm text-gray-600">收入</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <span className="text-sm text-gray-600">支出</span>
        </div>
      </div>
    </div>
  );
}