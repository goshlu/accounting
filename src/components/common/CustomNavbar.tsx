import React from "react";

interface CustomNavbarProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function CustomNavbar({
  title,
  onBack,
  right,
  className = "",
  children,
}: CustomNavbarProps) {
  return (
    <div
      className={`sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 ${className}`}
      style={{ minHeight: 56 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="返回"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="text-base font-semibold text-gray-900">{title}</div>
        <div>{right}</div>
      </div>
      {children}
    </div>
  );
} 