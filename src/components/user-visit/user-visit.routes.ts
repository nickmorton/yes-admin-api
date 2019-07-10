import {
	IPagedResponse, IResponse, IUserVisit, IUserVisitsGetRequest, UserValidator, UserVisitValidator
} from '@nickmorton/yes-admin-common';
import * as e from 'express';
import { IApiConfig } from '../../api.config';
import { Lazy } from '../../lib';
import { UserBusinessRules } from '../user/user.business-rules';
import { UserRepository } from '../user/user.repository';
import { UserVisitRepository } from './user-visit.repository';
import { UserVisitService } from './user-visit.service';

export function register(app: e.Application, config: IApiConfig) {
	const service: Lazy<UserVisitService> = new Lazy(
		() => new UserVisitService(
			new UserVisitRepository(config, new UserVisitValidator()),
			new UserRepository(config, new UserValidator()),
			new UserBusinessRules()
		)
	);

	app
		.get('/api/users/:userId/visits', (req, res, next) => {
			const params: IUserVisitsGetRequest = { ...req.query, userId: req.params.userId };
			if (req.query.sort) {
				params.sort = JSON.parse(req.query.sort);
			}
			service.instance.get(params)
				.then((response: IPagedResponse<IUserVisit>) => res.json(response))
				.catch((err) => next(err));
		})
		.get('/api/users/:userId/visits/latest', (req, res, next) => {
			const params: IUserVisitsGetRequest = { limit: 1, skip: 0, sort: { date: -1 }, userId: req.params.userId };
			service.instance.get(params)
				.then((response: IPagedResponse<IUserVisit>) => {
					if (response.entities.length === 1) {
						res.json({ entity: response.entities[0] } as IResponse<IUserVisit>);
					} else {
						res.json({ entity: null } as IResponse<IUserVisit>);
					}
				})
				.catch((err) => next(err));
		})
		.post('/api/users/:userId/visits', (req, res, next) => {
			service.instance.add(req.params.userId, req.body)
				.then((response: IResponse<IUserVisit>) => res.json(response))
				.catch((err) => next(err));

		})
		.get('/api/visits/:visitId', (req, res, next) => {
			service.instance.getById(req.params.visitId)
				.then((response: IResponse<IUserVisit>) => res.json(response))
				.catch((err) => next(err));
		})
		.put('/api/visits/:visitId', (req, res, next) => {
			service.instance.update(req.body)
				.then((response: IResponse<IUserVisit>) => res.json(response))
				.catch((err) => next(err));
		});
}
