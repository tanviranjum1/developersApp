import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';

//to show alert for each error
import { setAlert } from './alert';
import setAuthToken from '../utils/SetAuthToken';

// load USER
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  // then make a request.
  try {
    const res = await axios.get('http://localhost:8000/api/auth');
    dispatch({
      type: 'USER_LOADED',
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: 'AUTH_ERROR',
    });
  }
};

// register user.
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post(
        'http://localhost:8000/api/users',
        body,
        config
      );

      // res.data includes the token.
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
      }

      // we don't do anythign with payload in register fail in action file where defined.
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// login user.
// not going to take as object since getting only two data.
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // use object while using stringify.
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(
      'http://localhost:8000/api/auth',
      body,
      config
    );

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
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }

    // we don't do anythign with payload in register fail in action file where defined.
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// lOgout : Just clear everything. clear profile and others.
export const Logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
