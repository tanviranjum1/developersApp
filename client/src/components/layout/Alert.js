import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// now we have props.alert available to us.
// map through the alert.
// make sure not null. output if the array is not empty.
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// variable
// get the alert state. fetch into the component.
// mapping the redux state to a prop in this component. so we have accesss to it.
// in this case it's the array of alerts.
const mapStateToProps = (state) => ({
  //  to get state inside of an alert.
  alerts: state.alert,
});

// use connect everytime you call an action or get state.
export default connect(mapStateToProps)(Alert);
