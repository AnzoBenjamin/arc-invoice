// routes/expenses.ts
import express, { Router } from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "@controllers/expenses";

const router: Router = express.Router();

// Use RequestHandler type for your route handlers
router.post("/", createExpense);
router.get("/", getExpenses);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;