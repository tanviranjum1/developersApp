import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';

// object that will have any reducers we create.
export default combineReducers({
  alert,
  auth,
});
