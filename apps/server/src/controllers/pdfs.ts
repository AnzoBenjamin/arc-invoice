import fs from "fs";
import nodemailer from "nodemailer";
import { RequestHandler } from "express";
import { generatePDF } from "@utils/generatePDF";
import emailTemplate from "@documents/email";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendPDF: RequestHandler<{
  email: string;
  company: string;
}> = async (req, res) => {
  const { email, company } = req.body;

  try {
    const pdfBuffer = await generatePDF(req.body);

    // Send mail with defined transport object
    transporter.sendMail(
      {
        from: `Accountill <noreply@accountill.com>`,
        to: `${email}`,
        replyTo: `${company.email}`,
        subject: `Invoice from ${
          company.businessName ? company.businessName : company.name
        }`,
        text: `Invoice from ${
          company.businessName ? company.businessName : company.name
        }`,
        html: emailTemplate(req.body),
        attachments: [
          {
            filename: "invoice.pdf",
            content: pdfBuffer,
          },
        ],
      },
      (mailErr) => {
        if (mailErr) {
          return res.status(500).send("Error sending email");
        }
        res.status(200).send("PDF invoice sent successfully");
      }
    );
  } catch (error) {
    console.error("PDF creation error:", error);
    res.status(500).send("Error creating PDF");
  }
};

export const createPDF: RequestHandler<
  any,
  { message: string; error?: string }
> = async (req, res) => {
  console.log("Request Body:", req.body);
  try {

    const pdfBuffer = await generatePDF(req.body);
    // Save the PDF if needed
    fs.writeFile(`${__dirname}/invoice.pdf`, pdfBuffer, (err) => {
      if (err) {
        console.error("Error writing PDF file:", err);
        return res.status(500).json({ message: "Error saving PDF" });
      }
    });
    res.status(200).json({ message: "PDF created successfully" });
    return;
  } catch (error) {
    console.error("PDF creation error:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
    return;
  }
};

export const fetchPDF: RequestHandler<{}> = async (req, res) => {
  res.sendFile(`${__dirname}/invoice.pdf`);
  return;
};
