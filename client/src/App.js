import React, { Fragment, useEffect } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { Route, Routes } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/SetAuthToken';
import { loadUser } from './actions/auth';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './routing/PrivateRoute';

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
      <Fragment>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Landing />} />
          {/* Except for landing page, every page within the theme has a class of container to put everything in the mmiddle. */}
        </Routes>
        <section className='container'>
          <Alert />
          <Routes>
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/login' element={<Login />} />
            <PrivateRoute exact path='/dashboard' element={<Dashboard />} />
          </Routes>
        </section>
      </Fragment>
    </Provider>
  );
};

export default App;
