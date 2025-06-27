import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';

chai.use(chaiHttp);
const expect = chai.expect;

let userId;
let petId;

describe('API de Adopciones', () => {
before(async () => {
    
    const userRes = await chai.request(app).post('/api/users').send({
        first_name: 'Adoptante',
        last_name: 'Test',
        email: `adoptante${Date.now()}@mail.com`,
        password: 'password123'
    });
    userId = userRes.body._id;


    const petRes = await chai.request(app).post('/api/pets').send({
        name: 'MascotaTest',
        species: 'Perro',
        breed: 'Mestizo',
        age: 2,
        gender: 'Macho',
        size: 'Mediano',
        description: 'Mascota de prueba',
        status: 'Disponible',
        image: 'https://source.unsplash.com/random/300x300/?dog'
    });
    petId = petRes.body._id;
});

it('GET /api/adoptions debe devolver todas las adopciones', async () => {
    const res = await chai.request(app).get('/api/adoptions');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
});

it('POST /api/adoptions debe crear una adopción', async () => {
    const adoption = { owner: userId, pet: petId };
    const res = await chai.request(app).post('/api/adoptions').send(adoption);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        expect(res.body.owner).to.equal(userId);
        expect(res.body.pet).to.equal(petId);
    });
});