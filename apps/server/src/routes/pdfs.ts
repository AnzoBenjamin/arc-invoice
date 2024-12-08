import express from "express";
import { sendPDF, createPDF, fetchPDF } from "@controllers/pdfs";
const router = express.Router();

// Update the send-pdf endpoint
router.post("/send-pdf", sendPDF);

// Update the create-pdf endpoint
router.post("/create-pdf", createPDF);

router.get("/fetch-pdf", fetchPDF);

export default router;
