const express = require('express');
const router = express.Router();

//@route GET api/posts is endpiont.
//@desc Test route.
//@access public. so doesn't need token. will make that happen by auth middleware.
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;
