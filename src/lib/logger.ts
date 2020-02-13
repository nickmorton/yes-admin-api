import { createLogger, format, Logger, transports } from 'winston';

function loggerFactory() {
	const winstonLogger = createLogger({
		level: 'info',
		format: format.json(),
		defaultMeta: { service: 'yesy-admin-api' },
		transports: [
			new transports.File({ filename: 'logs/error.log', level: 'error' }),
			new transports.File({ filename: 'logs/combined.log' }),
		],
	});

	// If we're not in production then log to the `console` with the format:
	// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
	if (process.env.NODE_ENV !== 'production') {
		winstonLogger.add(new transports.Console({
			format: format.simple(),
		}));
	}

	return winstonLogger;
}

export const logger: Pick<Logger, 'debug' | 'error' | 'info' | 'warn'> = loggerFactory();
