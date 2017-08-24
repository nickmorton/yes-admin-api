import { Application } from 'express';
import { IApiConfig } from './api.config';
import * as users from './components/user/user.routes';

export function register(app: Application, config: IApiConfig) {
	app
		.get('/*', (req, res, next) => {
			res.contentType('application/json');
			next();
		})
		.post('/*', (req, res, next) => {
			res.contentType('application/json');
			next();
		})
		.put('/*', (req, res, next) => {
			res.contentType('application/json');
			next();
		})
		.delete('/*', (req, res, next) => {
			res.contentType('application/json');
			next();
		});

	users.register(app, config);
}
