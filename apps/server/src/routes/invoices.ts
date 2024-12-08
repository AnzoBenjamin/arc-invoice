import express from "express";
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoicesByUser,
  getTotalCount,
  getInvoice
} from "@controllers/invoices";

const router = express.Router();

router.get("/count", getTotalCount); //use to generate invoice serial number
router.get("/", getInvoicesByUser);
router.get('/:id', getInvoice);
router.post("/", createInvoice);
router.patch("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;