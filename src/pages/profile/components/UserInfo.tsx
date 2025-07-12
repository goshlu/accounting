import React from 'react';
import { User } from '../../../types';
import { useAppStore } from '../../../store';

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps) {
  const { accounts, transactions } = useAppStore();
  
  // 计算总资产
  const totalAssets = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // 计算负债（这里可以根据实际业务逻辑调整）
  const totalDebt = 24798; // 示例数据
  
  return (
    <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute top-4 right-4 opacity-20">
        <div className="w-20 h-20 bg-white rounded-full"></div>
      </div>
      <div className="absolute bottom-0 right-0 opacity-10">
        <div className="w-32 h-32 bg-white rounded-full transform translate-x-8 translate-y-8"></div>
      </div>
      
      <div className="relative p-6">
        {/* 用户信息 */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/api/placeholder/64/64" 
              alt="用户头像" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'flex';
                }
              }}
            />
            <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center" style={{display: 'none'}}>
              <span className="text-2xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : user.phone.charAt(0)}
              </span>
            </div>
          </div>
          <div className='text-left'>
            <h2 className="text-xl  font-bold">{user.name || '八戒Maria'}</h2>
            <p className="text-white/80 text-sm leading-relaxed break-words max-w-[200px]">
              @已经连续记账 <span className="font-semibold text-yellow-200">256 天</span>了，继续坚持吧！会更富的
            </p>
          </div>
        </div>
        
        {/* 资产信息 */}
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-white/80 text-sm">总资产</p>
            <p className="text-2xl font-bold">{totalAssets.toLocaleString()}</p>
          </div>
          <div className="text-left">
            <p className="text-white/80 text-sm">负债</p>
            <p className="text-xl font-semibold">{totalDebt.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}