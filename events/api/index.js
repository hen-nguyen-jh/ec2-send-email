const express = require('express');
const router = express.Router();

const listingRouter = require('./listing');

router.use('/listings', listingRouter);

module.exports = router;
