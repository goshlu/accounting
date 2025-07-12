import React, { useState, useRef, useEffect } from 'react';
import { Transaction, Category } from '../../../types';

interface SearchBarProps {
  transactions: Transaction[];
  categories: Category[];
  onSearch: (results: Transaction[]) => void;
}

export function SearchBar({ transactions, categories, onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);

    if (!term.trim()) {
      onSearch([]);
      setIsSearching(false);
      return;
    }

    // 模拟搜索延迟
    setTimeout(() => {
      const results = transactions.filter(transaction => {
        const category = categories.find(cat => cat.id === transaction.categoryId);
        const searchLower = term.toLowerCase();
        
        return (
          transaction.description?.toLowerCase().includes(searchLower) ||
          category?.name.toLowerCase().includes(searchLower) ||
          transaction.amount.toString().includes(term) ||
          transaction.note?.toLowerCase().includes(searchLower)
        );
      });

      onSearch(results);
      setIsSearching(false);
    }, 300);
  };

  const getRecentSearches = () => {
    // 这里可以从localStorage获取最近搜索
    return ['餐饮', '交通', '购物', '工资'];
  };

  const getPopularCategories = () => {
    return categories.slice(0, 6);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="搜索交易记录、分类..."
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                onSearch([]);
              }}
              className="px-3 py-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 搜索建议 */}
      {showSuggestions && !searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 z-10">
          <div className="p-4">
            {/* 最近搜索 */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">最近搜索</div>
              <div className="flex flex-wrap gap-2">
                {getRecentSearches().map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* 热门分类 */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">热门分类</div>
              <div className="grid grid-cols-3 gap-2">
                {getPopularCategories().map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleSearch(category.name)}
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 搜索结果 */}
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 z-10 max-h-64 overflow-y-auto">
          <div className="p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              搜索结果
            </div>
            {isSearching ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-sm text-gray-500">搜索中...</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                输入关键词开始搜索
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 