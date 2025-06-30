import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import { setupTestDB } from './config/test.config.js';

const request = supertest(app);
setupTestDB();

describe('Pets API', () => {
  describe('GET /api/pets', () => {
    it('debería obtener una lista de mascotas', async () => {
      const res = await request.get('/api/pets');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.be.an('array');
    });
  });

  describe('POST /api/pets', () => {
    it('debería crear una nueva mascota', async () => {
      const petData = {
        name: 'Firulais',
        species: 'Perro',
        birthDate: '2020-01-01'
      };

      const res = await request.post('/api/pets').send(petData);
      expect(res.status).to.equal(201); // o 200 si tu backend no usa 201
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.be.an('object');
      expect(res.body.payload).to.include({ name: petData.name, species: petData.species });
    });

    it('debería fallar si faltan campos requeridos', async () => {
      const res = await request.post('/api/pets').send({ name: 'Solo nombre' });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('status', 'error');
    });
  });

  describe('GET /api/pets/:id', () => {
    let testPet;

    beforeEach(async () => {
      const petData = {
        name: 'Luna',
        species: 'Gato',
        birthDate: '2021-05-01'
      };

      const res = await request.post('/api/pets').send(petData);
      testPet = res.body.payload;
    });

    it('debería obtener una mascota por ID', async () => {
      const res = await request.get(`/api/pets/${testPet._id}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.include({ _id: testPet._id, name: 'Luna', species: 'Gato' });
    });

    it('debería fallar con un ID inválido', async () => {
      const res = await request.get('/api/pets/invalid-id');
      expect(res.status).to.equal(400); // o 404, según tu backend
      expect(res.body).to.have.property('status', 'error');
    });
  });
});
