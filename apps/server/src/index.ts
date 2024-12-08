import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import invoiceRoutes from "@routes/invoices";
import clientRoutes from "@routes/clients";
import userRoutes from "@routes/userRoutes";
import profileRoutes from "@routes/profile";
import inventoryRoutes from "@routes/inventory";
import expenseRoutes from "@routes/expenses";
import pdfRoutes from "@routes/pdfs"
import mongoConnect from "@db/connectDB";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;



app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

mongoConnect();
app.use("/api/invoices", invoiceRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api", pdfRoutes)
app.get("/api/health", (req, res)=>{
  res.sendStatus(200).json("Server is okay")
})

app.use(express.static(path.join(__dirname, "..", "..", "apps", "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..",  "client", "dist", "index.html"));
});


app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
