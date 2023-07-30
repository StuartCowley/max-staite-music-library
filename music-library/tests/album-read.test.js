const { expect } = require('chai')
const request = require('supertest')
const db = require('../src/db')
const app = require('../src/app')

describe('Read Albums', () => {
  let artists;
  let albums;
  
  beforeEach(async () => {
    const responses = await Promise.all([
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Tame Impala',
        'rock',
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Kylie Minogue',
        'pop',
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Tame Antelope',
        'jazz',
      ]),
    ]);

    artists = responses.map(({ rows }) => rows[0])

    const albumResponses = await Promise.all([
    db.query('INSERT INTO Albums (name, year, artistId) VALUES( $1, $2, $3) RETURNING *',
    ['First Album', 2000, artists[0].id]
    ),
    db.query('INSERT INTO Albums (name, year, artistId) VALUES( $1, $2, $3) RETURNING *',
        ['Second Album', 2001, artists[1].id]

    ),
    db.query('INSERT INTO Albums (name, year, artistId) VALUES( $1, $2, $3) RETURNING *',
        ['Third Album', 2002, artists[0].id]
    ),
  ]);

    albums = albumResponses.map(({ rows }) => rows[0]);
  });
  
  describe('GET /albums', () => {
    it('returns all album records in the database', async () => {
      const { status, body } = await request(app).get('/albums').send()

      expect(status).to.equal(200)
      expect(body.length).to.equal(3)

      body.forEach((albumRecord) => {
        const expected = albums.find((albums) => albums.id === albumRecord.id)

        expect(albumRecord).to.deep.equal(expected)
      });
    });
  });
  
  describe('GET /albums/{id}', () => {
    it('returns the album with the correct id', async () => {
      const { status, body } = await request(app)
        .get(`/albums/${albums[0].id}`)
        .send();

      expect(status).to.equal(200);
      expect(body).to.deep.equal(albums[0]);
    });

    it('returns a 404 if the album does not exist', async () => {
      const { status, body } = await request(app)
        .get('/albums/999999999')
        .send();

      expect(status).to.equal(404);
      expect(body.message).to.equal('Album 999999999 does not exist');
    });
  });
});
