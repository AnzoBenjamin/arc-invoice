import * as api from '@/lib/api/index'

import { ADD_NEW, UPDATE, DELETE, GET_INVOICE, FETCH_INVOICE_BY_USER, START_LOADING, END_LOADING } from '@/lib/actions/constants'
import { Dispatch } from 'redux';
import { InvoiceData } from '@/lib/types/invoice-types';
// export const getInvoices = () => async (dispatch)=> {
//     try {
//         const { data } = await api.fetchInvoices()
//         dispatch({ type: FETCH_ALL, payload: data })
//     } catch (error) {
//         console.log(error)
//     }
// }





export const getInvoicesByUser = (searchQuery: string) => async (dispatch: Dispatch) => {
    const actionId = Date.now();
    console.log(`[${actionId}] Fetching invoices for user:`, searchQuery);

    console.log(searchQuery)
    try {
      dispatch({ type: START_LOADING });
  
      const [invoiceResponse, inventoryResponse] = await Promise.all([
        api.fetchInvoicesByUser(searchQuery),
        api.fetchInventoryItemsByUser(searchQuery)
      ]);
  
      console.log('Full Invoice Response:', JSON.stringify(invoiceResponse, null, 2));
      console.log('Invoice Response Data:', invoiceResponse.data);
      
      // Add a null check and provide more context
      if (!invoiceResponse.data || !invoiceResponse.data.data) {
        console.warn('No data or data.data property in invoice response');
        throw new Error('Invalid invoice response structure');
      }

      const invoices = invoiceResponse.data.data;
      const inventoryItems = inventoryResponse.data.data
      
      console.log(`Fetched Invoices: ${invoices?.length || 0}, Inventory: ${inventoryItems.length || 0}`);
      console.log('First Invoice (if any):', invoices[0]);
      console.log("Fetched inventory items",inventoryResponse.data.data)

      dispatch({
        type: FETCH_INVOICE_BY_USER,
        payload: {
          invoices,
          inventoryItems
        }
      });
  
      dispatch({ type: END_LOADING });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      dispatch({ type: END_LOADING });
    }
};

export const getInvoice = (
  id: string
) => async (dispatch: Dispatch) => {
    try {
        const { data } = await api.fetchInvoice(id)
        
        // Safely get user profile
        const userProfile = localStorage.getItem('profile')
        const user = userProfile ? JSON.parse(userProfile) : null;

        // Fetch inventory details for each item
        

        const businessDetailsResponse = user 
          ? await api.fetchProfilesByUser(user?.result?._id || user?.result?.googleId)
          : { data: null };

        const invoiceData = {
            ...data, 
            businessDetails: businessDetailsResponse.data,
        }
        
        console.log("Full Invoice Data", invoiceData)
        dispatch({ type: GET_INVOICE, payload: invoiceData })
    } catch (error) {
        console.error('Error in getInvoice:', error);
        dispatch({ 
          type: GET_INVOICE, 
          payload: null 
        });
    }
}
export const createInvoice = (invoice: InvoiceData) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const formattedInvoice = {
            ...invoice,
            items: invoice.items?.map(item => ({
                ...item,
                inventoryItem: item.inventoryItem // Ensure this is included
            }))
        };
        const { data } = await api.addInvoice(formattedInvoice);
        dispatch({ type: ADD_NEW, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error);
    }
}

export const updateInvoice =(id: string, invoice: InvoiceData) => async (dispatch: Dispatch) => {
    console.log(id, invoice)

    try {
        const { data } = await api.updateInvoice(id, invoice)
        console.log(data)
        dispatch({ type: UPDATE, payload: data })
        
    } catch (error) {
        console.log(error)
    }
}

export const deleteInvoice =(id: string) => async (dispatch: Dispatch) => {
    try {
        await api.deleteInvoice(id)

        dispatch({type: DELETE, payload: id})
    } catch (error) {
        console.log(error)
    }
}