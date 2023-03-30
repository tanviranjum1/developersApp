const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
// bring in bcrypt.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// bring in express validator.
const { check, validationResult } = require("express-validator/check");

//have to bring in user model.

const User = require("../../models/User");

//@route GET api/users is endpiont.
//@desc Test route.
//@access public. so doesn't need token. will make that happen by auth middleware.
// router.get('/', (req, res) => res.send('User route'));
// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [
    // pass field, custom validation otherwise generic,

    check("name", "Name is required").not().isEmpty(),
    // check for email.
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // which takes in the request.

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // get validation errors as response. if any of the check fails then error.
      // make the error visible.
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure pull out few things.
    const { name, email, password } = req.body; // that's the data that is sent. to make it work initialize body parser.

    // add logic to register user.
    try {
      // see if the user exists
      // iwth mongoose. // takes in a field to search by // returns promise.
      let user = await User.findOne({ email });

      if (user) {
        // user exists. then error multiple users with same email.

        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //get users gravatar based on their email and put that.
      // just pass the email into method and returns url of avatar.
      const avatar = gravatar.url(email, {
        // pass in 3 options. s default size. rating to pg to avoid adult image.
        // default mm gives you default if user doesn't have gravatar.
        s: "200",
        r: "pg",
        d: "mm",
      });

      // creates a new instance. doesn't save anything.

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //before saving, encrypt password using decrypt.

      // return json web token.
      // to be logged in you have to have to have that token.
      // we get a promise. 10 recommended.
      // create a salt first to do hashing.
      const salt = await bcrypt.genSalt(10);

      // take password and hash it.

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken.
      // after save we get the id.
      //create our payload.
      const payload = {
        user: {
          id: user.id,
        },
      };

      // jwttoken present in default.json inside config.
      // we sign the token.  pass in the payload, secret and expiration is optional
      // and then inside callback either error or token. if not error send token to client.
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          // expires in 3600 for production i.e 1 hour.
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      //   res.send('User registered');
      // if sth wrong then server error.

      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
