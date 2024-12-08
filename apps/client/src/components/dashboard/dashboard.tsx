"use client";

import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Check,
  PieChart,
  ShoppingBag,
  CreditCard,
  Clock,
  Frown,
} from "lucide-react";
import { getInvoicesByUser } from "@/lib/actions/invoice-actions";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-types";
import Chart from "./chart";
import { toCommas } from "@/lib/utils";
import moment from "moment";
import { InvoiceData } from "@/lib/types/invoice-types";

import { PaymentRecord } from "@/lib/types/invoice-types";
export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { invoices, isLoading } = useAppSelector((state) => state?.invoices);
  const overDue = invoices?.filter(
    (invoice: InvoiceData) => invoice.dueDate && new Date(invoice.dueDate) <= new Date()
  );
  const unpaidInvoice = invoices?.filter(
    (invoice: InvoiceData) => invoice.status === "Unpaid"
  );
  const paid = invoices?.filter(
    (invoice: InvoiceData) => invoice.status === "Paid"
  );
  const partial = invoices?.filter(
    (invoice: InvoiceData) => invoice.status === "Partial"
  );

  const paymentHistory = invoices.flatMap(
    (invoice: InvoiceData) => invoice.paymentRecords || []
  );

  const sortHistoryByDate = paymentHistory.sort(
    (a: PaymentRecord, b: PaymentRecord) =>
      new Date(b.datePaid).getTime() - new Date(a.datePaid).getTime()
  );
  const totalPaid = invoices.reduce(
    (sum: number, invoice: InvoiceData) =>
      sum + (invoice.totalAmountReceived || 0),
    0
  );
  const totalAmount = invoices.reduce(
    (sum: number, invoice: InvoiceData) => sum + (invoice.total || 0),
    0
  );
  const userProfile = useMemo(() => {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(profile) : null;
  }, []); 
  

  // Memoize user ID
  const userId = useMemo(() => {
    return userProfile?.result?._id || userProfile?.result?.googleId
  }, [userProfile])

  useEffect(() => {
    if (userId){
      dispatch(getInvoicesByUser(userId));
    }
  }, [dispatch, userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 mb-4">
          Nothing to display. Click the plus icon to start creating
        </p>
      </div>
    );
  }

  const stats = [
    {
      title: "Payment Received",
      value: totalPaid,
      icon: Check,
      color: "bg-blue-500 text-white",
    },
    { title: "Pending Amount", value: totalAmount - totalPaid, icon: PieChart },
    { title: "Total Amount", value: totalAmount, icon: ShoppingBag },
    { title: "Total Invoices", value: invoices.length, icon: CreditCard },
    {
      title: "Paid Invoices",
      value: paid.length,
      icon: Check,
      color: "bg-green-500 text-white",
    },
    { title: "Partially Paid Invoices", value: partial.length, icon: PieChart },
    { title: "Unpaid Invoices", value: unpaidInvoice.length, icon: Frown },
    { title: "Overdue", value: overDue.length, icon: Clock },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={stat.color}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {React.createElement(stat.icon, {
                className: "h-4 w-4 text-muted-foreground",
              })}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{toCommas(stat.value)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paymentHistory.length !== 0 && (
        <section className="mb-8">
          <Chart paymentHistory={Array.isArray(paymentHistory) ? paymentHistory : []} />
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold text-center mb-4">
          {paymentHistory.length
            ? "Recent Payments"
            : "No payment received yet"}
        </h2>
        {paymentHistory.length !== 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Paid By</TableHead>
                <TableHead>Date Paid</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortHistoryByDate.slice(-10).map((record: PaymentRecord) => (
                <TableRow key={record._id}>
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {record?.paidBy?.charAt(0)}
                    </div>
                  </TableCell>
                  <TableCell>{record.paidBy}</TableCell>
                  <TableCell>
                    {moment(record.datePaid).format("MMMM Do YYYY")}
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {toCommas(record.amountPaid)}
                  </TableCell>
                  <TableCell>{record.paymentMethod}</TableCell>
                  <TableCell>{record.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
