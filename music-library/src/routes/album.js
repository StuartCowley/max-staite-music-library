const express = require('express');
const albumController = require('../controllers/album');

const  albumRouter = express.Router();

albumRouter.get('/',albumController.readAlbums)

albumRouter.get('/:id', albumController.readAlbumById)

albumRouter.patch('/:id', albumController.updateAlbums)

module.exports = albumRouter