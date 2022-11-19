import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../App.css';

// rscp for prop types.
//

// now we have props.alert available to us.
// map through the alert.
// make sure not null. output if the array is not empty.
const Alert = ({ alerts }) => {
  // returns some jsx
  return (
    <div>
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
          </div>
        ))}
    </div>
  );
};

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

export default connect(mapStateToProps)(Alert);
