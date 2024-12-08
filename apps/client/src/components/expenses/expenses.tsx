// pages/ExpensePage.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/use-redux-types";
import {
  getExpensesByUser,
  createExpense,
  updateExpense,
  deleteExpense,
} from "@/lib/actions/expense-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaveIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Expense } from "@/lib/types/expense-types";

const EMPTY_EXPENSE: Expense = {
  title: "",
  amount: 0,
  date: new Date(),
  creator: "",
  category: "",
  description: "",
};

const EXPENSE_CATEGORIES = [
  "Utilities",
  "Rent",
  "Food",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Personal",
  "Miscellaneous",
];

export default function ExpensePage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  //@ts-ignore`
  const [currency, setCurrency] = useState<string>("UGX");
  const [expenseData, setExpenseData] = useState<Expense>(EMPTY_EXPENSE);

  const { expenses } = useAppSelector((state) => state.expenses);

  // Memoize profile fetch
  const userProfile = useMemo(() => {
    const profile = localStorage.getItem("profile");
    return profile ? JSON.parse(profile) : null;
  }, []);

  // Memoize user ID
  const userId = useMemo(() => {
    return userProfile?.result?._id || userProfile?.result?.googleId;
  }, [userProfile]);

  // Memoize total expenses calculation
  // Modify the totalExpenses calculation
  const totalExpenses = useMemo(() => {
    return (expenses || []).reduce((sum: number, expense: Expense) => {
      return sum + (expense?.amount || 0);
    }, 0);
  }, [expenses]);

  useEffect(() => {
    if (userId) {
      dispatch(getExpensesByUser({ search: userId }));
    }

  }, [dispatch, userId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setExpenseData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const newExpense = {
        ...expenseData,
        date: new Date(expenseData.date),
        creator: userId,
      };

      console.log(newExpense)

      if (expenseData._id) {
        dispatch(updateExpense(expenseData._id, newExpense));
        toast({
          title: `${newExpense.title} has been updated`,
          description: "An expense has been successfully updated",
        });
      } else {
        dispatch(createExpense(newExpense));
        toast({
          title: `${newExpense.title} has been created`,
          description: "A new expense has been successfully added",
        });
      }

      setExpenseData(EMPTY_EXPENSE);
    },
    [expenseData, userId, dispatch, toast]
  );

  const handleEditExpense = useCallback((expense: Expense) => {
    setExpenseData(expense);
    window.scrollTo(0, 0);
  }, []);

  const handleDeleteExpense = useCallback(
    (id: string) => {
      const openSnackbar = (message: string) => {
        toast({
          title: "Expense Deleted",
          description: message,
        });
      };
      dispatch(deleteExpense(id, openSnackbar));
    },
    [dispatch, toast]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {expenseData._id ? "Edit Expense" : "Add New Expense"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Expense Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={expenseData.title}
                  onChange={handleChange}
                  placeholder="Expense title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={expenseData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={
                    expenseData.date
                      ? new Date(expenseData.date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={expenseData.category}
                  onValueChange={(value) =>
                    setExpenseData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={expenseData.description}
                onChange={handleChange}
                placeholder="Expense description"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button type="submit">
                <SaveIcon className="mr-2 h-4 w-4" />
                {expenseData._id ? "Update Expense" : "Add Expense"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Expense Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense: Expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>
                    {currency} {expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditExpense(expense)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense._id || "")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">
              Total Expenses: {currency} {totalExpenses.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
