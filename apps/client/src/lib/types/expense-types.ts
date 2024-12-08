// lib/types/expense-types.ts

export interface Expense {
  _id?: string;
  title: string;
  amount: number;
  date: Date;
  creator: string;
  category?: string;
  description?: string;
}

export interface SearchQuery {
  search: string;
}

export interface ExpenseState {
  isLoading: boolean;
  expenses: Expense[];
  expenseItem?: Expense;
}

export interface ExpenseAction {
  type: string;
  payload: { 
    expense?: Expense | Expense[]; 
    _id?: string; 
  };
}