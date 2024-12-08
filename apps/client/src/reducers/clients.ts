import { ALL_CLIENTS, ADD_NEW_CLIENT, UPDATE_CLIENT, DELETE_CLIENT, FETCH_CLIENTS_BY_USER, FETCH_CLIENT, START_LOADING, END_LOADING } from '@/lib/actions/constants'
import { Client } from '@/lib/types/client-types';

interface ClientState {
  isLoading: boolean;
  clients: Client[];
  currentPage?: number;
  numberOfPages?: number;
  client?: Client; // Add this line to include the client property
}

interface ClientAction {
  type: string;
  payload: {
    data?: Client[], 
    currentPage?: number, 
    numberOfPages?: number, 
    client?: Client, 
    _id?: string
  }
}

const initialState: ClientState = {
  isLoading: true,
  clients: [],
  currentPage: undefined,
  numberOfPages: undefined,
  client: undefined // Add this to the initial state
};

const clients = (state: ClientState = initialState, action: ClientAction) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case ALL_CLIENTS:
      return {
        ...state,
        clients: action.payload.data || [],
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
        isLoading: false
      };
    case FETCH_CLIENTS_BY_USER:
      return {
        ...state,
        clients: Array.isArray(action.payload) ? action.payload : [],
        isLoading: false
      };
    case FETCH_CLIENT:
      return { 
        ...state, 
        client: action.payload.client 
      };
    case ADD_NEW_CLIENT:
      return { 
        ...state, 
        clients: [...state.clients, action.payload as Client] 
      };
    case UPDATE_CLIENT:
      return {
        ...state,
        clients: state.clients.map((client) =>
          client._id === action.payload._id ? action.payload as Client : client
        )
      };
    case DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter((client) => client._id !== action.payload)
      };
    default:
      return state;
  }
};

export default clients;