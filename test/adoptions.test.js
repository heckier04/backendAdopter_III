import supertest from 'supertest';
import app from '../src/app.js';
import { setupTestDB, closeDB } from './config/test.config.js';
import { expect } from 'chai';
import jwt from 'jsonwebtoken'; // ✅ Agregado

const request = supertest(app);
setupTestDB();

describe('Adoptions API', function () {
  this.timeout(20000);
  let testUser;
  let userToken;
  let petToAdopt;

  before(async function () {
    // Registrar un usuario
    const userData = {
      first_name: 'Adoptante',
      last_name: 'Tester',
      email: `adoption.tester${Date.now()}@example.com`,
      password: 'password123'
    };

    const registerRes = await request.post('/api/sessions/register').send(userData);
    testUser = registerRes.body.payload || registerRes.body.user;

    // Login para obtener token
    const loginRes = await request
      .post('/api/sessions/login')
      .send({ email: userData.email, password: userData.password });

    const cookie = loginRes.headers['set-cookie']?.[0] || '';
    const match = cookie.match(/adoptmeToken=([^;]+)/);
    const authToken = match?.[1];

    expect(authToken).to.be.a('string').that.is.not.empty;

    // Verificar token y guardar ID
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    expect(decoded).to.have.property('id');
    testUser._id = decoded.id;
    userToken = authToken;

    // Crear mascota para adoptar
    const petData = {
      name: 'Pelusa',
      specie: 'Gato',
      birthDate: '2021-06-01'
    };

    const petRes = await request.post('/api/pets').send(petData);
    expect(petRes.body.payload).to.have.property('_id');
    petToAdopt = petRes.body.payload;
  });

  after(async function () {
    await closeDB();
  });

  describe('GET /api/adoptions', () => {
    it('debería obtener la lista de adopciones', async () => {
      const res = await request.get('/api/adoptions');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.be.an('array');
    });
  });

  describe('POST /api/adoptions', () => {
    it('debería permitir que un usuario adopte una mascota', async () => {
      const res = await request
        .post('/api/adoptions')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ pet: petToAdopt._id });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.have.property('owner', testUser._id);
      expect(res.body.payload).to.have.property('pet', petToAdopt._id);
    });

    it('debería fallar si el ID de la mascota es inválido', async () => {
      const res = await request
        .post('/api/adoptions')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ pet: 'id-invalido' });

      expect(res.status).to.be.oneOf([400, 404]);
      expect(res.body).to.have.property('status', 'error');
    });
  });
});
