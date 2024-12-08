import { CREATE_PROFILE, FETCH_PROFILES_BY_USER, UPDATE_PROFILE, DELETE_PROFILE, FETCH_PROFILE_BY_USER, START_LOADING, END_LOADING, FETCH_PROFILE } from '@/lib/actions/constants';

import { BusinessProfile } from '@/lib/types/profile-types';
// Define a specific type for the profile structure


interface ProfileState {
  isLoading: boolean;
  profiles: BusinessProfile[];
}

interface ProfileAction {
  type: string;
  payload: BusinessProfile | BusinessProfile[] | { _id: string };
}

const profilesReducer = (
  state: ProfileState = { isLoading: true, profiles: [] }, 
  action: ProfileAction
) => {
  switch (action.type) {
    case START_LOADING:
      return {...state, isLoading: true }
    case END_LOADING:
      return {...state, isLoading: false }
    case FETCH_PROFILES_BY_USER:
      return { ...state, profiles: action.payload ? action.payload : [] };
      
    case FETCH_PROFILE_BY_USER:
      return {...state, profiles: action.payload }
    case FETCH_PROFILE:
      // localStorage.setItem('userProfile', JSON.stringify({...action.payload}))
      return {...state, profile: action.payload }
    
    case CREATE_PROFILE:
      return {...state, profiles: [...state.profiles, action.payload]}
    case UPDATE_PROFILE:
      return {
        ...state, 
        profiles: state.profiles.map((profile) => 
          profile._id === (action.payload as BusinessProfile)._id ? action.payload as BusinessProfile : profile
        )
      }
    case DELETE_PROFILE:
      return {
        ...state, 
        profiles: state.profiles.filter((profile) => 
          profile._id !== (action.payload as { _id: string })._id
        )
      }
    default:
      return state;
  }
};

export default profilesReducer
