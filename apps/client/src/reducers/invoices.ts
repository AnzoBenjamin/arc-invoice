import {
  FETCH_ALL,
  ADD_NEW,
  UPDATE,
  DELETE,
  GET_INVOICE,
  START_LOADING,
  END_LOADING,
  FETCH_INVOICE_BY_USER,
} from "@/lib/actions/constants";
import { InventoryItem } from "@/lib/types/inventory-types";
import { InvoiceData } from "@/lib/types/invoice-types";
import { BusinessProfile } from "@/lib/types/profile-types";

interface InvoiceState {
  isLoading: boolean;
  invoices: InvoiceData[];
  invoice: InvoiceData | null; // Change to nullable single invoice
  businessDetails: BusinessProfile | null;
  inventoryItems: InventoryItem[];
  currentPage?: number;
  numberOfPages?: number;
}

interface InvoiceAction {
  type: string;
  payload?: {
    data?: InvoiceData[];
    businessDetails?: BusinessProfile
    currentPage?: number;
    numberOfPages?: number;
    invoices?: InvoiceData | InvoiceData[];
    _id?: string;
  };
}

const initialState: InvoiceState = {
  isLoading: true,
  invoices: [],
  invoice: null, // Initialize as null
  inventoryItems: [],
  businessDetails: null,
  currentPage: undefined,
  numberOfPages: undefined,
};

const invoices = (
  state: InvoiceState = initialState,
  action: InvoiceAction
) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return {
        ...state,
        invoices: action.payload?.data || [],
        currentPage: action.payload?.currentPage,
        numberOfPages: action.payload?.numberOfPages,
        isLoading: false,
      };
    case FETCH_INVOICE_BY_USER:
      return { 
        ...state, 
        invoices: Array.isArray(action.payload?.invoices) 
          ? action.payload.invoices 
          : (action.payload?.invoices ? [action.payload.invoices] : []),
        isLoading: false,
      };
    case GET_INVOICE:
      console.log(action.payload)
      return { 
        ...state, 
        invoice: action.payload?.data as InvoiceData,
        isLoading: false,
        businessDetails: action.payload?.businessDetails
      };
    case ADD_NEW:
      return { 
        ...state, 
        invoices: action.payload?.invoices 
          ? [...state.invoices, action.payload.invoices as InvoiceData]
          : state.invoices,
        isLoading: false,
      };
    case UPDATE:
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice._id === action.payload?._id 
            ? action?.payload?.invoices as InvoiceData 
            : invoice
        ),
        isLoading: false,
      };
    case DELETE:
      return {
        ...state,
        invoices: state.invoices.filter(
          (invoice) => invoice._id !== action.payload?._id
        ),
        isLoading: false,
      };
    default:
      return state;
  }
};

export default invoices;