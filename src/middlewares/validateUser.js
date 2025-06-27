export function validateUser(req, res, next) {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
  // Puedes agregar más validaciones aquí (formato de email, longitud de password, etc.)
    next();
}