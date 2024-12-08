import { RequestHandler } from "express";
import mongoose from "mongoose";
import InvoiceModel from "@models/invoiceModel";
import InventoryModel from "@models/inventoryModel";
import invoice from "@documents/invoice";

interface InvoiceItem {
  inventoryItem: mongoose.Types.ObjectId;
  quantity: number;
  discount?: number;
}

interface Invoice {
  items: InvoiceItem[];
  total: number;
  subTotal: number;
  vat: number;
  creator: string;
  status: string;
  dueDate: Date;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface InventoryItemDoc extends mongoose.Document {
  itemName: string;
  quantity: number;
  threshold: number;
  save: () => Promise<this>;
}

// Helper function to trigger stock alerts
const checkStockThreshold = async (
  inventoryItem: InventoryItemDoc
): Promise<void> => {
  if (inventoryItem.quantity < inventoryItem.threshold) {
    console.log(
      `Alert: Stock for ${inventoryItem.itemName} is below the threshold! Current quantity: ${inventoryItem.quantity}`
    );
  }
};

// Fetch invoices by user
export const getInvoicesByUser: RequestHandler<
  {},
  { data: Invoice[] } | { message: string },
  {},
  { searchQuery: string }
> = async (req, res) => {
  const { searchQuery } = req.query;
  console.log('Received searchQuery:', searchQuery);
  
  try {
    // Add more detailed logging
    const invoices = await InvoiceModel.find({ creator: searchQuery });
    console.log('Invoices found:', invoices.length);
    console.log('First invoice (if any):', invoices[0]);
    
    res.status(200).json({ data: invoices });
  } catch (error) {
    console.error('Error in getInvoicesByUser:', error);
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get total count of invoices
export const getTotalCount: RequestHandler<
  {},
  number | { message: string },
  {},
  { searchQuery: string }
> = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const totalCount = await InvoiceModel.countDocuments({
      creator: searchQuery,
    });
    res.status(200).json(totalCount);
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Create new invoice and reduce stock
export const createInvoice: RequestHandler<
  {},
  Invoice | { message: string },
  Invoice
> = async (req, res) => {
  const invoice = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of invoice.items) {
      const inventoryItem = await InventoryModel.findById(
        item.inventoryItem
      ).session(session);

      if (!inventoryItem) {
        throw new Error(
          `Inventory item with ID ${item.inventoryItem} not found.`
        );
      }

      if (inventoryItem.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for item: ${inventoryItem.itemName}. Available: ${inventoryItem.quantity}, Requested: ${item.quantity}`
        );
      }

      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save({ session });
      await checkStockThreshold(inventoryItem);
    }

    const newInvoice = new InvoiceModel(invoice);
    await newInvoice.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: `${newInvoice._id} was created` });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(409).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Update invoice and handle stock changes
export const updateInvoice: RequestHandler<
  { id: string },
  Invoice | { message: string },
  Partial<Invoice>
> = async (req, res) => {
  const { id } = req.params;
  const invoice = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "No invoice with that id" });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingInvoice = await InvoiceModel.findById(id).session(session);
    if (!existingInvoice) throw new Error("Invoice not found");

    // Revert previous stock adjustments
    for (const item of existingInvoice.items) {
      const inventoryItem = await InventoryModel.findById(
        item.inventoryItem
      ).session(session);
      if (inventoryItem) {
        inventoryItem.quantity += item.quantity;
        await inventoryItem.save({ session });
      }
    }

    // Update stock for new invoice data
    for (const item of invoice.items || []) {
      const inventoryItem = await InventoryModel.findById(
        item.inventoryItem
      ).session(session);

      if (!inventoryItem) {
        throw new Error(
          `Inventory item with ID ${item.inventoryItem} not found.`
        );
      }

      if (inventoryItem.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for item: ${inventoryItem.itemName}. Available: ${inventoryItem.quantity}, Requested: ${item.quantity}`
        );
      }

      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save({ session });
      await checkStockThreshold(inventoryItem);
    }

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      id,
      { ...invoice, _id: id },
      { new: true, session }
    );
    await session.commitTransaction();
    session.endSession();

    res.json(updatedInvoice);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(409).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Delete invoice and revert stock
export const deleteInvoice: RequestHandler<
  { id: string },
  { message: string }
> = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "No invoice with that id" });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await InvoiceModel.findById(id).session(session);
    if (!invoice) throw new Error("Invoice not found");

    for (const item of invoice.items) {
      const inventoryItem = await InventoryModel.findById(
        item.inventoryItem
      ).session(session);
      if (inventoryItem) {
        inventoryItem.quantity += item.quantity;
        await inventoryItem.save({ session });
      }
    }

    await InvoiceModel.findByIdAndRemove(id).session(session);
    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(409).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const getInvoice: RequestHandler<
  { id: string },
  {message: string} | {data: Invoice}
> = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await InvoiceModel.findById(id);
    console.log(invoice)
    res.status(200).json({data: invoice});
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });  }
};
