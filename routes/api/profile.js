const express = require('express');
const router = express.Router();

//@route GET api/profile is endpiont.
//@desc Test route.
//@access public. so doesn't need token. will make that happen by auth middleware.
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
