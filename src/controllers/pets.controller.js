import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllPets = async (req, res) => {
    const pets = await petsService.getAll();
    res.send({ status: "success", payload: pets });
};

const getPetById = async (req, res) => {
    const petId = req.params.pid;
    try {
        const pet = await petsService.getById(petId);
        if (!pet) {
            return res.status(404).send({ status: "error", error: "Pet not found" });
        }
        res.send({ status: "success", payload: pet });
    } catch (error) {
        res.status(400).send({ status: "error", error: "Invalid ID" });
    }
};

const createPet = async (req, res) => {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) {
        return res.status(400).send({ status: "error", error: "Incomplete values" });
    }

    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
};

const updatePet = async (req, res) => {
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    const result = await petsService.update(petId, petUpdateBody);
    res.send({ status: "success", message: "pet updated" });
};

const deletePet = async (req, res) => {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);
    res.send({ status: "success", message: "pet deleted" });
};

const createPetWithImage = async (req, res) => {
    const file = req.file;
    const { name, specie, birthDate } = req.body;

    if (!name || !specie || !birthDate) {
        return res.status(400).send({ status: "error", error: "Incomplete values" });
    }

    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image: `${__dirname}/../public/img/${file.filename}`,
    });

    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
};

export default {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
};
