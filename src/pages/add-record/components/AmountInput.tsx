import { Calculator } from 'lucide-react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  type: 'income' | 'expense';
}

export function AmountInput({ value, onChange, type }: AmountInputProps) {
  const handleNumberClick = (num: string) => {
    if (num === '.' && value.includes('.')) return;
    if (value === '0' && num !== '.') {
      onChange(num);
    } else {
      onChange(value + num);
    }
  };

  const handleDelete = () => {
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '⌫']
  ];

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Calculator className={`w-6 h-6 mr-2 ${
            type === 'income' ? 'text-green-500' : 'text-red-500'
          }`} />
          <span className="text-lg font-medium text-gray-700">
            {type === 'income' ? '收入金额' : '支出金额'}
          </span>
        </div>
        <div className="text-4xl font-bold text-gray-900 min-h-[3rem] flex items-center justify-center">
          ¥{value || '0'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {numbers.flat().map((num, index) => (
          <button
            key={index}
            onClick={() => {
              if (num === '⌫') {
                handleDelete();
              } else {
                handleNumberClick(num);
              }
            }}
            className={`h-14 rounded-xl font-semibold text-lg transition-colors ${
              num === '⌫'
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={handleClear}
        className="w-full mt-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
      >
        清空
      </button>
    </div>
  );
}