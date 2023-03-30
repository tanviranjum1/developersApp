import uuid from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

// dispatch one or more action types from this function.
//able to add dispatch because of thunk middleware
// alert will have an id, msg and alert type.
export const setAlert =
  (msg, alertType, timeout = 5000) =>
  (dispatch) => {
    const id = uuid.v4();
    // call setalert that's in reducer

    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });

    // after certain period of time.
    // dispatch an object with remove alert.
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };
