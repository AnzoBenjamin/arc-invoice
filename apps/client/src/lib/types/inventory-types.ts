// Updated InventoryItem interface to match the actual item structure
export interface InventoryItem {
    _id?: string;
    itemName?: string;
    sku?: string;
    quantity?: number;
    unitPrice?: number;
    category?: string;
    threshold?: number;
    description?: string;
    creator?: string | string[]; // Optional creator field
  }
  
  export interface InventoryState {
    inventoryItems: InventoryItem[];
    loading: boolean;
  }
  
  export interface UserProfile {
    result: {
      _id?: string;
      googleId?: string;
    };
  }
  
  export interface SearchQuery {
    search: string;
  }
  
  export interface InventoryActionTypes {
    ADD_NEW_INVENTORY: string;
    UPDATE_INVENTORY: string;
    DELETE_INVENTORY: string;
    FETCH_INVENTORY: string;
    FETCH_INVENTORY_BY_ID: string;
    FETCH_INVENTORY_BY_USER: string;
    INVENTORY_LOADING_START: string;
    INVENTORY_LOADING_END: string;
  }
  
  export interface CreateInventoryItemAction {
    type: string;
    payload: InventoryItem;
  }
  
  export interface FetchInventoryAction {
    type: string;
    payload: InventoryItem[];
  }