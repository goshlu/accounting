import { Category } from '../../../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedId: string;
  onSelect: (categoryId: string) => void;
}

export function CategorySelector({ categories, selectedId, onSelect }: CategorySelectorProps) {
  return (
    <div className="bg-white rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">选择分类</h3>
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
              selectedId === category.id
                ? 'bg-orange-100 border-2 border-orange-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl mb-1">{category.icon}</span>
            <span className={`text-sm font-medium ${
              selectedId === category.id ? 'text-orange-700' : 'text-gray-700'
            }`}>
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}