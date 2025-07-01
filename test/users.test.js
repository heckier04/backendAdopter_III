import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import { setupTestDB } from './config/test.config.js';

const request = supertest(app);
setupTestDB();

describe('Users API', function () {
  this.timeout(20000);
  let adminCookie;
  let testUserId;
  let userEmail;

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
    testUserId = userRes.body.payload;  
    userEmail = userData.email;         
  });

  describe('GET /api/users/:id', () => {
    it('debería obtener un usuario por ID', async () => {
      const res = await request
        .get(`/api/users/${testUserId}`)
        .set('Cookie', adminCookie);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.have.property('_id', testUserId);
      expect(res.body.payload).to.have.property('email', userEmail);
    });
  });
});
