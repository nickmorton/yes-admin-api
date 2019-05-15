import { Application } from 'express';
import { IApiConfig } from './api.config';
import * as userVisits from './components/user-visit/user-visit.routes';
import * as users from './components/user/user.routes';

export function register(app: Application, config: IApiConfig) {
	app
		.get('/health', (_req, res) => res.sendStatus(204))
		.get('/*', (_req, res, next) => {
			res.contentType('application/json');
			next();
		})
		.post('/*', (_req, res, next) => {
			res.contentType('application/json');
			next();
		})
		.put('/*', (_req, res, next) => {
			res.contentType('application/json');
			next();
		})
		.delete('/*', (_req, res, next) => {
			res.contentType('application/json');
			next();
		});

	users.register(app, config);
	userVisits.register(app, config);
}
