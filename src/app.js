import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { swaggerSpec, swaggerUi } from '../swagger.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateUser } from '../middlewares/validateUser.js';

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(`URL DE MONGO`)

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.post('/users', validateUser, usersController.createUser);
router.get('/users', authMiddleware, usersController.getAllUsers);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
