import { Account } from '../../../types';
import { TrendingUp, DollarSign, CreditCard } from 'lucide-react';

interface AssetOverviewProps {
  totalAssets: number;
  accounts: Account[];
  style?: 'card' | 'default';
}

export function AssetOverview({ totalAssets, accounts, style = 'default' }: AssetOverviewProps) {
  // 计算各类账户统计
  const savingsAccounts = accounts.filter(acc => acc.type === 'savings');
  const checkingAccounts = accounts.filter(acc => acc.type === 'checking');
  const creditAccounts = accounts.filter(acc => acc.type === 'credit');

  const savingsTotal = savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const checkingTotal = checkingAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const creditTotal = creditAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (style === 'card') {
    return (
      <div className="bg-gradient-to-b from-orange-400 to-orange-300 rounded-xl shadow-sm p-4">
        <div className="text-white mb-4">
          <p className="text-sm opacity-80 mb-1">总资产 (元)</p>
          <p className="text-3xl font-bold">¥ {(totalAssets / 100).toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-white">
      {/* 总资产 */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">总资产</p>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAssets)}</p>
        <div className="flex items-center justify-center mt-2">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-500">+2.5% 较上月</span>
        </div>
      </div>

      {/* 资产分类 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mb-1">储蓄账户</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(savingsTotal)}</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mb-1">支票账户</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(checkingTotal)}</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CreditCard className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-xs text-gray-500 mb-1">信用账户</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(creditTotal)}</p>
        </div>
      </div>
    </div>
  );
}