// Types for Inventory Items and Related Interfaces

export interface InventoryItem {
    _id?: string;
    itemName: string;
    sku: string;
    quantity: string;
    unitPrice: string;
    category: string;
    threshold: string;
    description: string;
    creator?: string[];
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