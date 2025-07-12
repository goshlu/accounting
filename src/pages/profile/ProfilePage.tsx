import { useState } from "react";
import { useAppStore } from "../../store";
import { UserInfo } from "./components/UserInfo";
import { useNavigate } from "react-router-dom";
import { FeedbackModal } from "./components/FeedbackModal";
import { FeedbackHistory } from "./components/FeedbackHistory";
import { FeedbackService } from "../../utils/feedbackService";
import { Toast } from "../../components/common/Toast";
import { CustomNavbar } from "../../components/common/CustomNavbar";

export function ProfilePage() {
  const { user, checkInStats, hasCheckedInToday, checkIn } = useAppStore();

  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Feedback state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFeedbackHistory, setShowFeedbackHistory] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // 如果用户未登录，显示默认用户信息
  const defaultUser = {
    id: "default",
    phone: "159****3411",
    name: "曾美娟",
    createdAt: new Date("2024-01-01"),
  };

  const currentUser = user || defaultUser;

  // Add the missing handleCheckIn function
  const handleCheckIn = () => {
    if (hasCheckedInToday || isCheckingIn) return;

    setIsCheckingIn(true);

    // 添加一些动画效果
    setTimeout(() => {
      checkIn();
      setIsCheckingIn(false);

      // 可以添加成功提示
      setToast({
        message: "打卡成功！",
        type: "success",
        isVisible: true,
      });
    }, 1000);
  };

  const navigate = useNavigate();

  // Handle feedback submission
  const handleFeedbackSubmit = async (feedback: any) => {
    try {
      await FeedbackService.submitFeedback(feedback);
      setToast({
        message: "反馈提交成功！感谢您的反馈。",
        type: "success",
        isVisible: true,
      });
    } catch (error) {
      setToast({
        message: "提交失败，请重试。",
        type: "error",
        isVisible: true,
      });
    }
  };

  // 清除缓存
  const handleClearCache = () => {
    if (window.confirm("确定要清除所有缓存吗？此操作不可恢复！")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 pb-20 relative">
      <CustomNavbar title="个人中心" onBack={() => navigate(-1)} />
      <UserInfo user={currentUser} />
      <div className="px-4 -mt-4 relative z-10">
        <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 rounded-2xl p-5 shadow-lg border border-yellow-200/50 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full transform translate-x-6 -translate-y-6"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-200/20 to-yellow-200/20 rounded-full transform -translate-x-4 translate-y-4"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-2xl">
                  {hasCheckedInToday ? "✅" : "💰"}
                </span>
              </div>
              <div>
                <div className="text-gray-800 font-semibold text-lg">
                  {hasCheckedInToday ? "今日已打卡" : "今日还未打卡"}
                </div>
                <div className="text-gray-600 text-sm flex items-center space-x-1">
                  <span>🔥</span>
                  <span>连续 {checkInStats.consecutiveDays} 天</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckIn}
              disabled={hasCheckedInToday || isCheckingIn}
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center space-x-2 ${
                hasCheckedInToday
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:shadow-xl hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105"
              }`}
            >
              {isCheckingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>打卡中...</span>
                </>
              ) : hasCheckedInToday ? (
                <>
                  <span>✅</span>
                  <span>已打卡</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>立即打卡</span>
                </>
              )}
            </button>
          </div>

          {/* 进度条 */}
          <div className="mt-4 relative">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>本月打卡进度</span>
              <span>{checkInStats.currentMonthDays}/30 天</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (checkInStats.currentMonthDays / 30) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      <div className="p-4 space-y-4">
        {/* 导出数据 */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div
            className="relative flex items-center justify-between"
            onClick={() => navigate("/export-data")}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl text-white">📊</span>
              </div>
              <div>
                <div className="text-gray-800 font-semibold text-lg">
                  导出数据
                </div>
                <div className="text-gray-500 text-sm">导出您的记账数据</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                导出Excel
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <span className="text-gray-400 group-hover:text-blue-500">
                  ›
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 定时提醒 */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-md relative">
                <span className="text-xl text-white">⏰</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="text-gray-800 font-semibold text-lg">
                  定时提醒
                </div>
                <div className="text-gray-500 text-sm">设置记账提醒时间</div>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <span className="text-gray-400 group-hover:text-orange-500">
                ›
              </span>
            </div>
          </div>
        </div>

        {/* 安全设置 */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl text-white">🔒</span>
              </div>
              <div>
                <div className="text-gray-800 font-semibold text-lg">
                  安全设置
                </div>
                <div className="text-gray-500 text-sm">保护您的账户安全</div>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <span className="text-gray-400 group-hover:text-green-500">
                ›
              </span>
            </div>
          </div>
        </div>

        {/* 分享给好友 */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl text-white">👥</span>
              </div>
              <div>
                <div className="text-gray-800 font-semibold text-lg">
                  分享给好友
                </div>
                <div className="text-gray-500 text-sm">邀请好友一起记账</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium">
                邀请好友
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <span className="text-gray-400 group-hover:text-purple-500">
                  ›
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 清除缓存 */}
      <div
        className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer"
        onClick={handleClearCache}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">🗑️</span>
          <span className="text-gray-800 font-medium">清除缓存</span>
        </div>
        <span className="text-gray-400">›</span>
      </div>

      {/* 问题反馈 */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl">💬</span>
          <span className="text-gray-800 font-medium">问题反馈</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFeedbackHistory(true)}
            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg"
          >
            历史
          </button>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            ›
          </button>
        </div>
      </div>

      {/* 关于 */}
      <div
        className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
        onClick={() => {
          setTimeout(() => navigate("/AboutApp"), 0);
        }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">ℹ️</span>
          <span className="text-gray-800 font-medium">关于</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 text-sm">当前版本 v1.10</span>
          <span className="text-gray-400">›</span>
        </div>
      </div>

      {/* Feedback Modals */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
      />

      <FeedbackHistory
        isOpen={showFeedbackHistory}
        onClose={() => setShowFeedbackHistory(false)}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
