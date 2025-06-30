import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, errors } = format;

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'cyan',
    debug: 'white'
  }
};

winston.addColors(customLevels.colors);

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  levels: customLevels.levels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [new transports.File({ filename: 'errors.log', level: 'error' })]
      : [])
  ]
});

// Middleware para agregar logger a cada request (opcional)
export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

export default logger;