import supertest from 'supertest';
import app from '../src/app.js';
import { setupTestDB } from './config/test.config.js';
import { expect } from 'chai';

const request = supertest(app);
setupTestDB();

const generateUser = () => ({
    first_name: 'Test',
    last_name: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
});

describe('Sessions API', function () {
    this.timeout(10000);

    describe('POST /api/sessions/register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
    const user = generateUser();

    const res = await request.post('/api/sessions/register').send(user);

        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('payload');
    });

    it('debería fallar si el email ya está registrado', async () => {
        const user = generateUser();
        await request.post('/api/sessions/register').send(user);

        const res = await request.post('/api/sessions/register').send(user);

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('error');
    });
    });

    describe('POST /api/sessions/login', () => {
        it('debería iniciar sesión exitosamente con credenciales válidas', async () => {
        const user = generateUser();
        await request.post('/api/sessions/register').send(user);

        const res = await request.post('/api/sessions/login').send({
            email: user.email,
            password: user.password
        });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
    
        expect(res.body).to.have.property('message');
    });

    it('debería fallar con credenciales inválidas', async () => {
        const user = generateUser();
        await request.post('/api/sessions/register').send(user);

        const res = await request.post('/api/sessions/login').send({
            email: user.email,
            password: 'wrongpassword'
        });

        expect(res.status).to.be.oneOf([400, 401]);
        expect(res.body).to.have.property('status', 'error');
        });

        it('debería fallar si el usuario no existe', async () => {
        const res = await request.post('/api/sessions/login').send({
            email: `noexiste${Date.now()}@example.com`,
            password: 'password123'
        });

        expect(res.status).to.be.oneOf([401, 404]);
        expect(res.body).to.have.property('status', 'error');
        });
    });
});
