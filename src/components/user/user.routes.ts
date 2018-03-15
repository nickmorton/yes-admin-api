import { IPagedResponse, IResponse, IUser, IUserGetRequest, UserValidator  } from '@nickmorton/yes-admin-common';
import * as e from 'express';
import { IApiConfig } from '../../api.config';
import { Lazy } from '../../lib';
import { UserBusinessRules } from './user.business-rules';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

export function register(app: e.Application, config: IApiConfig) {
	const baseUrl = '/api/users';
	const service: Lazy<UserService> = new Lazy(
		() => new UserService(new UserRepository(config, new UserValidator()), new UserBusinessRules())
	);
	app
		.get(`${baseUrl}/:id`, (req: e.Request, res: e.Response) => {
			service.instance.getById({ data: req.params.id }).then((response: IResponse<IUser>) => res.json(response));
		})
		.get(baseUrl, (req: e.Request, res: e.Response) => {
			const params: IUserGetRequest = {
				...req.query,
				sort: JSON.parse(req.query.sort),
			};
			service.instance.get(params).then((response: IPagedResponse<IUser>) => res.json(response));
		})
		.post(`${baseUrl}`, (req: e.Request, res: e.Response) => {
			service.instance.add(req.body).then((response: IResponse<IUser>) => res.json(response));
		})
		.put(`${baseUrl}`, (req: e.Request, res: e.Response) => {
			service.instance.update(req.body).then((response: IResponse<IUser>) => res.json(response));
		});
}
