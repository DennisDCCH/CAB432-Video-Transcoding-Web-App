const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController.js');

// Route to upload videos
router.post('/upload', videoController.uploadVideo)

// Route to get specific author videos
router.get('/myVideos', videoController.authorVideo)

router.get('/video', videoController.getVideo)

// Route to delete specific video
router.delete('/delete', videoController.deleteVideo)

// Route to reformat video
router.post('/reformat', videoController.reformatVideo)

module.exports = router;