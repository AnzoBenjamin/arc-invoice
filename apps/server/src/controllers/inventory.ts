import { RequestHandler } from "express";
import mongoose from "mongoose";
import InventoryModel from "@models/inventoryModel";

interface InventoryItem {
  itemName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  supplier?: {
    name: string;
    contactEmail: string;
    phone: string;
    address: string;
  };
  category: string;
  threshold: number;
  description?: string;
  creator: string;
}

interface InventoryItemDoc extends mongoose.Document {
  itemName: string;
  quantity: number;
  threshold: number;
  save: () => Promise<this>;
}

// Helper function to trigger stock alerts
const checkStockThreshold = async (inventoryItem: InventoryItemDoc): Promise<void> => {
  if (inventoryItem.quantity < inventoryItem.threshold) {
    console.log(
      `Alert: Stock for ${inventoryItem.itemName} is below the threshold! Current quantity: ${inventoryItem.quantity}`
    );
  }
};

// Create a new inventory item
export const createInventoryItem: RequestHandler<
  {},
  InventoryItem | { message: string, error?: string },
  InventoryItem
> = async (req, res) => {
  const {
    itemName,
    sku,
    quantity,
    unitPrice,
    supplier,
    category,
    threshold,
    description,
    creator,
  } = req.body;

  try {
    const newItem = new InventoryModel({
      itemName,
      sku,
      quantity,
      unitPrice,
      supplier,
      category,
      threshold,
      description,
      creator,
    }) as InventoryItemDoc;

    const savedItem = await newItem.save();
    await checkStockThreshold(savedItem);
    res.status(201).json({message: `${savedItem._id} was created`});
  } catch (error) {
    res.status(500).json({
      message: "Error creating inventory item",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get all inventory items
export const getInventoryItems: RequestHandler<
  {},
  InventoryItem[] | { message: string; error?: string }
> = async (req, res) => {
  try {
    const items = await InventoryModel.find().lean();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching inventory items",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get a single inventory item by ID
export const getInventoryItemById: RequestHandler<
  { id: string },
  InventoryItem | { message: string; error?: string }
> = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Invalid item ID" });
    return;
  }

  try {
    const item = await InventoryModel.findById(id).lean();
    if (!item){
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching item",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Update inventory item by ID
export const updateInventoryItem: RequestHandler<
  { id: string },
  InventoryItem | { message: string; error?: string },
  Partial<InventoryItem>
> = async (req, res) => {
  const { id } = req.params;
  const {
    itemName,
    quantity,
    unitPrice,
    supplier,
    category,
    threshold,
    description,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Invalid item ID" });
  }

  try {
    const updatedItem = await InventoryModel.findByIdAndUpdate(
      id,
      {
        itemName,
        quantity,
        unitPrice,
        supplier,
        category,
        threshold,
        description,
      },
      { new: true }
    ) as InventoryItemDoc | null;

    if (!updatedItem) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    
    await checkStockThreshold(updatedItem);
    res.status(200).json({message: `${updatedItem._id} was created`});
  } catch (error) {
    res.status(500).json({
      message: "Error updating item",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Delete inventory item by ID
export const deleteInventoryItem: RequestHandler<
  { id: string },
  { message: string; error?: string }
> = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Invalid item ID" });
    return;
  }

  try {
    const deletedItem = await InventoryModel.findByIdAndDelete(id).lean();
    if (!deletedItem){
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting item",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get inventory items by user
export const getInventoryByUser: RequestHandler<
  { id: string },
  { data: InventoryItem[] } | { message: string }
> = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const inventoryItems = await InventoryModel.find({ creator: id }).lean();
    res.status(200).json({ data: inventoryItems });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};