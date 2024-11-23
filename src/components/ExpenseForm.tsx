import React, { useState } from 'react';
import { Category, Expense } from '../types';

interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (expense: Expense) => void;
}

const PAYMENT_METHODS = [
  '現金',
  'クレジットカード',
  'デビットカード',
  '電子マネー',
  'QRコード決済',
  'その他'
];

function ExpenseForm({ categories, onSubmit }: ExpenseFormProps) {
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainCategory || !subCategory || !amount) return;

    onSubmit({
      mainCategory,
      subCategory,
      amount: parseInt(amount),
      description,
      date,
      paymentMethod,
      id: 0 // This will be set in the parent component
    });

    // Reset form
    setMainCategory('');
    setSubCategory('');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod(PAYMENT_METHODS[0]);
  };

  const selectedCategory = categories.find(cat => cat.mainCategory === mainCategory);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          日付
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          大分類
        </label>
        <select
          value={mainCategory}
          onChange={(e) => {
            setMainCategory(e.target.value);
            setSubCategory('');
          }}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category.mainCategory} value={category.mainCategory}>
              {category.mainCategory}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          中分類
        </label>
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={!mainCategory}
        >
          <option value="">選択してください</option>
          {selectedCategory?.subCategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          支払方法
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          金額
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pr-8"
            placeholder="1000"
            required
            min="0"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            円
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          メモ
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="買い物メモ"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        登録する
      </button>
    </form>
  );
}

export default ExpenseForm;