"use client";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/nav-bar/nav-bar";
import Header from "@/components/header/header";
import Home from "@/components/home/home";
import Invoice from "@/components/invoice/invoice";
import InvoiceDetails from "@/components/invoice-details/invoice-details";
import Invoices from "@/components/invoices/invoices";
import Inventory from "@/components/inventory/inventory";
import Login from "@/components/auth/auth";
import Settings from "@/components/settings/settings";
import Dashboard from "@/components/dashboard/dashboard";
import ClientList from "@/components/clients/client-list";
import Forgot from "@/components/password/forgot";
import Reset from "@/components/password/reset";
import ProtectedRoute from "@/components/protected-route/protected-route";
import LoggedInRoute from "./components/logged-in-route/logged-in-route";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ExpensePage from "./components/expenses/expenses";

export default function App() {
  const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error("Google Client ID is not defined in environment variables");
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          <NavBar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              <Routes>
                <Route element={<LoggedInRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Login />} />
                  <Route path="/forgot-password" element={<Forgot />} />
                  <Route path="/reset-password/:token" element={<Reset />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/invoice" element={<Invoice />} />
                  <Route path="/edit/invoice/:id" element={<Invoice />} />
                  <Route
                    path="/invoice/:id"
                    element={<InvoiceDetails/>}
                  />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customers" element={<ClientList />} />
                  <Route path="/expenses" element={<ExpensePage/>}/>
                </Route>

                <Route
                  path="/new-invoice"
                  element={<Navigate to="/invoice" replace />}
                />
              </Routes>
            </main>
            <Toaster />
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}
