// // // // import * as winston from 'winston';
// // import { transports } from 'winston';
// // import * as Transport from 'winston-transport';

// // // // require('winston-loggly-bulk');

// // // // function winstonLoggerFactory(loggingConfig) {
// // function winstonLoggerFactory(level: 'info' | 'warn' | 'error' | 'debug') {
// // 	const transports: Transport = [];
// // 	// // if (loggingConfig.to.includes('LOGGLY')) {
// // 	// // 	transports.push(
// // 	// // 		new winston.transports.Loggly({
// // 	// // 			json: true,
// // 	// // 			level: loggingConfig.level,
// // 	// // 			subdomain: loggingConfig.loggly.subdomain,
// // 	// // 			tags: loggingConfig.loggly.tags,
// // 	// // 			token: loggingConfig.loggly.token
// // 	// // 		})
// // 	// // 	);
// // 	// // }

// // 	// // if (loggingConfig.to.includes('CONSOLE')) {
// // 	transports.push(
// // 		new transports.Console({
// // 			level: level.toString()
// // 		})
// // 	);
// // 	// // }

// // 	const config = Object.assign(loggingConfig.loggly, { transports });
// // 	const logger = new winston.Logger(config);

// // 	return {
// // 		info: (message: any) => {
// // 			logger.info(message);
// // 		},

// // 		warn: (message: any) => {
// // 			logger.warn(message);
// // 		},

// // 		error: (message: any) => {
// // 			logger.error(message);
// // 		},

// // 		debug: (message: any) => {
// // 			logger.debug(message);
// // 		}
// // 	};
// // };

// // module.exports = winstonLoggerFactory;
