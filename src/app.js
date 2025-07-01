import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import { swaggerSpec, swaggerUi } from '../swagger.js';
import { addLogger } from './utils/logger.js';

import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env', override: true });

const app = express();
const PORT = process.env.PORT || 3000;

console.log('MONGO_URL usado:', process.env.MONGO_URL);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(addLogger);

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Exportar app sin levantar el server si es para test
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      console.log('✅ Conectado a MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
      });
    })
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));
}

export default app;
