import { useState, useEffect, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-types";
import { addDays } from "date-fns";
import {
  createInvoice,
  getInvoice,
  updateInvoice,
} from "@/lib/actions/invoice-actions";
import { getClientsByUser } from "@/lib/actions/client-actions";
import { getInventoryByUser } from "@/lib/actions/inventory-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import AddClient from "@/components/clients/add-client";
import InvoiceType from "./invoice-type";
import { initialState } from "@/lib/initial-state";
import currencies from "@/lib/currencies.json";
import { InvoiceData } from "@/lib/types/invoice-types";
import { InventoryItem } from "@/lib/types/inventory-types";
import { Client } from "@/lib/types/client-types";

export default function InvoiceForm({ id }: { id?: string }) {
  const generateInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `INV-${currentYear}-${randomNum}`;
  };
  // At the top of the component, modify the useState initialization
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    ...initialState,
    items: initialState.items || [],
    invoiceNumber: initialState.invoiceNumber || generateInvoiceNumber(),
  });
  const [rates, setRates] = useState<number | string |undefined>(0);
  const [vat, setVat] = useState<number>(0);
  const [currency, setCurrency] = useState<string | undefined>(currencies[0].value);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 7));
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [type, setType] = useState<string | undefined>("Invoice");
  const [status, setStatus] = useState<string>("");
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const user = useMemo(() => {
    const userProfile = localStorage.getItem("profile");
    return userProfile ? JSON.parse(userProfile) : {};
  }, []);

  const clients = useAppSelector((state) => state.clients.clients);
  const { invoice } = useAppSelector((state) => state.invoices);
  const { inventoryItems } = useAppSelector((state) => state.inventory);

  useEffect(() => {
    if (id) {
      dispatch(getInvoice(id));
    }
    dispatch(getClientsByUser(user?.result._id || user?.result?.googleId));
    dispatch(
      getInventoryByUser({ search: user?.result._id || user?.result?.googleId })
    );
  }, [dispatch, id, user]);

  useEffect(() => {
    if (invoice && !Array.isArray(invoice)) {
      setInvoiceData(invoice);

      // Add a check to ensure dueDate is a valid date
      const dueDate = invoice.dueDate
        ? new Date(invoice.dueDate)
        : addDays(new Date(), 7);
      setSelectedDate(dueDate);

      setClient(invoice.client);
      setType(invoice.type);
      setRates(invoice.rates);
      setCurrency(invoice.currency);
    }
  }, [invoice]);

  useEffect(() => {
    if (inventoryItems) {
      setAvailableItems(inventoryItems);
    }
  }, [inventoryItems]);

  useEffect(() => {
    setStatus(type === "Receipt" ? "Paid" : "Unpaid");
  }, [type]);

  useEffect(() => {
    if (invoiceData?.items?.length) {
      const subTotal = invoiceData.items.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
        0
      );
      setSubTotal(subTotal);
      const vatAmount = (Number(rates) / 100) * subTotal;
      setVat(vatAmount);
      setTotal(subTotal + vatAmount);
    }
  }, [invoiceData, rates]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prevState) => {
      const updatedItems = [...(prevState.items || [])];
      if (name === "itemName") {
        const selectedItem = availableItems.find(
          (item) => item.itemName === value
        );
        if (selectedItem) {
          updatedItems[index] = {
            ...updatedItems[index],
            itemName: selectedItem.itemName,
            unitPrice: Number(selectedItem.unitPrice),
            quantity: updatedItems[index].quantity || 1,
            inventoryItem: selectedItem._id,
          };
        }
      } else {
        updatedItems[index] = {
          ...updatedItems[index],
          [name]: value,
        };
      }
      return { ...prevState, items: updatedItems };
    });
  };

  const handleAddField = () => {
    setInvoiceData((prevState) => {
      const currentItems = prevState.items || [];
      return {
        ...prevState,
        items: [
          ...currentItems,
          {
            itemName: "",
            unitPrice: 0,
            quantity: 1,
            discount: "",
            amount: "",
            inventoryItem: null,
          },
        ],
      };
    });
  };
  const handleRemoveField = (index: number) => {
    setInvoiceData((prevState) => {
      const updatedItems = [...(prevState.items || [])];
      updatedItems.splice(index, 1);
      return { ...prevState, items: updatedItems };
    });
  };

  const handleSelectChange = (index: number, value: string) => {
    setInvoiceData((prevState) => {
      const updatedItems = [...(prevState.items || [])];
      const selectedItem = availableItems.find(
        (item) => item.itemName === value
      );
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          itemName: selectedItem.itemName,
          unitPrice: selectedItem.unitPrice,
          quantity: updatedItems[index].quantity || 1,
          inventoryItem: selectedItem._id,
        };
      }
      return { ...prevState, items: updatedItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!invoiceData || !invoiceData.items || invoiceData.items.length === 0) {
      return;
    }
    const formattedItems = invoiceData.items.map((item) => ({
      inventoryItem: item.inventoryItem,
      quantity: item.quantity,
      discount: String(item.discount || 0),
    }));

    // Ensure invoiceNumber exists, generate one if it doesn't
    const invoiceNumber = invoiceData.invoiceNumber || generateInvoiceNumber();

    const newInvoice: InvoiceData = {
      ...invoiceData,
      items: formattedItems,
      subTotal,
      total,
      vat,
      rates,
      currency,
      dueDate:
        selectedDate instanceof Date ? selectedDate : new Date(selectedDate),
      invoiceNumber: invoiceNumber,
      client: client || { _id: "", name: "", email: "" },
      type: type || "Invoice",
      status: status || "Unpaid",
      paymentRecords: [],
      creator: user?.result?._id || user?.result?.googleId,
      totalAmountReceived: 0,
      createdAt: new Date().toISOString(),
    };

    if (id) {
      dispatch(updateInvoice(id, newInvoice));
    } else {
      dispatch(createInvoice(newInvoice));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Invoice" : "Create Invoice"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Invoice Type</Label>
              <InvoiceType type={type || ''} setType={setType} />
            </div>
            <div>
              <Label>Invoice Number</Label>
              <Input
                value={invoiceData.invoiceNumber}
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    invoiceNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <Label>Client</Label>
            {client ? (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{client?.name ? client.name[0] : '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setClient(undefined)}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Select
                onValueChange={(value) =>
                  setClient(clients.find((c: Client) => c._id === value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: Client) => (
                    <SelectItem key={client._id} value={client._id || ''}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!client && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setOpen(true)}
                >
                  Add New Client
                </Button>
                <AddClient open={open} setOpen={setOpen} />
              </>
            )}
          </div>

          <div className="mt-6">
            <Label>Invoice Items</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount (%)</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData &&
                  invoiceData?.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          name="itemName"
                          value={item.itemName}
                          onValueChange={(value) =>
                            handleSelectChange(index, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an item" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableItems.map((availableItem) => (
                              <SelectItem
                                key={availableItem._id}
                                value={availableItem.itemName || ''}
                              >
                                {availableItem.itemName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="unitPrice"
                          value={item.unitPrice}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="discount"
                          value={item.discount}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </TableCell>
                      <TableCell>
                        {(
                          Number(item.quantity) *
                          Number(item.unitPrice) *
                          (1 - Number(item.discount) / 100)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Button onClick={handleAddField} className="mt-4">
              Add Item
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                value={rates}
                onChange={(e) => setRates(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <DatePicker
                selectedDate={selectedDate}
                setSelectedDate={(date: Date) => setSelectedDate(date)}
              />{" "}
            </div>
          </div>

          <div className="mt-6">
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.countryCode} value={curr.countryCode}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6">
            <Label>Notes</Label>
            <Textarea
              placeholder="Additional notes or payment information"
              value={invoiceData.notes}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, notes: e.target.value })
              }
            />
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                {currency} {subTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>VAT ({rates}%):</span>
              <span>
                {currency} {vat.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>
                {currency} {total.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        {id ? "Update Invoice" : "Create Invoice"}
      </Button>
    </form>
  );
}
