import express from "express";
import {
  createInventoryItem,
  getInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryByUser,
} from "@controllers/inventory";

const router = express.Router();

// Route to create a new inventory item
router.post("/", createInventoryItem);

// Route to get all inventory items
router.get("/", getInventoryItems);

// Route to get a single inventory item by ID
router.get("/:id", getInventoryItemById);

router.get("/user/:id", getInventoryByUser);

// Route to update an inventory item by ID
router.put("/:id", updateInventoryItem);

// Route to delete an inventory item by ID
router.delete("/:id", deleteInventoryItem);

export default router;