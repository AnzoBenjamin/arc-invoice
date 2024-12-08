import { Dispatch } from 'redux';
import * as api from "@/lib/api/index";
import { AUTH, CREATE_PROFILE } from "@/lib/actions/constants";
import { UserCredentials } from '../types/user-types';

export const signin = (
  formData: UserCredentials, 
  setLoading: (loading: boolean) => void,
  navigate: (path: string) => void
) => async (dispatch: Dispatch) => {
  setLoading(true);
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });
    setLoading(false)
    navigate("/dashboard");

  } catch (error) {
    console.log(error)
    setLoading(false);
  }
};

export const signup = (
  formData: UserCredentials,
  setLoading: (loading: boolean) => void,
  navigate: (path: string) => void
) => async (dispatch: Dispatch) => {
  setLoading(true);
  try {
    //Sign up the user
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
    const { data: info } = await api.createProfile({
      name: data?.result?.name,
      email: data?.result?.email,
      userId: data?.result?._id,
      phoneNumber: "",
      businessName: "",
      contactAddress: "",
      logo: "",
      website: "",
    });
    dispatch({ type: CREATE_PROFILE, payload: info });
    setLoading(false)
    navigate("/dashboard");

  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};

export const forgot = (formData: {email: string}) => async () => {
  try {
    await api.forgot(formData);
  } catch (error) {
    console.log(error);
  }
};

export const reset = (formData: {password: string, token: string}) => async () => {
  try {
    await api.reset(formData);
  } catch (error) {
    alert(error);
  }
};
