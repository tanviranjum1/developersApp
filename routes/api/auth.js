const express = require('express');
const router = express.Router();
// bring in the middleware
const auth = require('../../middleware/auth');

const bcrypt = require('bcryptjs');

// bring in user model.
const User = require('../../models/User');

const jwt = require('jsonwebtoken');
const config = require('config');
// bring in express validator.
const { check, validationResult } = require('express-validator');

//@route GET api/auth is endpiont.
//@desc Test route.
//@access public. so doesn't need token. will make that happen by auth middleware.
// add middleware as second parameter. will make this rotue protected.
// we want the route to return user data.
router.get('/', auth, async (req, res) => {
  try {
    // get the id.
    // we can access it from anywhere in the proteccted route.
    // we don't want the password tho.
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
  // res.send('Auth route');
});

//@route   POST api/auth is endpiont.
//@desc    To Authenticate user and get token.
//@access   public.
// purpose of route is to get token and so you can make request to private route.
router.post(
  '/',
  [
    // pass field, add custom validation otherwise generic,
    // check for email.
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required.').exists(),
  ],
  async (req, res) => {
    // which takes in the request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // get validation errors as response. if any of the check fails then error.
      // make the error visible.
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body); // that's the data that is sent. to make it work initialize body parser.

    // will need just email and body.
    const { email, password } = req.body;

    // add logic to register user.
    try {
      // see if the user exists
      // iwth mongoose. // takes in a field to search by // returns promise.
      // make request to get teh user.
      let user = await User.findOne({ email });
      if (!user) {
        // if not user send back error.
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials.' }] }); // bad request. to get same type of error as input error. so array with object.
      }

      // we have to make sure password matches.
      // has method called COMPAR with compares plaintext password and encrypted password.
      // tells match or not.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        // invalid credentials.
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials.' }] }); // bad request. to get same type of error as input error.
      }

      // here we are not doing anything with avatar.

      // we will keep payload. sending the token and signing in the token.

      // Return jsonwebtoken.
      // after save we get the id.
      //create our payload.
      const payload = {
        user: {
          id: user.id, // mongoose id.
        },
      };

      // jwttoken present in default.json inside config.
      // we sign the token.  pass in the payload, secret and expiration is optional
      // and then inside callback either error or token. if not error send token to client.

      jwt.sign(
        payload,
        config.get('jwttoken'),
        {
          // expires in 3600 for production i.e 1 hour.
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          //else.
          res.json({ token });
        }
      );

      //   res.send('User registered');
    } catch (err) {
      // if sth wrong then server error.
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
