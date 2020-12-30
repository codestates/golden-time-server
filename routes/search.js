const express = require('express');
const searchController = require('../controllers');

const router = express.Router();

router.post('/', searchController.search);

module.exports = router;
