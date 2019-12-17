import { EventEmitter } from 'events';

export interface ILogger {
	info?: (message: any) => void;
	warn?: (message: any) => void;
	error?: (message: any) => void;
	debug?: (message: any) => void;
}

export class LoggerEventBus extends EventEmitter {
	public addLogger(logger: ILogger) {
		if (logger.info) {
			this.on('info', logger.info);
		}

		if (logger.warn) {
			this.on('warn', logger.warn);
		}

		if (logger.error) {
			this.on('error', logger.error);
		}

		if (logger.debug) {
			this.on('debug', logger.debug);
		}
	}

	public info(message: any) {
		this.emit('info', message);
	}

	public warn(message: any) {
		this.emit('warn', message);
	}

	public error(message: any) {
		this.emit('error', message);
	}

	public debug(message: any) {
		this.emit('debug', message);
	}
}

const instance = new LoggerEventBus();
module.exports = instance;
