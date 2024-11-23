import React, { useState } from 'react';
import { PlusCircle, Wallet } from 'lucide-react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryManager from './components/CategoryManager';
import { Expense, Category } from './types';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    {
      mainCategory: '食費',
      subCategories: ['食料品', '外食', 'カフェ']
    },
    {
      mainCategory: '住居費',
      subCategories: ['家賃', '光熱費', '通信費']
    },
    {
      mainCategory: '交通費',
      subCategories: ['電車', 'バス', 'タクシー']
    },
    {
      mainCategory: '娯楽費',
      subCategories: ['映画', '旅行', 'スポーツ']
    }
  ]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const handleUpdateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3">
            <Wallet className="w-8 h-8" />
            <h1 className="text-2xl font-bold">家計簿アプリ</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[400px_1fr]">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold">支出を登録</h2>
              </div>
              <ExpenseForm categories={categories} onSubmit={handleAddExpense} />
            </div>
            
            <CategoryManager
              categories={categories}
              onUpdateCategories={handleUpdateCategories}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">支出履歴</h2>
            <ExpenseList expenses={expenses} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;