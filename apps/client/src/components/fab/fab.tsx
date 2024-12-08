import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, FileText, UserPlus } from 'lucide-react'
import AddClient from '@/components/clients/add-client'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
export default function FabButton() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleNewInvoice = () => {
    router.push('/invoice')
  }

  const handleNewCustomer = () => {
    setOpen(true)
  }

  if (pathname === '/invoice') return null

  return (
    <>
      <AddClient setOpen={setOpen} open={open} />
      <div className="fixed bottom-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600">
              <Plus className="h-6 w-6" />
              <span className="sr-only">Add new</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {pathname !== '/invoice' && (
              <DropdownMenuItem onClick={handleNewInvoice}>
                <FileText className="mr-2 h-4 w-4" />
                <span>New Invoice</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleNewCustomer}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>New Customer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}