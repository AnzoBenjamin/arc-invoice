import axios from 'axios'
import { BusinessProfile } from '../types/profile-types';
import { Client } from '../types/client-types';
import { InventoryItem } from '../types/inventory-types';
import { InvoiceData } from '../types/invoice-types';
import { UserCredentials } from '../types/user-types';
import { Expense } from '../types/expense-types';
// const API = axios.create({ baseURL: 'http://localhost:5000'})

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL})

API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');
    if (profile) {
        req.headers.authorization = `Bearer ${JSON.parse(profile).token}`
    }

    return req
})

// export const fetchInvoices =() => API.get('/invoices')
export const fetchInvoice =(id: string) => API.get(`/invoices/${id}`)
export const addInvoice =( invoice: InvoiceData ) => API.post('/invoices', invoice)
export const updateInvoice = (id: string, updatedInvoice: InvoiceData) => API.patch(`/invoices/${id}`, updatedInvoice)
export const deleteInvoice =(id: string) => API.delete(`/invoices/${id}`)
export const fetchInvoicesByUser = (searchQuery: string) => API.get(`/invoices?searchQuery=${searchQuery}`);

export const fetchClient = (id: string) => API.get(`/clients/${id}`);
export const fetchClients = (page: number) => API.get(`/clients?page=${page}`);
export const addClient =( client: Client ) => API.post('/clients', client)
export const updateClient = (id: string, updatedClient: Client) => API.patch(`/clients/${id}`, updatedClient)
export const deleteClient =(id: string) => API.delete(`/clients/${id}`)
export const fetchClientsByUser = (searchQuery: string) => API.get(`/clients/user?searchQuery=${searchQuery}`);


export const signIn =(formData: UserCredentials)=> API.post('/users/signin', formData)
export const signUp =(formData: UserCredentials)=> API.post('/users/signup', formData)
export const forgot = (formData: {email: string}) => API.post('/users/forgot', formData);
export const reset = (formData: {password: string, token: string}) => API.post('/users/reset', formData);

export const fetchProfilesBySearch = (searchQuery: string) => API.get(`/profiles/search?searchQuery=${ searchQuery }`);
export const fetchProfile = (id: string) => API.get(`/profiles/${id}`)
export const fetchProfiles = () => API.get('/profiles');
export const fetchProfilesByUser = (searchQuery: string) => API.get(`/profiles?searchQuery=${searchQuery.search}`)
export const createProfile = (newProfile: BusinessProfile) => API.post('/profiles', newProfile);
export const updateProfile = (id: string, updatedProfile: BusinessProfile) => API.patch(`/profiles/${id}`, updatedProfile);
export const deleteProfile = (id: string) => API.delete(`/profiles/${id}`);

// Inventory API calls
export const fetchInventoryItems = () => API.get('/inventory');
export const fetchInventoryItemById = (id: string) => API.get(`/inventory/${id}`);
export const fetchInventoryItemsByUser = (id: string) => API.get(`/inventory/user/${id}`);
export const addInventoryItem = (item: InventoryItem) => API.post('/inventory', item);
export const updateInventoryItem = (id: string, updatedItem: InventoryItem) => API.put(`/inventory/${id}`, updatedItem);
export const deleteInventoryItem = (id: string) => API.delete(`/inventory/${id}`);

// Expense API Calls
export const fetchExpenses = () => API.get('/expenses');
export const fetchExpensesByUser = (userId: string) => API.get(`/expenses?searchQuery=${userId}`);
export const addExpense = (newExpense: Expense) => API.post('/expenses', newExpense);
export const updateExpense = (id: string, updatedExpense: Expense) => API.patch(`/expenses/${id}`, updatedExpense);
export const deleteExpense = (id: string) => API.delete(`/expenses/${id}`);