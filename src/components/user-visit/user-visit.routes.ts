import {
	IPagedResponse, IResponse, IUserVisit, IUserVisitGetRequest, UserValidator, UserVisitValidator
} from '@nickmorton/yes-admin-common';
import * as e from 'express';
import { IApiConfig } from '../../api.config';
import { Lazy } from '../../lib';
import { UserBusinessRules } from '../user/user.business-rules';
import { UserRepository } from '../user/user.repository';
import { UserVisitRepository } from './user-visit.repository';
import { UserVisitService } from './user-visit.service';

export function register(app: e.Application, config: IApiConfig) {
	const baseUrl = '/api/users/:userId/visits';
	const service: Lazy<UserVisitService> = new Lazy(
		() => new UserVisitService(
			new UserVisitRepository(config, new UserVisitValidator()),
			new UserRepository(config, new UserValidator()),
			new UserBusinessRules()
		)
	);

	app
		.get(`${baseUrl}/:id`, (req: e.Request, res: e.Response) => {
			service.instance.getById({ data: req.params.id }).then((response: IResponse<IUserVisit>) => res.json(response));
		})
		.get(baseUrl, (req: e.Request, res: e.Response) => {
			const params: IUserVisitGetRequest = {
				...req.query,
				sort: JSON.parse(req.query.sort),
			};
			service.instance.get(params).then((response: IPagedResponse<IUserVisit>) => res.json(response));
		})
		.post(`${baseUrl}`, (req: e.Request, res: e.Response) => {
			service.instance.add(req.body).then((response: IResponse<IUserVisit>) => res.json(response));
		})
		.put(`${baseUrl}`, (req: e.Request, res: e.Response) => {
			service.instance.update(req.body).then((response: IResponse<IUserVisit>) => res.json(response));
		});
}
