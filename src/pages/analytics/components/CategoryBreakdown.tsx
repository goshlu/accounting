import { useAppStore } from '../../../store';

interface CategoryBreakdownProps {
  period: string;
}

export function CategoryBreakdown({ period }: CategoryBreakdownProps) {
  const { transactions, categories } = useAppStore();

  const getCategoryData = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const expenseTransactions = transactions.filter(
      t => t.type === 'expense' && new Date(t.date) >= startDate
    );

    const categoryTotals = new Map<string, number>();
    
    expenseTransactions.forEach(transaction => {
      const current = categoryTotals.get(transaction.categoryId) || 0;
      categoryTotals.set(transaction.categoryId, current + transaction.amount);
    });

    const totalExpense = Array.from(categoryTotals.values()).reduce((sum, amount) => sum + amount, 0);

    return Array.from(categoryTotals.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          categoryId,
          name: category?.name || '其他',
          icon: category?.icon || '💰',
          color: category?.color || '#gray-500',
          amount,
          percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // 只显示前5个分类
  };

  const categoryData = getCategoryData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (categoryData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">支出分类占比</h3>
        <div className="text-center py-8 text-gray-500">
          <p>暂无支出数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">支出分类占比</h3>
      
      <div className="space-y-3">
        {categoryData.map((category, index) => (
          <div key={category.categoryId} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-lg">{category.icon}</div>
              <div>
                <p className="font-medium text-gray-800">{category.name}</p>
                <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">{formatCurrency(category.amount)}</p>
              <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: category.color
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}