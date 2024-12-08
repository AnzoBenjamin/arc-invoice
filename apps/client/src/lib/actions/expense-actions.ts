// lib/actions/expense-actions.ts
import * as api from '@/lib/api/index';
import { 
  FETCH_EXPENSES, 
  ADD_NEW_EXPENSE, 
  UPDATE_EXPENSE, 
  DELETE_EXPENSE, 
  EXPENSE_LOADING_START, 
  EXPENSE_LOADING_END 
} from '@/lib/actions/constants';
import { Expense, SearchQuery } from '@/lib/types/expense-types';
import { Dispatch } from 'redux';

// Fetch all expenses
export const getExpenses = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: EXPENSE_LOADING_START });
    
    const { data } = await api.fetchExpenses();

    console.log(data)
    
    dispatch({ type: FETCH_EXPENSES, payload: data });
    
    dispatch({ type: EXPENSE_LOADING_END });
  } catch (error) {
    console.log(error);
  }
};

// Create a new expense
// lib/actions/expense-actions.ts
export const createExpense = (
  expense: Expense, 
) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: EXPENSE_LOADING_START });

    
    const userProfile = localStorage.getItem('profile');
    const user = userProfile ? JSON.parse(userProfile) : null;
    const expenseWithCreator = { 
      ...expense, 
      creator: user?.result?._id || user?.result?.googleId 
    };

    
    const { data } = await api.addExpense(expenseWithCreator);
    
    dispatch({ 
      type: ADD_NEW_EXPENSE, 
      payload: { 
        expense: data,
        _id: data._id 
      } 
    });
    
    
    dispatch({ type: EXPENSE_LOADING_END });
  } catch (error) {
    console.error('Error creating expense:', error);
    dispatch({ type: EXPENSE_LOADING_END });
  }
};

export const getExpensesByUser = (searchQuery: SearchQuery) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: EXPENSE_LOADING_START });
    
    const { data } = await api.fetchExpensesByUser(searchQuery.search);

    console.log(data)
    
    dispatch({ 
      type: FETCH_EXPENSES, 
      payload: { 
        expense: data.data || [],
        _id: undefined 
      } 
    });
    
    dispatch({ type: EXPENSE_LOADING_END });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    dispatch({ type: EXPENSE_LOADING_END });
  }
};

// Update an existing expense
export const updateExpense = (
  id: string, 
  updatedExpense: Expense
) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: EXPENSE_LOADING_START });
    
    const { data } = await api.updateExpense(id, updatedExpense);
    
    dispatch({ type: UPDATE_EXPENSE, payload: data });
    
    dispatch({ type: EXPENSE_LOADING_END });
  } catch (error) {
    console.error('Error updating expense:', error);
    dispatch({ type: EXPENSE_LOADING_END });
  }
};

// Delete an expense
export const deleteExpense = (
  id: string, 
  openSnackbar: (message: string) => void
) => async (dispatch: Dispatch) => {
  try {
    await api.deleteExpense(id);
    
    dispatch({ type: DELETE_EXPENSE, payload: id });
    
    openSnackbar("Expense deleted successfully");
  } catch (error) {
    console.log(error);
  }
};

// Fetch expenses by user
