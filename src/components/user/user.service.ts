import { IPagedResponse, IRequest, IResponse, IUser, IUserGetRequest } from '@nickmorton/yes-admin-common';
import { IRepository } from '../../lib';
import { IUserBusinessRules } from './user.business-rules';

export class UserService {
	constructor(private repository: IRepository<IUser, IUserGetRequest>, private businessRules: IUserBusinessRules) {
	}

	public getById = (request: IRequest<string>): Promise<IResponse<IUser>> => {
		return this.repository.getById(request.data)
			.then((user) => ({ entity: user }));
	}

	public get = (request: IUserGetRequest): Promise<IPagedResponse<IUser>> => {
		return this.repository.get(request)
			.then((users) => ({ entities: users }));
	}

	public add = (request: IRequest<IUser>): Promise<IResponse<IUser>> => {
		this.businessRules.updateLastVisited(request.data);
		return this.repository.add(request.data)
			.then((user) => ({ entity: user }));
	}

	public update = (request: IRequest<IUser>): Promise<IResponse<IUser>> => {
		this.businessRules.updateLastVisited(request.data);
		return this.repository.update(request.data)
			.then((user) => ({ entity: user }));
	}
}
