import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import ExpenseModel from '@models/expenseModel';

interface IExpense {
  _id: mongoose.Types.ObjectId;
  creator: string;
  title: string;
  amount: number;
  date: Date;
  category?: string;
  description?: string;
}

interface CreateExpenseRequest {
  title: string;
  amount: number;
  date: Date;
  creator: string;
  category?: string;
  description?: string;
}

interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  _id: string;
}

// Explicitly type the controllers as RequestHandler
export const createExpense: RequestHandler<
  {},
  IExpense | { message: string },
  CreateExpenseRequest
> = async (req, res) => {
  try {
    const expense = new ExpenseModel(req.body);
    console.log(req.body)
    console.log(expense)
    await expense.save();
    res.status(201).json({message: `${expense._id} was created`});
  } catch (error) {
    res.status(409).json({ 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

export const getExpenses: RequestHandler<
  {},
  { data: IExpense[] } | { message: string },
  {},
  { searchQuery: string }
> = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const expenses = await ExpenseModel.find({ creator: searchQuery })
      .sort({ date: -1 });
      console.log(expenses)
    res.status(200).json({ data: expenses });
  } catch (error) {
    res.status(404).json({ 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

export const updateExpense: RequestHandler<
  { id: string },
  IExpense | { message: string },
  UpdateExpenseRequest
> = async (req, res, next): Promise<void> => {
  const { id } = req.params;
  const expense = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({message: `No expense with ${id}`});
    return;
  }
  
  try {
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      id, 
      { ...expense, _id: id },
      { new: true }
    );
    
    if (!updatedExpense) {
      res.status(404).json({ message: `${id} not found` });
      return;
    }
    
    res.json(updatedExpense);
  } catch (error) {
    res.status(409).json({ 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

export const deleteExpense: RequestHandler<
  { id: string },
  { message: string }
> = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({message: 'No expense with that id'});
    return;
  }

  try {
    const result = await ExpenseModel.findByIdAndRemove(id);
    
    if (!result) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(409).json({ 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

export default {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};