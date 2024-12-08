import {
    FETCH_INVENTORY,
    ADD_NEW_INVENTORY,
    UPDATE_INVENTORY,
    DELETE_INVENTORY,
    FETCH_INVENTORY_BY_ID,
    INVENTORY_LOADING_START,
    INVENTORY_LOADING_END,
    FETCH_INVENTORY_BY_USER
  } from '@/lib/actions/constants';
  import { InventoryItem } from '@/lib/types/inventory-types';
  
  interface InventoryState {
    isLoading: boolean;
    inventoryItems: InventoryItem[];
    inventoryItem?: InventoryItem; // Add this to handle single item fetching
  }
  
  interface InventoryAction {
    type: string; // Broadened type to avoid strict matching issues
    payload: {
      inventory?: InventoryItem | InventoryItem[];
      _id?: string;
    };
  }
  
  const initialState: InventoryState = {
    isLoading: true,
    inventoryItems: [],
    inventoryItem: undefined
  };
  
  const inventory = (state: InventoryState = initialState, action: InventoryAction) => {
    switch (action.type) {
      case INVENTORY_LOADING_START:
        return { ...state, isLoading: true };
      case INVENTORY_LOADING_END:
        return { ...state, isLoading: false };
      case FETCH_INVENTORY:
        return {
          ...state,
          inventoryItems: Array.isArray(action.payload.inventory) 
            ? action.payload.inventory 
            : (action.payload.inventory ? [action.payload.inventory] : []),
          isLoading: false
        };
      case FETCH_INVENTORY_BY_ID:
        return {
          ...state,
          inventoryItem: action.payload.inventory as InventoryItem,
          isLoading: false
        };
      case ADD_NEW_INVENTORY:
        return {
          ...state,
          inventoryItems: [...state.inventoryItems, action.payload.inventory as InventoryItem],
          isLoading: false
        };
      case UPDATE_INVENTORY:
        return {
          ...state,
          inventoryItems: state.inventoryItems.map((item) =>
            item._id === action.payload._id ? action.payload.inventory as InventoryItem : item
          ),
          isLoading: false
        };
      case DELETE_INVENTORY:
        return {
          ...state,
          inventoryItems: state.inventoryItems.filter((item) => item._id !== action.payload._id),
          isLoading: false
        };
      case FETCH_INVENTORY_BY_USER:
        console.log(action.payload)
        return {
          ...state,
          inventoryItems: Array.isArray(action.payload) 
            ? action.payload 
            : (action.payload ? [action.payload] : []),
          isLoading: false
        };
      default:
        return state;
    }
  };
  
  export default inventory;