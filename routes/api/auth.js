const express = require('express');
const router = express.Router();

//@route GET api/auth is endpiont.
//@desc Test route.
//@access public. so doesn't need token. will make that happen by auth middleware.
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;
