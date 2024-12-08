import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash2 } from 'lucide-react'
import { useAppDispatch } from '@/hooks/use-redux-types'
import { deleteClient } from '@/lib/actions/client-actions'
import { Client } from '@/lib/types/client-types'

interface ClientsProps {
  clients: Client[];
  open: boolean;
  setOpen: (open: boolean) => void;
  currentId: string;
  setCurrentId: (currentId: string) => void;
}


export default function Clients({ setOpen, setCurrentId, clients }: ClientsProps) {
  const [page, setPage] = useState<number>(0)

  console.log(clients)
  
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const dispatch = useAppDispatch()

  const handleChangePage = (newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (value: string) => {
    setRowsPerPage(parseInt(value, 10))
    setPage(0)
  }

  const handleEdit = (id: string) => {
    setOpen(true)
    setCurrentId(id)
  }

  const handleDelete = (id: string) => {
    dispatch(deleteClient(id))
  }

  const paginatedClients = clients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="w-[100px]">Edit</TableHead>
            <TableHead className="w-[100px]">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedClients.map((client: Client, index: number) => (
            <TableRow key={client._id}>
              <TableCell>{page * rowsPerPage + index + 1}</TableCell>
              <TableCell>
                <Button variant="ghost">{client.name}</Button>
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(client._id ? client._id: '')}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(client._id ? client._id: '')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page > 0 ? (
                <PaginationPrevious 
                  onClick={() => handleChangePage(page - 1)}
                />
              ) : (
                <span className="disabled">Previous</span>
              )}
            </PaginationItem>
            {[...Array(Math.ceil(clients.length / rowsPerPage))].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  onClick={() => handleChangePage(index)}
                  isActive={page === index}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={page < Math.ceil(clients.length / rowsPerPage) - 1 ? () => handleChangePage(page + 1) : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <Select
          value={rowsPerPage.toString()}
          onValueChange={handleChangeRowsPerPage}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="-1">All</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}