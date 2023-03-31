import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Routes from "./components/routing/Routes";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// fragment will not show up in dom.

const App = () => {
  //runs at the start only when loaded/mounted. works like componentdidMount.
  // when page refreshed.
  useEffect(() => {
    // dispatch load user actiond directly.

    store.dispatch(loadUser());
  }, []);

  return (
    // to use provider wrap everything inside provider so that all component
    // can access our state.
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          {/* Except for landing page, every page within the theme has a class of container to put everything in the mmiddle. */}
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
