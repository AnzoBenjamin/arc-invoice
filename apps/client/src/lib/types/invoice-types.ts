import { Client } from "./client-types";
import { BusinessProfile } from "./profile-types";
import { InventoryItem } from "./inventory-types";
export interface InvoiceItem {
    _id?: string;
    inventoryItem?: string | null;
    quantity?: string | number;
    discount?: string;
    itemName?: string;
    unitPrice?: number;
    amount?: string;
    totalAmountReceived?: number;
    total?: number;
    inventoryDetail?: InventoryItem;
    paymentRecords?: PaymentRecord[];
  }

  export interface PaymentRecord{
    _id?: string;
    amountPaid: number;
    datePaid: Date;
    note?: string;
    paidBy?: string;
    paymentMethod: string;
  }
  
export  interface InvoiceData {
    _id?: string;
    items?: InvoiceItem[];
    invoiceNumber?: string | number;
    notes?: string;
    total?: number;
    rates?: string | number;
    businessDetail?: BusinessProfile;
    vat?: number;
    currency?: string;
    client?: Client;
    status?: string;
    type?: string;
    creator?: string;
    totalAmountReceived?: number;
    dueDate?: Date;
    subTotal?: number;
    paymentRecords?: PaymentRecord[];
    createdAt?: string;
  }
  