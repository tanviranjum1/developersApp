import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Logout } from '../../actions/auth';

// destructure and pull out loading also to make sure user is done loading befoer we put the links in.
const Navbar = ({ auth: { isAuthenticated, loading }, Logout }) => {
  const authLinks = (
    <ul>
      <li>
        {/* not show in mobile device text. */}
        <a onClick={Logout} href='#!'>
          <i className='fas fa-sign-out-alt'></i>
          {''}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        {/* #! to make the link go nowhere. */}
        <Link to='#!'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {/* if done loading */}
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //  to get state inside of an alert.
  auth: state.auth,
});

export default connect(mapStateToProps, { Logout })(Navbar);
