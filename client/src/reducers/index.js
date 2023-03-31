import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import post from "./post";

// object that will have any reducers we create.
export default combineReducers({
  alert,
  auth,
  profile,
  post,
});
