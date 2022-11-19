import React from 'react';
import { Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// take from component's that is passed in.
// and any other parameter that's passed in.
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  // rest contains custom props that is passed in.
  // check to see if authenticated or not inside render.
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !loading ? (
        <Navigate to='/login' replace={true} />
      ) : (
        <Component {...props} />
      )
    }
  />
);

// add that to proptype as well
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

// pull in all the state's that's in auth reducer.
const mapStateToProps = (state) => ({
  auth: state.auth,
});

// no actions.
export default connect(mapStateToProps)(PrivateRoute);
