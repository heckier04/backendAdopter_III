export function validatePet(req, res, next) {
  const { name, specie, birthDate } = req.body;

  const validSpecie = ['Perro', 'Gato'];

  if (
    !name || typeof name !== 'string' ||
    !specie || !validSpecie.includes(specie) ||
    !birthDate || isNaN(Date.parse(birthDate))
  ) {
    return res.status(400).json({ message: 'Datos inválidos o faltantes para la mascota' });
  }

  next();
}
