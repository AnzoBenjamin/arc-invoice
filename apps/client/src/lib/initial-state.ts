const userProfile = localStorage.getItem('profile');
const user = userProfile ? JSON.parse(userProfile) : {};

export const initialState = {
    items: [
        {inventoryItem: '', quantity: '', discount: ''},
    ],
    total: 0,
    notes: user?.userProfile?.paymentDetails,
    rates: '',
    vat: 0,
    currency: '',
    invoiceNumber: Math.floor(Math.random() * 100000),
    status: '',
    type: 'Invoice',
    creator: '',
}
