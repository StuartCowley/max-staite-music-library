const db = require('../db/index');

const createAlbum = async (req, res) => {
    const { artistId } = req.params;
    const { name, year } = req.body;

    try {
        const { 
            rows: [ album ] } = await db.query(
        `INSERT INTO Albums (name, year, artistId) VALUES ($1, $2, $3) RETURNING *`, 
        [name, year, artistId]);

        res.status(201).json(album)
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the album.' });
      }
};

module.exports = { createAlbum };
