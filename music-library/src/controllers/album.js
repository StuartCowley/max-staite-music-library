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

const readAlbums = async (req, res) => {
    
    try {
        const { rows } = await db.query('SELECT * FROM Albums')
        res.status(200).json(rows)
      } catch (err) {
        res.status(500).json(err.message)
      } 
};

const readAlbumById = async (req, res) => {
    try {
      const { id } = req.params 
      const  { rows: [ album ] } = await db.query('SELECT * FROM Albums WHERE id = $1', [ id ])
  
      if (!album) {
          return res.status(404).json({ message: `Album ${id} does not exist`})
      }
  
      res.status(200).json(album)
    } catch(err) {
      res.status(500).json(err.message)
    }
  };

  const updateAlbums = async (req, res) => {
    const { id } = req.params
    const { name, year } = req.body
    
    let query, params
    
    if (name && year) {
        query = `UPDATE Albums SET name = $1, year = $2 WHERE id = $3 RETURNING *`
        params = [name, year, id]
    } else if (name) {
        query = `UPDATE Albums SET name = $1 WHERE id = $2 RETURNING *`
        params = [name, id]
    } else if (year) {
        query = `UPDATE Albums SET year = $1 WHERE id = $2 RETURNING *`
        params = [year, id]
    }
  
    try {
  
      const { rows: [ album ] } = await db.query(query, params)
  
      if (!album) {
        return res.status(404).json({ message: `Album ${id} does not exist` })
      }
  
      res.status(200).json(album)
    } catch (err) {
      console.log(err)
      res.status(500).json(err.message)
    }
  }

  const deleteAlbums = async (req, res) => {
    const { id } = req.params
    try {
        const { rows: [ album ] } = await db.query('DELETE FROM Albums WHERE id = $1 RETURNING *', [id]);

        if (!album) {
          return res.status(404).json({ message: `album ${id} does not exist` })
        }

      return res.status(200).json(album)
    } catch(err) {
      return res.status(500).json(err.message)
    }
}

module.exports = { createAlbum, readAlbums, readAlbumById, updateAlbums, deleteAlbums};
