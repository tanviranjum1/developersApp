import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from '../actions/types';

// when success in login. isAuthenticated will be set to true.
// when we get the data or get response after requesting, the loading will be set to false to show that it's been loaded.
// when we get the user data inc name, email it will be put in user.
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;
  // put the token returned inside localstorage.

  // register sucess get user logged in right away.
  // get whatever currently in the state and payload.
  switch (type) {
    // remember paylaod includes the user. that means name, email and avatar and others.everything but the password.
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    // clears the auth state and clears the token from localStorage.
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      // if failed login remove the token.
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
