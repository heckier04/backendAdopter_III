import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  const log = req.logger || logger;
  log.error(`${err.message} - ${req.method} ${req.url}`);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
}