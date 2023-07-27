const express = require('express');
const artistController = require('../controllers/artist');
const { createAlbum } = require('../controllers/album');

const  artistRouter = express.Router();

artistRouter.post('/', artistController.createArtist);

artistRouter.get('/', artistController.readArtist);

artistRouter.get('/:id', artistController.readArtistById)

artistRouter.patch('/:id', artistController.updateArtist)

artistRouter.delete('/:id', artistController.deleteArtist)

artistRouter.post('/:artistId/albums', createAlbum)

module.exports = artistRouter;