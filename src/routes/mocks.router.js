import { Router } from 'express';
import { faker } from '@faker-js/faker/locale/es';

const router = Router();


const usersMock = Array.from({ length: 10 }, () => ({
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['user', 'admin'])
}));


const petsMock = Array.from({ length: 10 }, () => ({
    _id: faker.database.mongodbObjectId(),
    name: faker.person.firstName(),
    specie: faker.helpers.arrayElement(['Perro', 'Gato']),
    breed: faker.animal.dog(),
    age: faker.number.int({ min: 1, max: 15 }),
    gender: faker.helpers.arrayElement(['Macho', 'Hembra']),
    size: faker.helpers.arrayElement(['Pequeño', 'Mediano', 'Grande']),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['Disponible', 'Adoptado']),
    image: faker.image.urlPicsumPhotos()
}));

/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     summary: Devuelve usuarios de prueba (mock)
 *     tags:
 *       - Mocks
 *     responses:
 *       200:
 *         description: Lista de usuarios mock
 */
router.get('/users', (req, res) => {
  res.status(200).json(usersMock);
});

/**
 * @swagger
 * /api/mocks/pets:
 *   get:
 *     summary: Devuelve mascotas de prueba (mock)
 *     tags:
 *       - Mocks
 *     responses:
 *       200:
 *         description: Lista de mascotas mock
 */
router.get('/pets', (req, res) => {
  res.status(200).json(petsMock);
});

export default router;