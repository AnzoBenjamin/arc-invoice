import * as api from "@/lib/api/index";

import {
  ADD_NEW_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
  FETCH_CLIENTS_BY_USER,
  FETCH_CLIENT,
  START_LOADING,
  END_LOADING,
} from "@/lib/actions/constants";
import { Dispatch } from "redux";

import { Client } from "@/lib/types/client-types";
export const getClient = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchClient(id);
    dispatch({ type: FETCH_CLIENT, payload: { client: data } });
  } catch (error) {
    console.log(error);
  }
};

export const getClientsByUser = (searchQuery: string ) => async (dispatch: Dispatch) => {
  try {
    console.log(searchQuery)

    dispatch({ type: START_LOADING });
    const { data } = await api.fetchClientsByUser(searchQuery);
    console.log(data.data)
    dispatch({ type: FETCH_CLIENTS_BY_USER, payload: data.data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const createClient = (client: Client) => async (dispatch: Dispatch) => {
  console.log(client)
  try {
    const { data } = await api.addClient(client);
    dispatch({ type: ADD_NEW_CLIENT, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateClient = (id: string, client: Client) => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.updateClient(id, client);
    dispatch({ type: UPDATE_CLIENT, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteClient = (id: string) => async (dispatch: Dispatch) => {
  try {
    await api.deleteClient(id);

    dispatch({ type: DELETE_CLIENT, payload: id });
  } catch (error) {
    console.log(error);
  }
};
