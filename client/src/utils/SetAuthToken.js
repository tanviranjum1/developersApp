import axios from 'axios';

//check if token present in local storage.
// if present then set the global header by doing axios.default.
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // delete it from global heaeders.
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
