import React from "react";
import { CustomNavbar } from "../../components/common/CustomNavbar";
import { useNavigate } from "react-router-dom";

export function AboutApp() {
  const navigate = useNavigate();

  return (
    <>
      <CustomNavbar title="关于应用" onBack={() => navigate(-1)} />
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">关于应用</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">应用名称</span>
            <span className="font-medium">个人记账</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">版本号</span>
            <span className="font-medium">v1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">开发者</span>
            <span className="font-medium">记账团队</span>
          </div>
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              这是一个简单易用的个人记账应用，帮助您更好地管理个人财务。
              支持多账户管理、分类记账、数据统计和导出等功能。
            </p>
          </div>
          <div className="flex space-x-4 pt-2">
            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-200 transition-colors">
              用户协议
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-200 transition-colors">
              隐私政策
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
