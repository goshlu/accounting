import React, { useState, useEffect } from 'react';
import { FeedbackService, StoredFeedback } from '../../../utils/feedbackService';

interface FeedbackHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  pending: { label: '待处理', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  reviewed: { label: '已查看', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  resolved: { label: '已解决', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
};

const typeConfig = {
  bug: { label: '问题反馈', icon: '🐛', color: 'red' },
  feature: { label: '功能建议', icon: '💡', color: 'blue' },
  suggestion: { label: '改进建议', icon: '✨', color: 'green' },
  other: { label: '其他', icon: '📝', color: 'gray' },
};

export function FeedbackHistory({ isOpen, onClose }: FeedbackHistoryProps) {
  const [feedback, setFeedback] = useState<StoredFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    setLoading(true);
    const allFeedback = FeedbackService.getAllFeedback();
    setFeedback(allFeedback);
    setLoading(false);
  };

  const handleStatusChange = (id: string, newStatus: StoredFeedback['status']) => {
    FeedbackService.updateFeedbackStatus(id, newStatus);
    loadFeedback();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条反馈吗？')) {
      FeedbackService.deleteFeedback(id);
      loadFeedback();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">加载中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">反馈历史</h2>
              <p className="text-gray-500 text-sm mt-1">
                共 {feedback.length} 条反馈
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {feedback.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">暂无反馈</h3>
              <p className="text-gray-500">您还没有提交过任何反馈</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {typeConfig[item.type].icon}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[item.status].bgColor} ${statusConfig[item.status].textColor}`}
                      >
                        {statusConfig[item.status].label}
                      </span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <span className="text-red-500 text-xs">🗑️</span>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Contact */}
                  {item.contact && (
                    <div className="text-xs text-gray-500 mb-3">
                      联系方式: {item.contact}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as StoredFeedback['status'])}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                      >
                        <option value="pending">待处理</option>
                        <option value="reviewed">已查看</option>
                        <option value="resolved">已解决</option>
                      </select>
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {item.id.slice(-8)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 