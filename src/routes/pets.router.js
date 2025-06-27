import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';

const router = Router();

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtiene todas las mascotas
 *     tags:
 *       - Mascotas
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   species:
 *                     type: string
 *                   breed:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   gender:
 *                     type: string
 *                   size:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                   image:
 *                     type: string
 */
router.get('/', petsController.getAllPets);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crea una nueva mascota
 *     tags:
 *       - Mascotas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               size:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mascota creada
 */
router.post('/', petsController.createPet);

/**
 * @swagger
 * /api/pets/withimage:
 *   post:
 *     summary: Crea una nueva mascota con imagen
 *     tags:
 *       - Mascotas
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               size:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Mascota creada con imagen
 */
router.post('/withimage', uploader.single('image'), petsController.createPetWithImage);

/**
 * @swagger
 * /api/pets/{pid}:
 *   put:
 *     summary: Actualiza una mascota existente
 *     tags:
 *       - Mascotas
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID de la mascota a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               size:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada
 */
router.put('/:pid', petsController.updatePet);

/**
 * @swagger
 * /api/pets/{pid}:
 *   delete:
 *     summary: Elimina una mascota existente
 *     tags:
 *       - Mascotas
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID de la mascota a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Mascota eliminada
 */
router.delete('/:pid', petsController.deletePet);

export default router;