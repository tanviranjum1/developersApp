// fucntion that takes in piece of state.

import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

// action will be dispatched from action file.

// initially it's empty.
const initialState = [];

// action will have two things: type and payload which is data. sometimes no data.
// state is immutable so include other states that's alerady there.

// set_alert to add a new alert to the array. returns array with the alert and the new alert.
// remove a specific alert by it's id.
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
