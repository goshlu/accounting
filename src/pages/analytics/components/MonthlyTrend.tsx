import { useAppStore } from '../../../store';

export function MonthlyTrend() {
  const { transactions } = useAppStore();

  const getMonthlyData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === date.getFullYear() &&
               transactionDate.getMonth() === date.getMonth();
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: date.getMonth() + 1,
        monthName: date.toLocaleDateString('zh-CN', { month: 'short' }),
        income,
        expense,
        balance: income - expense
      });
    }
    
    return months;
  };

  const monthlyData = getMonthlyData();
  const maxAmount = Math.max(
    ...monthlyData.map(m => Math.max(m.income, m.expense)),
    1000
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">最近6个月趋势</h3>
      
      <div className="space-y-4">
        {monthlyData.map((month, index) => (
          <div key={index} className="">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">{month.monthName}</span>
              <span className={`text-sm font-medium ${
                month.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {month.balance >= 0 ? '+' : ''}{formatCurrency(month.balance)}
              </span>
            </div>
            
            <div className="flex space-x-2 h-6">
              {/* 收入条 */}
              <div className="flex-1 bg-gray-100 rounded">
                <div
                  className="bg-green-400 h-full rounded"
                  style={{ width: `${(month.income / maxAmount) * 100}%` }}
                />
              </div>
              
              {/* 支出条 */}
              <div className="flex-1 bg-gray-100 rounded">
                <div
                  className="bg-red-400 h-full rounded"
                  style={{ width: `${(month.expense / maxAmount) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>收入: {formatCurrency(month.income)}</span>
              <span>支出: {formatCurrency(month.expense)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}