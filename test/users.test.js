import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('API de Usuarios', () => {
it('GET /api/users debe devolver todos los usuarios', async () => {
    const res = await chai.request(app).get('/api/users');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
});

it('POST /api/users debe crear un usuario', async () => {
    const user = {
        first_name: 'Test',
        last_name: 'User',
        email: `testuser${Date.now()}@mail.com`,
        password: 'password123'
    };
    const res = await chai.request(app).post('/api/users').send(user);
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('_id');
    expect(res.body.email).to.equal(user.email);
});

it('GET /api/users/:id debe devolver un usuario por id', async () => {
    const user = {
        first_name: 'Test2',
        last_name: 'User2',
        email: `testuser2${Date.now()}@mail.com`,
        password: 'password123'
    };
    const createRes = await chai.request(app).post('/api/users').send(user);
    const userId = createRes.body._id;

    const res = await chai.request(app).get(`/api/users/${userId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id', userId);
    });
});