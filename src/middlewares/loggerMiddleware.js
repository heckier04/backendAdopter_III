import logger from '../utils/logger.js';

export function loggerMiddleware(req, res, next) {
    logger.http(`${req.method} ${req.url}`);
    next();
}