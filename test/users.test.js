import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import { setupTestDB, closeDB } from './config/test.config.js';

const request = supertest(app);
setupTestDB();

describe('Users API', function () {
  this.timeout(20000);
  let adminCookie;
  let testUser;

  before(async function () {
    // Crear admin
    const adminData = {
      first_name: 'Admin',
      last_name: 'User',
      email: `admin${Date.now()}@example.com`,
      password: 'admin123',
      role: 'admin'
    };

    await request.post('/api/sessions/register').send(adminData);

    const loginRes = await request
      .post('/api/sessions/login')
      .send({ email: adminData.email, password: adminData.password });

    expect(loginRes.headers).to.have.property('set-cookie');
    adminCookie = loginRes.headers['set-cookie'];

    // Crear usuario normal
    const userData = {
      first_name: 'Test',
      last_name: 'User',
      email: `user${Date.now()}@example.com`,
      password: 'user123'
    };

    const userRes = await request.post('/api/sessions/register').send(userData);
    testUser = userRes.body.payload || userRes.body.user;
  });

  after(async function () {
    await closeDB();
  });

  describe('GET /api/users', () => {
    it('debería obtener una lista de usuarios (solo admin)', async () => {
      const res = await request
        .get('/api/users')
        .set('Cookie', adminCookie);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.be.an('array');
    });
  });

  describe('GET /api/users/:id', () => {
    it('debería obtener un usuario por ID', async () => {
      const res = await request
        .get(`/api/users/${testUser._id}`)
        .set('Cookie', adminCookie);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.have.property('_id', testUser._id);
      expect(res.body.payload).to.have.property('email', testUser.email);
    });

    it('debería retornar error si el ID es inválido', async () => {
      const res = await request
        .get('/api/users/invalid-id')
        .set('Cookie', adminCookie);

      expect(res.status).to.be.oneOf([400, 404]);
      expect(res.body).to.have.property('status', 'error');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('debería eliminar un usuario existente (solo admin)', async () => {
      const userToDelete = {
        first_name: 'Delete',
        last_name: 'Me',
        email: `deleteme${Date.now()}@example.com`,
        password: 'delete123'
      };

      const createRes = await request.post('/api/sessions/register').send(userToDelete);
      const createdUser = createRes.body.payload || createRes.body.user;

      const deleteRes = await request
        .delete(`/api/users/${createdUser._id}`)
        .set('Cookie', adminCookie);

      expect(deleteRes.status).to.equal(200);
      expect(deleteRes.body).to.have.property('status', 'success');
    });

    it('debería retornar error si el ID es inválido al eliminar', async () => {
      const res = await request
        .delete('/api/users/invalid-id')
        .set('Cookie', adminCookie);

      expect(res.status).to.be.oneOf([400, 404]);
      expect(res.body).to.have.property('status', 'error');
    });
  });
});
