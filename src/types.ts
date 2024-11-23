export interface Category {
  mainCategory: string;
  subCategories: string[];
}

export interface Expense {
  id: number;
  date: string;
  mainCategory: string;
  subCategory: string;
  amount: number;
  description: string;
  paymentMethod: string;
}

export interface CategoryManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
}