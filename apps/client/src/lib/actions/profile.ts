import { FETCH_PROFILES_BY_USER, CREATE_PROFILE, UPDATE_PROFILE, DELETE_PROFILE, FETCH_PROFILE_BY_USER, START_LOADING, END_LOADING, FETCH_PROFILE } from '@/lib/actions/constants';
import * as api from '@/lib/api/index';
import { Dispatch } from 'redux';
import { BusinessProfile } from '../types/profile-types';

export const getProfile = (id: string) => async (dispatch: Dispatch) => {
  try {
    // dispatch({ type: START_LOADING })
    const { data } = await api.fetchProfile(id);


    dispatch({ type: FETCH_PROFILE, payload: data });
    // dispatch({ type: END_LOADING })

  } catch (error) {
    console.log(error);
  } };



export const getProfilesByUser =(searchQuery: string) => async (dispatch: Dispatch) => {
  console.log("Getting profiles")
  try {
    dispatch({ type: START_LOADING })
    const { data: { data } } = await api.fetchProfilesByUser(searchQuery)
    console.log("Profile")
    console.log(data)
    dispatch({ type: FETCH_PROFILE_BY_USER, payload: data });
 
    dispatch({ type: END_LOADING })
  } catch (error) {
    console.log(error)
    
  }
}


export const getProfilesBySearch = (searchQuery: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchProfilesBySearch(searchQuery);

    dispatch({ type: FETCH_PROFILES_BY_USER, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};



export const createProfile = (profile: BusinessProfile) => async (dispatch: Dispatch) => {
  try {
    // dispatch({ type: START_LOADING })
    const { data } = await api.createProfile(profile);
    // history.push(`/profiles/${data._id}`)

    dispatch({ type: CREATE_PROFILE, payload: data });
    // dispatch({ type: END_LOADING })
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = (id: string, form: BusinessProfile) => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.updateProfile(id, form);

    dispatch({ type: UPDATE_PROFILE, payload: data });
  } catch (error) {
    console.log(error);
  }
};


export const deleteProfile = (id: string) => async (dispatch: Dispatch) => {
  try {
   await api.deleteProfile(id);

    dispatch({ type: DELETE_PROFILE, payload: id });
  } catch (error) {
    console.log(error);
  }
};
