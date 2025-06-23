const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;


const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} : ${level}: ${stack || message}`;
});


const excludeErrors = format((info) => {
  return info?.level === 'error' ? false : info;
});

const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'info.log',
      format: excludeErrors()
    }),

    new transports.File({
      filename: 'error.log',
      level: 'error'
    })
  ],
});

module.exports = logger;
