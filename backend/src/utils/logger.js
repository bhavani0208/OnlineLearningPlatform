const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    // Console output
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
    // Error log file
    new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    // Combined log file
    new transports.File({
      filename: path.join('logs', 'combined.log'),
    }),
  ],
});

module.exports = logger;
