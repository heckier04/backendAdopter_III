import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
const authHeader = req.headers.authorization;
    if (!authHeader) {
return res.status(401).json({ message: 'Token no proporcionado' });
    }

const token = authHeader.split(' ')[1];
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.user = decoded;
    next();
    } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
    }
}