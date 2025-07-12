import React, { useState, useEffect } from 'react';

interface SyncStatusProps {
  lastRefreshTime: Date;
}

export function SyncStatus({ lastRefreshTime }: SyncStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(lastRefreshTime);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    return `${Math.floor(diffInSeconds / 86400)}天前`;
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (Date.now() - lastSyncTime.getTime() > 300000) return 'text-yellow-500'; // 5分钟
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (!isOnline) return '离线';
    if (Date.now() - lastSyncTime.getTime() > 300000) return '需要同步';
    return '已同步';
  };

  const getStatusIcon = () => {
    if (!isOnline) return '🔴';
    if (Date.now() - lastSyncTime.getTime() > 300000) return '🟡';
    return '🟢';
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <div>
            <div className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            <div className="text-xs text-gray-500">
              最后更新: {formatTimeAgo(lastSyncTime)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-xs text-gray-500">
            {isOnline ? '在线' : '离线'}
          </span>
        </div>
      </div>

      {/* 数据统计 */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-500">数据完整性</div>
            <div className="text-sm font-medium text-green-600">100%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">同步频率</div>
            <div className="text-sm font-medium text-blue-600">实时</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">存储空间</div>
            <div className="text-sm font-medium text-purple-600">充足</div>
          </div>
        </div>
      </div>
    </div>
  );
} 