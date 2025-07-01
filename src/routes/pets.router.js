import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';
import { validatePet } from '../middlewares/validatePet.js';

const router = Router();

router.get('/', petsController.getAllPets);
router.get('/:pid', petsController.getPetById); // ✅ Solo una vez
router.post('/', validatePet, petsController.createPet);
router.post('/withimage', uploader.single('image'), petsController.createPetWithImage);
router.put('/:pid', petsController.updatePet);
router.delete('/:pid', petsController.deletePet);

export default router;
