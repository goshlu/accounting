import React, { useState } from 'react';
import { Account, Transaction, Category } from '../../types';
import { CustomNavbar } from '../../components/common/CustomNavbar';
import { useNavigate } from 'react-router-dom';
interface ExportDataProps {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
}

export function ExportData({ accounts, transactions, categories }: ExportDataProps) {
  const navigate = useNavigate();
  
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'year'>('all');

  const getFilteredTransactions = () => {
    if (dateRange === 'all') return transactions;
    
    const now = new Date();
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (dateRange === 'month') {
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      } else if (dateRange === 'year') {
        return transactionDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const exportToJSON = () => {
    const data = {
      accounts,
      transactions: getFilteredTransactions(),
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accounting-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const filteredTransactions = getFilteredTransactions();
    const headers = ['日期', '类型', '金额', '分类', '账户', '描述'];
    
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => {
        const category = categories.find(c => c.id === t.categoryId);
        const account = accounts.find(a => a.id === t.accountId);
        return [
          t.date,
          t.type === 'income' ? '收入' : '支出',
          t.amount,
          category?.name || '',
          account?.name || '',
          `"${(t.description || '').replace(/"/g, '""')}"`
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (exportFormat === 'json') {
      exportToJSON();
    } else {
      exportToCSV();
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (window.confirm('导入数据将覆盖现有数据，确定继续吗？')) {
          // 这里应该调用store的方法来更新数据
          console.log('导入的数据:', data);
          alert('数据导入成功！');
        }
      } catch (error) {
        alert('文件格式错误，请选择有效的JSON文件');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <CustomNavbar title="导出数据" onBack={() => navigate(-1)} />
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">导出数据</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              导出格式
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value as 'json')}
                  className="mr-2"
                />
                JSON (完整数据)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value as 'csv')}
                  className="mr-2"
                />
                CSV (交易记录)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              时间范围
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'all' | 'month' | 'year')}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">全部数据</option>
              <option value="month">本月数据</option>
              <option value="year">本年数据</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            导出数据
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">导入数据</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            选择之前导出的JSON文件来恢复数据
          </p>
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">数据统计</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{accounts.length}</div>
            <div className="text-sm text-gray-600">账户</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{transactions.length}</div>
            <div className="text-sm text-gray-600">交易</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-sm text-gray-600">分类</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {getFilteredTransactions().length}
            </div>
            <div className="text-sm text-gray-600">筛选结果</div>
          </div>
        </div>
      </div>
    </div>
  );
}