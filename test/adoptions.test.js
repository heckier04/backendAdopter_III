import supertest from 'supertest';
import app from '../src/app.js';
import { setupTestDB } from './config/test.config.js';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';

const request = supertest(app);
setupTestDB();

describe('Adoptions API', function () {
  this.timeout(20000);
  let testUser;
  let userToken;
  let petToAdopt;

  before(async function () {
  
    const userData = {
      first_name: 'Adoptante',
      last_name: 'Tester',
      email: `adoption.tester${Date.now()}@example.com`,
      password: 'password123'
    };

    const registerRes = await request.post('/api/sessions/register').send(userData);
    testUser = registerRes.body.payload || registerRes.body.user;

    
    const userId = typeof testUser === 'string' ? testUser : (testUser._id || testUser.id);

    // Login para obtener token
    const loginRes = await request
      .post('/api/sessions/login')
      .send({ email: userData.email, password: userData.password });

    
    const cookies = loginRes.headers['set-cookie'];
    let authToken;
    if (cookies && cookies.length) {
      const cookieString = cookies.find(c => c.startsWith('coderCookie='));
      authToken = cookieString?.split(';')[0].split('=')[1];
    }

    expect(authToken).to.be.a('string').that.is.not.empty;

    // Verificar token y guardar ID
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'tokenSecretJWT');
    const userIdFromToken = decoded.id || decoded._id;

    
    expect(userIdFromToken).to.equal(userId);

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

    // Guardar id de mascota
    petToAdopt._id = petToAdopt._id.toString();
  });

});
