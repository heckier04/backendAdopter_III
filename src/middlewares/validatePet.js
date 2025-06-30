export function validatePet(req, res, next) {
  const { name, species, breed, age, gender, size, description, status, image } = req.body;

  const validSpecies = ['Perro', 'Gato'];
  const validGenders = ['Macho', 'Hembra'];
  const validSizes = ['Pequeño', 'Mediano', 'Grande'];
  const validStatus = ['Disponible', 'Adoptado'];

  if (
    !name || typeof name !== 'string' ||
    !species || !validSpecies.includes(species) ||
    !breed || typeof breed !== 'string' ||
    typeof age !== 'number' || age < 0 ||
    !gender || !validGenders.includes(gender) ||
    !size || !validSizes.includes(size) ||
    !description || typeof description !== 'string' ||
    !status || !validStatus.includes(status) ||
    !image || typeof image !== 'string'
  ) {
    return res.status(400).json({ message: 'Datos inválidos o faltantes para la mascota' });
  }

  next();
}