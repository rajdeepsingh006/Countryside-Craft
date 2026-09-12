const express = require('express');
const router = express.Router();
const { getGallery } = require('../controllers/gallery.controller');

router.get('/', getGallery);

module.exports = router;
