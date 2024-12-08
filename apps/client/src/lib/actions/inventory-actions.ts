import * as api from '@/lib/api/index';
import { 
    ADD_NEW_INVENTORY, 
    UPDATE_INVENTORY, 
    DELETE_INVENTORY, 
    FETCH_INVENTORY, 
    FETCH_INVENTORY_BY_ID, 
    FETCH_INVENTORY_BY_USER,
    INVENTORY_LOADING_START, 
    INVENTORY_LOADING_END 
} from '@/lib/actions/constants';
import { InventoryItem, SearchQuery } from '@/lib/types/inventory-types';

import { NavigateFunction } from 'react-router-dom';
import { Dispatch } from 'redux';

// Types for Inventory Items and Related Interfaces



// Fetch all inventory items
export const getInventoryItems = () => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: INVENTORY_LOADING_START });
        
        const { data } = await api.fetchInventoryItems();
        
        dispatch({ type: FETCH_INVENTORY, payload: data });
        
        dispatch({ type: INVENTORY_LOADING_END });
    } catch (error) {
        console.log(error);
    }
};

// Fetch a single inventory item by ID
export const getInventoryItem = (id: string) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: INVENTORY_LOADING_START });
        
        const { data } = await api.fetchInventoryItemById(id);
        
        dispatch({ type: FETCH_INVENTORY_BY_ID, payload: data });
        
        dispatch({ type: INVENTORY_LOADING_END });
    } catch (error) {
        console.log(error);
    }
};

// Create a new inventory item
export const createInventoryItem = (
  item: InventoryItem, 
  history: NavigateFunction
) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: INVENTORY_LOADING_START });
        
        const userProfile = localStorage.getItem('profile');
        const user = userProfile ? JSON.parse(userProfile) : null;
        const itemWithCreator = { 
          ...item, 
          creator: user?.result?._id || user?.result?.googleId 
        };
        
        const { data } = await api.addInventoryItem(itemWithCreator);
        
        dispatch({ 
          type: ADD_NEW_INVENTORY, 
          payload: data 
        });
        
        history(`/inventory/${data._id}`);
        
        dispatch({ type: INVENTORY_LOADING_END });
    } catch (error) {
        console.error('Error creating inventory item:', error);
        dispatch({ type: INVENTORY_LOADING_END });
    }
};

// Update an existing inventory item by ID
export const updateInventoryItem = (
  id: string, 
  updatedItem: InventoryItem
) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: INVENTORY_LOADING_START });
      
      const { data } = await api.updateInventoryItem(id, updatedItem);
      
      dispatch({ type: UPDATE_INVENTORY, payload: data });
      
      dispatch({ type: INVENTORY_LOADING_END });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      dispatch({ type: INVENTORY_LOADING_END });
    }
  };

// Delete an inventory item by ID
export const deleteInventoryItem = (
  id: string, 
  openSnackbar: (message: string) => void
) => async (dispatch: Dispatch) => {
    try {
        await api.deleteInventoryItem(id);
        
        dispatch({ type: DELETE_INVENTORY, payload: id });
        
        openSnackbar("Inventory item deleted successfully");
    } catch (error) {
        console.log(error);
    }
};

// Fetch inventory items by user
export const getInventoryByUser = (searchQuery: SearchQuery) => async (dispatch: Dispatch) => {
  console.log(searchQuery)
    try {
        dispatch({ type: INVENTORY_LOADING_START });
        
        const { data } = await api.fetchInventoryItemsByUser(searchQuery.search);
        console.log(data.data)
        
        dispatch({ type: FETCH_INVENTORY_BY_USER, payload: data.data});
        
        dispatch({ type: INVENTORY_LOADING_END });
    } catch (error) {
        console.error('Error fetching inventory items:', error);
    }
};