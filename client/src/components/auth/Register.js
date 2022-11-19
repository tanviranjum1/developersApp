import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// bring in action.
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

//setAlert props from using connect.
const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;
  //e.target.name gets the value of the name attribute of the input field.
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      // alert type set to danger. calling setAlert in actions.
      setAlert('Passwords donot match', 'danger');
    } else {
      register({ name, email, password });

      // without redux. accesssing the backend.
      // const newUser = {
      //   name,
      //   email,
      //   password,
      // };
      // try {
      //   // send data so
      //   const config = {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   };
      //   const body = JSON.stringify(newUser);
      //   //sending the name,email and password and it should
      //   // add it to db and return a token to us.
      //   const res = await axios.post(
      //     'http://localhost:8000/api/users',
      //     body,
      //     config
      //   );
      //   // we shoudl get the token.
      //   console.log(res.data);
      // } catch (e) {}
    }
  };
  const navigate = useNavigate();

  if (isAuthenticated) {
    return navigate('/dashboard');
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  // ptfr shortcut.
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

// get auth state. all we need is authenticated so :
const mapStateToProps = (state) => ({
  // auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
});

// whenever use connect have to export.
// connect takes in two things:
// 1. state that you wanna map. here no ampstatetoprops.
// 2. object with any action that you want to use.
// 2. will allow us to access prop.setAlert.
// so here only action.
export default connect(mapStateToProps, { setAlert, register })(Register);
