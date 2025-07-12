import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  type: 'bug' | 'feature' | 'suggestion' | 'other';
  title: string;
  description: string;
  contact?: string;
}

const feedbackTypes = [
  { id: 'bug', label: '问题反馈', icon: '🐛', color: 'red' },
  { id: 'feature', label: '功能建议', icon: '💡', color: 'blue' },
  { id: 'suggestion', label: '改进建议', icon: '✨', color: 'green' },
  { id: 'other', label: '其他', icon: '📝', color: 'gray' },
] as const;

export function FeedbackModal({ isOpen, onClose, onSubmit }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    type: 'bug',
    title: '',
    description: '',
    contact: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.title.trim() || !feedback.description.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(feedback);
      setFeedback({
        type: 'bug',
        title: '',
        description: '',
        contact: '',
      });
      onClose();
    } catch (error) {
      console.error('提交反馈失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">问题反馈</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            请详细描述您遇到的问题或建议，我们会尽快处理
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              反馈类型
            </label>
            <div className="grid grid-cols-2 gap-3">
              {feedbackTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFeedback(prev => ({ ...prev, type: type.id as FeedbackData['type'] }))}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    feedback.type === type.id
                      ? type.id === 'bug' 
                        ? 'border-red-500 bg-red-50'
                        : type.id === 'feature'
                        ? 'border-blue-500 bg-blue-50'
                        : type.id === 'suggestion'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-500 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {type.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题 *
            </label>
            <input
              type="text"
              value={feedback.title}
              onChange={(e) => setFeedback(prev => ({ ...prev, title: e.target.value }))}
              placeholder="请简要描述问题或建议"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              详细描述 *
            </label>
            <textarea
              value={feedback.description}
              onChange={(e) => setFeedback(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请详细描述您遇到的问题、使用场景或建议..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Contact (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              联系方式 <span className="text-gray-400">(可选)</span>
            </label>
            <input
              type="text"
              value={feedback.contact}
              onChange={(e) => setFeedback(prev => ({ ...prev, contact: e.target.value }))}
              placeholder="邮箱或手机号，方便我们回复您"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!feedback.title.trim() || !feedback.description.trim() || isSubmitting}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>提交中...</span>
              </div>
            ) : (
              '提交反馈'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 