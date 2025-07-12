import { FeedbackData } from '../pages/profile/components/FeedbackModal';

const FEEDBACK_STORAGE_KEY = 'user_feedback';

export interface StoredFeedback extends FeedbackData {
  id: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export class FeedbackService {
  // 获取所有反馈
  static getAllFeedback(): StoredFeedback[] {
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('获取反馈失败:', error);
      return [];
    }
  }

  // 提交新反馈
  static async submitFeedback(feedback: FeedbackData): Promise<StoredFeedback> {
    const newFeedback: StoredFeedback = {
      ...feedback,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    try {
      // 保存到本地存储
      const existingFeedback = this.getAllFeedback();
      const updatedFeedback = [newFeedback, ...existingFeedback];
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));

      // 这里可以添加API调用
      // await this.sendToServer(newFeedback);

      return newFeedback;
    } catch (error) {
      console.error('提交反馈失败:', error);
      throw error;
    }
  }

  // 更新反馈状态
  static updateFeedbackStatus(id: string, status: StoredFeedback['status']): void {
    try {
      const allFeedback = this.getAllFeedback();
      const updatedFeedback = allFeedback.map(feedback =>
        feedback.id === id ? { ...feedback, status } : feedback
      );
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
    } catch (error) {
      console.error('更新反馈状态失败:', error);
    }
  }

  // 删除反馈
  static deleteFeedback(id: string): void {
    try {
      const allFeedback = this.getAllFeedback();
      const updatedFeedback = allFeedback.filter(feedback => feedback.id !== id);
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
    } catch (error) {
      console.error('删除反馈失败:', error);
    }
  }

  // 获取反馈统计
  static getFeedbackStats() {
    const allFeedback = this.getAllFeedback();
    const total = allFeedback.length;
    const pending = allFeedback.filter(f => f.status === 'pending').length;
    const resolved = allFeedback.filter(f => f.status === 'resolved').length;

    return {
      total,
      pending,
      resolved,
      resolvedRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    };
  }

  // 生成唯一ID
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 发送到服务器的示例方法（需要后端API）
  private static async sendToServer(feedback: StoredFeedback): Promise<void> {
    // 这里可以集成真实的API调用
    // const response = await fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(feedback),
    // });
    
    // if (!response.ok) {
    //   throw new Error('提交反馈失败');
    // }

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
} 