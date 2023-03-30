import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";

// object that will have any reducers we create.
export default combineReducers({
  alert,
  auth,
  profile,
});
