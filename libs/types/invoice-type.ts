type InvoiceType = {
    name: string
    address: string
    phone: string
    email: string
    dueDate: Date
    date: Date
    id: string
    notes: string
    subTotal: number  // Changed from float as TypeScript uses number
    type: string
    vat: number    // Assuming VAT is a number/percentage
    total: number    // Changed to number as it's likely a numerical value
    items: Array<any> // Or define a specific item interface
    status: string
    totalAmountReceived: number  // Changed to number for calculations
    balanceDue: number          // Changed to number for calculations
    company: string
}

export default InvoiceType