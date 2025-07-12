import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AssetCardProps {
  totalAssets: number;
}

export function AssetCard({ totalAssets }: AssetCardProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="mx-4 mt-4 mb-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">总资产</p>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">
                {isVisible ? formatCurrency(totalAssets) : '****'}
              </span>
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                {isVisible ? (
                  <Eye className="w-5 h-5 text-white/80" />
                ) : (
                  <EyeOff className="w-5 h-5 text-white/80" />
                )}
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm mb-1">本月支出</p>
            <p className="text-lg font-semibold">¥2,456.78</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white/80 text-sm mb-1">本月收入</p>
            <p className="text-lg font-semibold">¥8,500.00</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm mb-1">本月结余</p>
            <p className="text-lg font-semibold text-green-300">¥6,043.22</p>
          </div>
        </div>
      </div>
    </div>
  );
}