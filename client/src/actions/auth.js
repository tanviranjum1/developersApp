import axios from "axios";
//to show alert for each error

import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  // then make a request.
  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post("/api/users", body, config);

      // res.data includes the token.
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      // we don't do anythign with payload in register fail in action file where defined.

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login User. // not going to take as object since getting only two data.
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // use object while using stringify.
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    // res.data includes the token.

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    // dispath the load user action as wel..

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    // we don't do anythign with payload in register fail in action file where defined.
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile. // lOgout : Just clear everything. clear profile and others.
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
