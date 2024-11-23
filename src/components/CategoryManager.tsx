import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, CategoryManagerProps } from '../types';

export default function CategoryManager({ categories, onUpdateCategories }: CategoryManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMainCategory, setNewMainCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [editingMainIndex, setEditingMainIndex] = useState<number | null>(null);
  const [editingSubIndex, setEditingSubIndex] = useState<{main: number, sub: number} | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddMainCategory = () => {
    if (!newMainCategory.trim()) return;
    onUpdateCategories([
      ...categories,
      { mainCategory: newMainCategory.trim(), subCategories: [] }
    ]);
    setNewMainCategory('');
  };

  const handleAddSubCategory = (mainIndex: number) => {
    if (!newSubCategory.trim()) return;
    const newCategories = [...categories];
    newCategories[mainIndex].subCategories.push(newSubCategory.trim());
    onUpdateCategories(newCategories);
    setNewSubCategory('');
  };

  const handleDeleteMainCategory = (index: number) => {
    const category = categories[index];
    const hasSubCategories = category.subCategories.length > 0;
    const message = hasSubCategories
      ? `「${category.mainCategory}」とそのすべての中分類を削除してもよろしいですか？`
      : `「${category.mainCategory}」を削除してもよろしいですか？`;

    if (window.confirm(message)) {
      onUpdateCategories(categories.filter((_, i) => i !== index));
    }
  };

  const handleDeleteSubCategory = (mainIndex: number, subIndex: number) => {
    const mainCategory = categories[mainIndex];
    const subCategory = mainCategory.subCategories[subIndex];
    
    if (window.confirm(`「${mainCategory.mainCategory}」の「${subCategory}」を削除してもよろしいですか？`)) {
      const newCategories = [...categories];
      newCategories[mainIndex].subCategories = newCategories[mainIndex].subCategories
        .filter((_, i) => i !== subIndex);
      onUpdateCategories(newCategories);
    }
  };

  const startEditing = (value: string, mainIndex: number, subIndex?: number) => {
    setEditValue(value);
    if (subIndex !== undefined) {
      setEditingSubIndex({ main: mainIndex, sub: subIndex });
      setEditingMainIndex(null);
    } else {
      setEditingMainIndex(mainIndex);
      setEditingSubIndex(null);
    }
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    
    const newCategories = [...categories];
    if (editingMainIndex !== null) {
      newCategories[editingMainIndex].mainCategory = editValue.trim();
    } else if (editingSubIndex !== null) {
      newCategories[editingSubIndex.main].subCategories[editingSubIndex.sub] = editValue.trim();
    }
    
    onUpdateCategories(newCategories);
    setEditingMainIndex(null);
    setEditingSubIndex(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingMainIndex(null);
      setEditingSubIndex(null);
      setEditValue('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-lg font-semibold text-gray-700 mb-4"
      >
        <span>カテゴリー管理</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="新しい大分類"
              value={newMainCategory}
              onChange={(e) => setNewMainCategory(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddMainCategory()}
            />
            <button
              onClick={handleAddMainCategory}
              className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
              <span>追加</span>
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((category, mainIndex) => (
              <div key={mainIndex} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  {editingMainIndex === mainIndex ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onBlur={handleSaveEdit}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="font-medium cursor-pointer hover:text-indigo-600"
                      onClick={() => startEditing(category.mainCategory, mainIndex)}
                    >
                      {category.mainCategory}
                    </div>
                  )}
                  <button
                    onClick={() => handleDeleteMainCategory(mainIndex)}
                    className="text-gray-400 hover:text-red-600 ml-2"
                    title="大分類を削除"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="pl-4 space-y-2">
                  {category.subCategories.map((subCategory, subIndex) => (
                    <div key={subIndex} className="flex items-center justify-between group">
                      {editingSubIndex?.main === mainIndex && editingSubIndex?.sub === subIndex ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          onBlur={handleSaveEdit}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="text-gray-600 cursor-pointer hover:text-indigo-600"
                          onClick={() => startEditing(subCategory, mainIndex, subIndex)}
                        >
                          ・{subCategory}
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteSubCategory(mainIndex, subIndex)}
                        className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="中分類を削除"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="text"
                      placeholder="新しい中分類"
                      value={newSubCategory}
                      onChange={(e) => setNewSubCategory(e.target.value)}
                      className="flex-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSubCategory(mainIndex)}
                    />
                    <button
                      onClick={() => handleAddSubCategory(mainIndex)}
                      className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Plus size={14} />
                      <span>追加</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}