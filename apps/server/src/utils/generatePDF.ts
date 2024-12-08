import PDFDocument from "pdfkit";
import { Buffer } from "buffer";
import moment from "moment";
import path from "path";

// Ensure the path to Helvetica.afm is correct
const fontPath = path.join(__dirname, "..", "data", "Helvetica.afm");

interface InvoiceTemplateProps {
  name: string;
  address: string;
  phone: string;
  email: string;
  dueDate: Date;
  date: Date;
  id: string;
  notes: string;
  subTotal: number;
  type: string;
  vat: number;
  total: number;
  items: {
    itemName: string;
    quantity: number;
    unitPrice: number;
    discount: number;
  }[];
  status: string;
  totalAmountReceived: number;
  balanceDue: number;
  company: {
    logo?: string;
    businessName?: string;
    name: string;
    email: string;
    phoneNumber: string;
    contactAddress: string;
  };
}

export async function generatePDF(data: InvoiceTemplateProps): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Basic input validation
      if (!data || !data.company) {
        throw new Error("Invalid invoice data");
      }

      const doc = new PDFDocument({ margin: 50 });
      doc.registerFont("Helvetica", fontPath);

      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on("error", (err) => {
        reject(err);
      });

      // Helper function for formatting currency
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      };

      // Header section
      if (data.company.logo) {
        try {
          doc.image(data.company.logo, 50, 45, { width: 100 });
        } catch (logoErr) {
          console.warn("Could not load company logo:", logoErr);
          doc.fontSize(20).text("___", 50, 45);
        }
      } else {
        doc.fontSize(20).text("___", 50, 45);
      }

      // Company info
      doc
        .fontSize(8)
        .text("From:", 50, 130)
        .fontSize(9)
        .text(data.company.businessName || data.company.name, 50, 145)
        .text(data.company.email, 50, 160)
        .text(data.company.phoneNumber, 50, 175)
        .text(data.company.contactAddress, 50, 190);

      // Client info
      doc
        .fontSize(8)
        .text("Bill to:", 50, 220)
        .fontSize(9)
        .text(data.name, 50, 235)
        .text(data.email, 50, 250)
        .text(data.phone, 50, 265)
        .text(data.address, 50, 280);

      // Invoice details (right side)
      const rightColumn = 400;
      doc
        .fontSize(12)
        .text(
          Number(data.balanceDue) <= 0 ? "Receipt" : data.type,
          rightColumn,
          130
        )
        .fontSize(8)
        .text(data.id, rightColumn, 145)
        .text("Status", rightColumn, 165)
        .fontSize(12)
        .text(data.status, rightColumn, 180)
        .fontSize(8)
        .text("Date", rightColumn, 200)
        .fontSize(9)
        .text(moment(data.date).format("ll"), rightColumn, 215)
        .fontSize(8)
        .text("Due Date", rightColumn, 235)
        .fontSize(9)
        .text(moment(data.dueDate).format("ll"), rightColumn, 250)
        .fontSize(8)
        .text("Amount", rightColumn, 270)
        .fontSize(12)
        .text(formatCurrency(data.total), rightColumn, 285);

      // Items table
      const tableTop = 350;
      doc.fontSize(9);

      // Table headers
      const tableHeaders = ["Item", "Quantity", "Price", "Discount(%)", "Amount"];
      const columnWidths = [200, 60, 100, 80, 100];
      let currentX = 50;

      tableHeaders.forEach((header, i) => {
        doc.text(header, currentX, tableTop);
        currentX += columnWidths[i];
      });

      // Table rows
      let yPosition = tableTop + 25;

      data.items.forEach((item) => {
        const amount =
          item.quantity * item.unitPrice -
          (item.quantity * item.unitPrice * item.discount) / 100;

        currentX = 50;
        doc.text(item.itemName, currentX, yPosition);
        currentX += columnWidths[0];

        doc.text(item.quantity.toString(), currentX, yPosition);
        currentX += columnWidths[1];

        doc.text(formatCurrency(item.unitPrice), currentX, yPosition);
        currentX += columnWidths[2];

        doc.text(item.discount.toString(), currentX, yPosition);
        currentX += columnWidths[3];

        doc.text(formatCurrency(amount), currentX, yPosition);

        yPosition += 20;
      });

      // Summary section
      const summaryX = 400;
      yPosition += 20;

      doc.fontSize(9).text("Invoice Summary", summaryX, yPosition);

      yPosition += 20;
      doc
        .text("Sub Total", summaryX, yPosition)
        .text(formatCurrency(data.subTotal), summaryX + 100, yPosition);

      yPosition += 20;
      doc
        .text("VAT", summaryX, yPosition)
        .text(formatCurrency(data.vat), summaryX + 100, yPosition);

      yPosition += 20;
      doc
        .text("Total", summaryX, yPosition)
        .text(formatCurrency(data.total), summaryX + 100, yPosition);

      yPosition += 20;
      doc
        .text("Paid", summaryX, yPosition)
        .text(
          formatCurrency(data.totalAmountReceived),
          summaryX + 100,
          yPosition
        );

      yPosition += 20;
      doc
        .text("Balance Due", summaryX, yPosition)
        .text(formatCurrency(data.balanceDue), summaryX + 100, yPosition);

      // Notes section
      yPosition += 40;
      doc
        .fontSize(9)
        .text("Note", 50, yPosition)
        .text(data.notes, 50, yPosition + 15);

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
