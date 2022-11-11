const express = require('express');
const router = express.Router();
// bring the request.
const request = require('request');
const config = require('config');

const auth = require('../../middleware/auth');

//for post requests
const { check, validationResult } = require('express-validator');

// bring in the model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route GET api/profile/me is endpiont. get our profile only. based on user id that is the token.
//@desc Get current user's profile.
//@access Private. so doesn't need token. will make that happen by auth middleware.
/// add auth to make the route protected.
router.get('/me', auth, async (req, res) => {
  try {
    // user is the profile model user field which is going to be the object id of the user that comes in with the token.
    // populate with name and avatar.
    // so use method called populate.
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for the user' });
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route POST api/profile is endpiont.
//@desc Create or update user profile.
//@access Private.
// need to use auth middleware and validation middleware.
// we are checking the only two required fields which are status and skills.
// route for adding profile and updating.
router.post(
  '/',
  [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ],
  async (req, res) => {
    // validationresult which takes in request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // make sure bio was addded before submitted to db.

    // Build profile object to insert into db. Check if stuffs comming in or not before setting it.
    const profileFields = {};
    // get user.
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // we need to turn skills into array.
    if (skills) {
      // convert comma separated list to array.
      // to ignore space after comma.
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    console.log(profileFields.skills);

    // Build social object.
    // initialize social object first.
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // res.send('Hello');

    // now ready to update and insert our data.
    try {
      // remember user field is the object id match that to req.user.id which comes from the token.
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // found profile now update. second param to set the profileFields.
        // last param new object with new set to true.
        //   console.log(profile);
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        // await profile.save();
        // // and then send back the profile.
        return res.json(profile);
      }

      //if profile not found then  Create.
      profile = new Profile(profileFields);

      // save it. we want o use save on the instance of the model.
      //   await profile.save();

      profile.save(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });

      //send back.
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route GET api/profile is endpiont.
//@desc Get all profiles.
//@access Public.
router.get('/', async (req, res) => {
  try {
    // add name and avatar which are part of the user model.
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route GET api/profile/user/:user_id is endpiont. : specifies placeholder.
//@desc Get profile by user id.
//@access Public.
router.get('/user/:user_id', async (req, res) => {
  try {
    //id will come from the url.
    // add name and avatar which are part of the user model.
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    // check to make sure profile
    if (!profile) return res.status(400).json({ msg: 'Profile not found.' });
    res.json(profile);
  } catch (err) {
    //   catch runs if not valid object id.
    console.error(err.message);
    // objectid is certain kind of error.
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found.' });
    }
    res.status(500).send('Server error');
  }
});

//@route DELETE api/profile/
//@desc DELETE profile, user and posts.
//@access PRIVATE.
// this is private so we have to add auth middleware.
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove user's posts.

    // Remove Profile.
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user.
    // we have field called _id and we have to use that instead of 'user'
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route PUT api/profile/experience
//@desc add profile experience.
//@access PRIVATE.
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // need some validation.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    // will create an object with the data that user submits.
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    // deal with mongo db.
    try {
      // match with user id which we get from token.
      const profile = await Profile.findOne({ user: req.user.id });
      // pushes in the begining rather than the end.
      console.log(profile);

      profile.experience.unshift(newExp);
      await profile.save();

      // for response.
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route DELETE api/profile/experience/:exp_id
//@desc delete experience from profile.
//@access PRIVATE.
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // get profile by user id.
    const profile = await Profile.findOne({ user: req.user.id });

    // get remove index.
    // get id from query parameters.
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    // take sth out. splicing it out and then saving.
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route PUT api/profile/education
//@desc add profile education.
//@access PRIVATE.
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // need some validation.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    // will create an object with the data that user submits.
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    // deal with mongo db.
    try {
      // match with user id which we get from token.
      const profile = await Profile.findOne({ user: req.user.id });
      // pushes in the begining rather than the end.
      console.log(profile);

      profile.education.unshift(newEdu);
      await profile.save();

      // for response.
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route DELETE api/profile/education/:exp_id
//@desc delete education from profile.
//@access PRIVATE.
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    // get profile by user id.
    const profile = await Profile.findOne({ user: req.user.id });

    // get remove index.
    // get id from query parameters.
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    // take sth out. splicing it out and then saving.
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route GET api/profile/github/:username
//@desc get user repo from Github.
//@access Public.
router.get('/github/:username', (req, res) => {
  try {
    // construct an options object.
    // that has uri.
    // add in few parameters.
    // per page add 5.
    // sort by created time. add client id and client secret.
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (err, response, body) => {
      if (err) console.error(err);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }
      // if found send the obdy.
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
