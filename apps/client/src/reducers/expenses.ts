// lib/reducers/expense-reducer.ts
import { 
  FETCH_EXPENSES, 
  ADD_NEW_EXPENSE, 
  UPDATE_EXPENSE, 
  DELETE_EXPENSE, 
  EXPENSE_LOADING_START, 
  EXPENSE_LOADING_END 
} from '@/lib/actions/constants';
import { ExpenseState, ExpenseAction, Expense } from '@/lib/types/expense-types';

const initialState: ExpenseState = {
  isLoading: true,
  expenses: [],
  expenseItem: undefined
};

const expenseReducer = (state: ExpenseState = initialState, action: ExpenseAction) => {
  switch (action.type) {
    case EXPENSE_LOADING_START:
      return { ...state, isLoading: true };
    
    case EXPENSE_LOADING_END:
      return { ...state, isLoading: false };
    
    case FETCH_EXPENSES:
      return { 
        ...state, 
        expenses: action.payload.expense 
          ? (Array.isArray(action.payload.expense) 
              ? action.payload.expense 
              : [action.payload.expense])
          : [], 
        isLoading: false 
      };
    
    case ADD_NEW_EXPENSE:
      return { 
        ...state, 
        expenses: action.payload.expense 
          ? [...state.expenses, action.payload.expense as Expense]
          : state.expenses, 
        isLoading: false 
      };
    
    case UPDATE_EXPENSE:
      return { 
        ...state, 
        expenses: action.payload.expense
          ? state.expenses.map((expense) => 
              expense._id === action.payload._id 
                ? action.payload.expense as Expense 
                : expense
            )
          : state.expenses, 
        isLoading: false 
      };
    
    case DELETE_EXPENSE:
      return { 
        ...state, 
        expenses: state.expenses.filter((expense) => expense._id !== action.payload._id), 
        isLoading: false 
      };
    
    default:
      return state;
  }
};

export default expenseReducer;