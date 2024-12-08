'use client'

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BarChart2,
  FilePlus,
  Layers,
  Box,
  DollarSign,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: BarChart2, href: "/dashboard" },
  { name: "Create", icon: FilePlus, href: "/invoice" },
  { name: "Invoices", icon: Layers, href: "/invoices" },
  { name: "Inventory", icon: Box, href: "/inventory" },
  { name: "Expenses", icon: DollarSign, href: "/expenses" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export default function NavBar() {
  const location = useLocation()
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("profile")
    return storedUser ? JSON.parse(storedUser) : null
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("profile")
    setUser(storedUser ? JSON.parse(storedUser) : null)
  }, [location])

  if (!user) return null

  return (
    <nav className="group flex flex-col justify-between bg-gray-900 text-white transition-all duration-300 w-16 hover:w-64">
      <div>
        <Link to="/dashboard" className="flex h-16 items-center justify-center">
          <img
            src="https://i.postimg.cc/hGZKzdkS/logo.png"
            alt="arc-invoice"
            className="h-8 w-8"
          />
          <span className="ml-2 hidden text-xl font-bold text-white transition-opacity duration-300 group-hover:inline-block">
            Arc Invoice
          </span>
        </Link>
        <ul className="mt-6 space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-4 text-white py-2 text-sm font-medium transition-colors hover:bg-gray-800",
                  location.pathname === item.href && "bg-gray-800 text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="ml-4 hidden group-hover:inline-block">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="mb-4 ml-auto hidden h-8 w-8 rotate-180 transform transition-transform duration-300 group-hover:inline-block"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    </nav>
  )
}