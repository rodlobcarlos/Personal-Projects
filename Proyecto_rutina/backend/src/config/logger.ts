import winston from 'winston';
import { config } from './env';

const logLevel = config.env === 'production' ? 'info' : 'debug';
const isTest = config.env === 'test';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: isTest
    ? [new winston.transports.Console({ silent: true, level: 'error' })]
    : [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaText = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} ${level}: ${message}${metaText}`;
            })
          )
        })
      ]
});

export const httpLogStream = {
  write(message: string) {
    logger.info(message.trim());
  }
};