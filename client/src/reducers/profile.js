import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from "../actions/types";

// have actions to get the profile.
// create , update clear it from state etc.
// profile will hold out profile data when we log in. and if another user's profile page it will put in there as well.
// profiles for profile listing page.
// fetch git repos.
const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  // task 1 get the profile. if we get profile, return current state. we are adding response to the profile state.
  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    default:
      return state;
  }
}
