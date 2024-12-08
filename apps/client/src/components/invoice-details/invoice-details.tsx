import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-types";
import { getInvoice } from "@/lib/actions/invoice-actions";
import { toCommas } from "@/lib/utils";
import moment from "moment";
import { saveAs } from "file-saver";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Edit } from "lucide-react";
import PaymentModal from "@/components/payments/payment-modal";
import PaymentHistory from "@/components/invoice-details/payment-history";
import { InvoiceItem } from "@/lib/types/invoice-types";
import { PaymentRecord } from "@/lib/types/invoice-types";


export default function InvoiceDetails() {
  const [sendStatus, setSendStatus] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { toast } = useToast();
  const { invoice, businessDetails } = useAppSelector((state) => state.invoices);
  
  const userProfile = localStorage.getItem("profile");
  const user = userProfile ? JSON.parse(userProfile) : null;

  
  useEffect(() => {
    if (id) {
      // Check if it's the first load or items have changed
        dispatch(getInvoice(id));
      }
  }, [id, dispatch, invoice]);
  


  const editInvoice = () => {
    navigate(`/edit/invoice/${id}`);
  };

  const sendPdf = async () => {
    
    
    setSendStatus("loading");
    try {
      if (invoice && !Array.isArray(invoice)) { // Ensure invoice is not an array
        await axios.post(`${import.meta.env.VITE_API_URL}/api/send-pdf`, {
        // Client details
        name: invoice.client?.name || "",
        email: invoice.client?.email || "",
        phone: invoice.client?.phone || "",
        address: invoice.client?.address || "",
        
        // Invoice details
        dueDate: invoice.dueDate,
        date: new Date(),
        id: invoice.invoiceNumber || "",
        notes: invoice.notes || "",
        subTotal: invoice.subTotal || 0,
        type: invoice.type || "Invoice",
        vat: invoice.vat || 0,
        total: invoice.total || 0,
        status: calculateBalanceDue() === 0 ? "Paid" : invoice.status || "Unpaid",
        
        // Items
        items: invoice.items?.map((item: InvoiceItem) => ({
          itemName: item?.inventoryDetail?.itemName || "",
          quantity: item.quantity || 0,
          unitPrice: item?.inventoryDetail?.unitPrice || 0,
          discount: item.discount || 0
        })) || [],
        
        // Company details (add these from your business details or user profile)
        company: {
          logo: businessLogo,
          businessName: businessName,
          name: user?.result?.name || "",
          email: user?.result?.email || "",
          phoneNumber: user?.result?.phone || "",
          contactAddress: user?.result?.address || ""
        },
        
        // Payment details
        totalAmountReceived: getTotalAmountReceived(),
        balanceDue: calculateBalanceDue(),
      });
      
      setSendStatus("success");
      toast({ title: "Invoice sent successfully" });
    }
    } catch (error) {
      console.error(error);
      setSendStatus("error");
      toast({ 
        title: "Failed to send invoice", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    }
  };
  
  const createAndDownloadPdf = async () => {
    if (!invoice) return;
  
    setDownloadStatus("loading");
    try {
      if (invoice && !Array.isArray(invoice)) { // Ensure invoice is not an array

      await axios.post(
        `${import.meta.env.VITE_API_URL}create-pdf`,
        {
          // Use the same structure as in sendPdf method
          name: invoice.client?.name || "",
          email: invoice.client?.email || "",
          phone: invoice.client?.phone || "",
          address: invoice.client?.address || "",
          
          dueDate: invoice.dueDate,
          date: new Date(),
          id: invoice.invoiceNumber || "",
          notes: invoice.notes || "",
          subTotal: invoice.subTotal || 0,
          type: invoice.type || "Invoice",
          vat: invoice.vat || 0,
          total: invoice.total || 0,
          status: calculateBalanceDue() === 0 ? "Paid" : invoice.status || "Unpaid",
          
          items: invoice.items?.map((item: InvoiceItem) => ({
            itemName: item?.inventoryDetail?.itemName || "",
            quantity: item.quantity || 0,
            unitPrice: item?.inventoryDetail?.unitPrice || 0,
            discount: item.discount || 0
          })) || [],
          
          company: {
            businessName: businessName,
            name: user?.result?.name || "",
            email: user?.result?.email || "",
            phoneNumber: user?.result?.phone || "",
            contactAddress: user?.result?.address || ""
          },
          
          totalAmountReceived: getTotalAmountReceived(),
          balanceDue: calculateBalanceDue(),
        }
      );
      const response = await axios({
        url: `${import.meta.env.VITE_API_URL}/fetch-pdf`,
        method: 'GET',
        responseType: 'blob', // Important for file downloads
      });
      
      // Use FileSaver or native method to trigger download
      saveAs(response.data, `invoice_${invoice.invoiceNumber}.pdf`);
      
      setDownloadStatus("success");
    }
  
    } catch (error) {
      console.error(error);
      setDownloadStatus("error");
      toast({ 
        title: "Failed to download PDF", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    }
  };

  const getTotalAmountReceived = () => {
    return (
      !Array.isArray(invoice) && invoice?.paymentRecords?.reduce(
        (total: number, record: PaymentRecord) => total + Number(record.amountPaid),
        0
      ) || 0
    );
  };

  const calculateBalanceDue = () => {
    // Safely calculate balance due with default values
    if(!Array.isArray(invoice)){

      const invoiceTotal = invoice?.total || 0;
      const firstItemDiscount = Number(invoice?.items?.[0]?.discount) || 0;
      
      return Math.max(
        invoiceTotal * (1 - (firstItemDiscount / 100)) - getTotalAmountReceived(), 
        0
      );
    }
  };

  const checkStatus = () => {

    if(!Array.isArray(invoice) && invoice) {
    const totalReceived = getTotalAmountReceived();

      
      if (totalReceived >= (invoice.total || 0)) return "text-green-500";
      if (invoice.status === "Partial") return "text-blue-500";
      if (invoice.status === "Paid") return "text-green-500";
      return "text-red-500";
    }
  };

  if (!invoice) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const isCreator = !Array.isArray(invoice) && invoice?.creator?.includes(
    user?.result?._id ||
      user?.result?.googleId ||
      (user?.result && (user.result._id || user.result.googleId))
  );

  // Safe access for business details
  const businessName = businessDetails?.name || "Business Name";
  const businessLogo = businessDetails?.logo || businessName[0].toUpperCase();
//  const businessPhoneNumber = invoices.businessDetail?.[0]?.phoneNumber;
  const businessEmail = businessDetails?.email;

  return (
    <div className="container mx-auto px-4 py-8">
      {isCreator && (
        <div className="flex space-x-4 mb-8">
          <Button onClick={sendPdf} disabled={sendStatus === "loading"}>
            {sendStatus === "loading" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Send to Customer"
            )}
          </Button>
          <Button
            onClick={createAndDownloadPdf}
            disabled={downloadStatus === "loading"}
          >
            {downloadStatus === "loading" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Download className="mr-2" /> Download PDF
              </>
            )}
          </Button>
          <Button onClick={editInvoice}>
            <Edit className="mr-2" /> Edit Invoice
          </Button>
        </div>
      )}

      { invoice && !Array.isArray(invoice) && invoice.paymentRecords && invoice?.paymentRecords?.length > 0 && (
        <PaymentHistory paymentRecords={invoice.paymentRecords} />
      )}

      <PaymentModal 
        open={open} 
        setOpen={setOpen} 
        invoice={invoice && !Array.isArray(invoice) ? (invoice as InvoiceItem) : {}} 
        businessName={businessDetails?.name || ''}
      />

      <Card>
        <CardHeader className="bg-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl rounded-full bg-white w-fit p-2 px-4">{businessLogo}</h2>
                <h2 className="text-2xl font-bold">{businessName}</h2>
                <h2 className="text-xl font-bold">{businessEmail}</h2>

            </div>
            <div className="text-right">
              <CardTitle className="text-4xl font-bold text-gray-700">
                {getTotalAmountReceived() >= (invoice.total || 0)
                  ? "Receipt"
                  : invoice.type || "Invoice"}
              </CardTitle>
              <p className="text-sm text-gray-500">
                No: {invoice.invoiceNumber || "N/A"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
              <p>{invoice.client?.name || "N/A"}</p>
              <p>{invoice.client?.email || ""}</p>
              <p>{invoice.client?.phone || ""}</p>
              <p>{invoice.client?.address || ""}</p>
            </div>
            <div className="text-right">
              <p className="mb-1">
                <span className="font-semibold">Status:</span>{" "}
                <span className={checkStatus()}>
                  {calculateBalanceDue() === 0 ? "Paid" : invoice.status || "Unpaid"}
                </span>
              </p>
              <p className="mb-1">
                <span className="font-semibold">Date:</span>{" "}
                {moment().format("MMM Do YYYY")}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Due Date:</span>{" "}
                {moment(invoice.dueDate).format("MMM Do YYYY")}
              </p>
              <p>
                <span className="font-semibold">Amount:</span>{" "}
                {(invoice?.currency || "$")} {toCommas((calculateBalanceDue() || 0) + (getTotalAmountReceived() || 0))}
              </p>
            </div>
          </div>

          <Table className="mt-8">
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Disc(%)</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice && invoice?.items && invoice.items?.length > 0 ? (
                invoice.items.map((item: InvoiceItem, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item?.inventoryDetail?.itemName || "N/A"}</TableCell>
                    <TableCell>{item.quantity || 0}</TableCell>
                    <TableCell>{item?.inventoryDetail?.unitPrice || 0}</TableCell>
                    <TableCell>{item.discount || 0}</TableCell>
                    <TableCell>
                      {item.quantity && item?.inventoryDetail?.unitPrice
                        ? (
                            Number(item?.quantity) * item.inventoryDetail.unitPrice -
                            (Number(item?.quantity) *
                              item.inventoryDetail.unitPrice *
                              (Number(item?.discount) || 0)) /
                              100
                          ).toFixed(2)
                        : "0.00"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-8 w-1/2 ml-auto">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>
                {invoice.currency || "$"} {toCommas(invoice.subTotal || 0)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>VAT ({invoice.rates || 0}%):</span>
              <span>
                {invoice.currency || "$"} {toCommas(invoice.vat || 0)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span>
                {invoice.currency || "$"} {toCommas((calculateBalanceDue() || 0) + getTotalAmountReceived())}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Paid:</span>
              <span>
                {invoice.currency || "$"} {toCommas(getTotalAmountReceived())}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Balance:</span>
              <span>
                {invoice.currency || "$"}{" "}
                {toCommas(calculateBalanceDue())}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-semibold mb-2">Note/Payment Info</h4>
            <p>{invoice.notes || "No additional notes"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}