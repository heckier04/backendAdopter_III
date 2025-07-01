import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/es';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

// Importar modelos
import User from '../src/dao/models/User.js';
import Pet from '../src/dao/models/Pet.js';
import Adoption from '../src/dao/models/Adoption.js';

// Configuración de mongoose
mongoose.set('strictQuery', false);

// Conectar a MongoDB
async function connectDB() {
    try {
    mongoose.connect(process.env.MONGO_URL || 'mongo:27017/backend_final', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log('✅ Conectado a MongoDB');
    return true;
    } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    return false;
  }
}


async function cleanDatabase() {
  try {
    await Promise.all([
      User.deleteMany({}),
      Pet.deleteMany({}),
      Adoption.deleteMany({})
    ]);
    console.log('🧹 Base de datos limpiada');
    return true;
  } catch (error) {
    console.error('❌ Error limpiando la base de datos:', error);
    return false;
  }
}


async function createUsers() {
  try {
    const admins = [
      {
        first_name: 'Admin',
        last_name: 'Uno',
        email: 'admin1@adoptme.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin'
      },
      {
        first_name: 'Admin',
        last_name: 'Dos',
        email: 'admin2@adoptme.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin'
      }
    ];

    const users = [];
    for (let i = 1; i <= 18; i++) {
      users.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: `user${i}@adoptme.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'user'
      });
    }

    const allUsers = await User.insertMany([...admins, ...users]);
    console.log(`👤 Creados ${allUsers.length} usuarios (2 admin, 18 usuarios regulares)`);
    return allUsers;
  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
    return [];
  }
}


async function createPets() {
  try {
    const pets = [];
    const dogBreeds = [
      'Labrador Retriever', 'Pastor Alemán', 'Golden Retriever', 'Bulldog Francés',
      'Beagle', 'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dálmata',
      'Chihuahua', 'Bulldog Inglés', 'Pug', 'Husky Siberiano', 'Dóberman',
      'Gran Danés', 'Schnauzer', 'Pomerania', 'Shih Tzu', 'Border Collie'
    ];
    const catBreeds = [
      'Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Esfinge', 'Azul Ruso',
      'Británico de Pelo Corto', 'Ragdoll', 'Siberiano', 'Angora Turco',
      'Scottish Fold', 'Birmano', 'Abisinio', 'Somalí', 'Burmés',
      'Bombay', 'Oriental', 'Van Turco'
    ];

    
    for (let i = 0; i < 45; i++) {
      pets.push({
        name: faker.person.firstName(),
        specie: 'Perro',
        breed: faker.helpers.arrayElement(dogBreeds),
        age: faker.number.int({ min: 1, max: 15 }),
        gender: faker.helpers.arrayElement(['Macho', 'Hembra']),
        size: faker.helpers.arrayElement(['Pequeño', 'Mediano', 'Grande']),
        description: faker.lorem.paragraph(),
        status: 'Disponible',
        image: 'https://source.unsplash.com/random/300x300/?dog'
      });
    }

    
    for (let i = 0; i < 45; i++) {
      pets.push({
        name: faker.person.firstName(),
        specie: 'Gato',
        breed: faker.helpers.arrayElement(catBreeds),
        age: faker.number.int({ min: 1, max: 18 }),
        gender: faker.helpers.arrayElement(['Macho', 'Hembra']),
        size: faker.helpers.arrayElement(['Pequeño', 'Mediano']),
        description: faker.lorem.paragraph(),
        status: 'Disponible',
        image: 'https://source.unsplash.com/random/300x300/?cat'
      });
    }

    const allPets = await Pet.insertMany(pets);
    console.log(`🐾 Creadas ${allPets.length} mascotas (45 perros, 45 gatos)`);
    return allPets;
  } catch (error) {
    console.error('❌ Error creando mascotas:', error);
    return [];
  }
}

// Crear adopciones 
async function createAdoptions(users, pets) {
  try {
    const adoptions = [];
    const availablePets = [...pets];

    
    for (let i = 2; i < users.length && availablePets.length > 0; i++) {
      const randomPetIndex = Math.floor(Math.random() * availablePets.length);
      const pet = availablePets.splice(randomPetIndex, 1)[0];

      const adoption = new Adoption({
        owner: users[i]._id,
        pet: pet._id
      });

      // Actualizar estado de la mascota
      await Pet.findByIdAndUpdate(pet._id, { status: 'Adoptado' });

      adoptions.push(await adoption.save());
    }

    console.log(`🏠 Creadas ${adoptions.length} adopciones`);
    return adoptions;
  } catch (error) {
    console.error('❌ Error creando adopciones:', error);
    return [];
  }
}

// Función principal
async function seedDatabase() {
  try {
    const connected = await connectDB();
    if (!connected) process.exit(1);

    console.log('\n🚀 Iniciando proceso de semillado de la base de datos...');

    await cleanDatabase();
    const users = await createUsers();
    const pets = await createPets();
    await createAdoptions(users, pets);

    console.log('\n✅ ¡Base de datos poblada exitosamente!');
    console.log('\n🔑 Credenciales de administradores:');
    console.log('- admin1@adoptme.com / 123456');
    console.log('- admin2@adoptme.com / 123456');
    console.log('\n🔑 Credenciales de usuarios (todos con contraseña "password123"):');
    console.log('user1@adoptme.com a user18@adoptme.com');
  } catch (error) {
    console.error('❌ Error en el proceso de semillado:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}


seedDatabase();