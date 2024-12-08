import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Assuming you're using a similar state management setup
import { createClient, updateClient } from "@/lib/actions/client-actions";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-types";
import { useToast } from "@/hooks/use-toast";

interface User {
  result?: {
    _id?: string;
    googleId?: string;
  };
}

interface AddClientProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentId?: string;
  setCurrentId?: (currentId: string) => void;
}

export default function AddClient({
  open,
  setOpen,
  currentId,
  setCurrentId,
}: AddClientProps) {
  const {toast} = useToast();
  const location = useLocation();
  const [clientData, setClientData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    userId: string;
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
    userId: "",
  });
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();

  const client = useAppSelector((state) =>
    currentId
      ? state.clients.clients.find((c: { _id: string }) => c._id === currentId)
      : null
  );

  useEffect(() => {
    const profile = localStorage.getItem("profile");
    if (profile) {
      setUser(JSON.parse(profile));
    }
  }, [location]);
  useEffect(() => {
    if (client) {
      setClientData(client);
    }
  }, [client]);

  useEffect(() => {
    if (user) {
      const newUserId = user.result?._id || user.result?.googleId;
      console.log(newUserId)
      if (newUserId) {
        setClientData((prevData) => ({
          ...prevData,
          userId: newUserId,
        }));
      }
    }
  }, [user]);
  const handleSubmitClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(currentId);
    console.log(clientData);
    if (currentId) {
      dispatch(updateClient(currentId, clientData));
      toast({
        title: `${clientData.name} has been updated`,
        description: "A new profile has been successfully updated",
      });
    } else {
      dispatch(createClient(clientData));
      toast({
        title: `${clientData.name} has been created`,
        description: "A new profile has been successfully created",
      });
    }
    clear();
    setOpen(false);
  };

  const clear = () => {
    setCurrentId?.(""); // Use optional chaining instead of checking if setCurrentId exists
    setClientData({ name: "", email: "", phone: "", address: "", userId: "" });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {currentId ? "Edit Customer" : "Add new Client"}
          </DialogTitle>
          <DialogDescription>
            Enter the client's details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitClient}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={clientData.name}
                onChange={(e) =>
                  setClientData({ ...clientData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                className="col-span-3"
                value={clientData.email}
                onChange={(e) => {
                  console.log("Current email input:", e.target.value);
                  setClientData({ ...clientData, email: e.target.value });
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                className="col-span-3"
                value={clientData.phone}
                onChange={(e) =>
                  setClientData({ ...clientData, phone: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                className="col-span-3"
                value={clientData.address}
                onChange={(e) =>
                  setClientData({ ...clientData, address: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
