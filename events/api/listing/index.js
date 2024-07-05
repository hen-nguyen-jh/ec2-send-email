const express = require('express');
const router = express.Router();

const handleApproveListing = require('./handleApproveListing');

router.put('/approve', handleApproveListing);

module.exports = router;
