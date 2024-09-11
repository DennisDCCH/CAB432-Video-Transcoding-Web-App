const express = require('express');
const router = express.Router();
const thumbnailController = require('../controllers/thumbnailController.js');

// Route to get thumbnail
router.get('/thumbnail', thumbnailController.getThumbnail)

module.exports = router;