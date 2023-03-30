import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// take from component's that is passed in.
// and any props that's passed in.
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !loading ? (
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

// pull in all the state's that's in auth reducer.
const mapStateToProps = (state) => ({
  auth: state.auth,
});

// no actions.
export default connect(mapStateToProps)(PrivateRoute);
