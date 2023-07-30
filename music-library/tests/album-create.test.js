const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('create album', () => {
    let artist;
    beforeEach(async () => {
      const { rows } = await db.query(
        'INSERT INTO Artists (name, genre) VALUES($1, $2) RETURNING *',
        ['Post Malone', 'HipHop/Rap']
      );

      artist = rows[0];
    });

    describe('POST /artists/{id}/albums', () => {
      it('creates a new album in the database', async () => {
        const { status, body } = await request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
            name: 'Stoney',
            year: 2016
        });

       expect(status).to.equal(201);
       expect(body.name).to.equal('Stoney');
       expect(body.year).to.equal(2016);

       
       
      });
    });
});