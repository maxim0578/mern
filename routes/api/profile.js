const express = require('express');
const router = express.Router();

// @route Get api/profile/test
// @desc Tests profile route
// @access Public
router.get('/test', (req,res) => res.json({msg:'profile Works'}));

module.exports = router;