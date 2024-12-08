import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { getInvoicesByUser, deleteInvoice } from "@/lib/actions/invoice-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppDispatch, useAppSelector} from "@/hooks/use-redux-types";
import { InvoiceData } from "@/lib/types/invoice-types";


const ROWS_PER_PAGE = 10;

export default function Invoices() {
  const dispatch = useAppDispatch();
  const { invoices } = useAppSelector((state) => state?.invoices);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log(invoices)

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const userId: string = getUserId();
      if (!userId) {
        navigate("/auth");
        return;
      }
      dispatch(getInvoicesByUser(userId));
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      toast({
        title: "Error",
        description: "Failed to fetch invoices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigate, toast]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("profile") || "{}");
    return user?.result?._id || user?.result?.googleId;
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const editInvoice = (id: string) => {
    navigate(`/edit/invoice/${id}`);
  };

  const openInvoice = (id: string) => {
    navigate(`/invoice/${id}`);
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 mb-4">No invoices yet.</p>
        <Button onClick={() => navigate("/invoice")}>
          Create Invoice
        </Button>
      </div>
    );
  }

  const startIndex = page * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const displayedInvoices = invoices.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Number</TableHead>
            <TableHead className="text-center">Client</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Due Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedInvoices.map((invoice: InvoiceData) => (
            <TableRow key={invoice._id} className="cursor-pointer">
              <TableCell
                className="text-center"
                onClick={() => openInvoice(invoice?._id || '')}
              >
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell
                className="text-center"
                onClick={() => openInvoice(invoice?._id || '')}
              >
                {invoice?.client?.name}
              </TableCell>
              <TableCell
                className="text-center"
                onClick={() => openInvoice(invoice._id || '')}
              >
                {formatCurrency(invoice.total || 0)}
              </TableCell>
              <TableCell
                className="text-center"
                onClick={() => openInvoice(invoice._id || '')}
              >
                {formatDistanceToNow(new Date(invoice.dueDate || new Date()), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell
                className="text-center"
                onClick={() => openInvoice(invoice._id || '')}
              >
                <Badge
                  variant={
                    invoice.status === "Paid"
                      ? "default"
                      : invoice.status === "Partial"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editInvoice(invoice._id || '')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(deleteInvoice(invoice._id || ''))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            {page > 0 ? (
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
            ) : (
              <span className="disabled">Previous</span>
            )}
          </PaginationItem>
          {Array.from({
            length: Math.ceil(invoices.length / ROWS_PER_PAGE),
          }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => handlePageChange(index)}
                isActive={page === index}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            {endIndex < invoices.length ? (
              <PaginationNext onClick={() => handlePageChange(page + 1)} />
            ) : (
              <span className="disabled">Next</span>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
