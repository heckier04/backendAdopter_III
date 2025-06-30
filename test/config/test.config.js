import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config({ path: `${__dirname}/../../.env.test`, override: true });

const createTestConnection = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Conexión a MongoDB TEST OK');
  } catch (error) {
    console.error('❌ Error de conexión TEST:', error);
    process.exit(1);
  }
};

const clearDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      if (!key.startsWith('system.')) {
        await collections[key].deleteMany({});
      }
    }
    console.log('🧼 Base de datos de prueba limpiada');
  } catch (error) {
    console.error('❌ Error al limpiar base de datos:', error);
  }
};

const closeDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Conexión de prueba cerrada');
    }
  } catch (error) {
    console.error('❌ Error al cerrar conexión de prueba:', error);
  }
};

const setupTestDB = () => {
  before(async function () {
    try {
      await createTestConnection();
      await clearDB();
    } catch (error) {
      console.error('❌ Error en setupTestDB:', error);
      process.exit(1);
    }
  });
};

export { setupTestDB, createTestConnection, clearDB, closeDB };
