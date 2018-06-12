import {
	IPagedResponse,
	IRequest,
	IResponse,
	IUser,
	IUserGetRequest,
	IUserVisit,
	IUserVisitGetRequest
} from '@nickmorton/yes-admin-common';
import { IRepository } from '../../lib';
import { IUserBusinessRules } from '../user/user.business-rules';

export class UserVisitService {
	constructor(
		private visitRepository: IRepository<IUserVisit, IUserVisitGetRequest>,
		private userRespository: IRepository<IUser, IUserGetRequest>,
		private userBusinessRules: IUserBusinessRules) { }

	public getById(request: IRequest<string>): Promise<IResponse<IUserVisit>> {
		return this.visitRepository.getById(request.data)
			.then((user) => ({ entity: user }));
	}

	public get(request: IUserVisitGetRequest): Promise<IPagedResponse<IUserVisit>> {
		return this.visitRepository.get(request)
			.then((users) => ({ entities: users }));
	}

	public async add(request: IRequest<IUserVisit>): Promise<IResponse<IUserVisit>> {
		const user = await this.userRespository.getById(request.data.userId);
		const addedVisit = await this.visitRepository.add(request.data);
		const visits = await this.visitRepository.get({ userId: request.data.userId, limit: Number.MAX_SAFE_INTEGER, skip: 0 });
		const updatedUser = this.userBusinessRules.updateLastVisited(user, ...visits);
		await this.userRespository.update(updatedUser);
		return { entity: addedVisit };
	}

	public update(request: IRequest<IUserVisit>): Promise<IResponse<IUserVisit>> {
		return this.visitRepository.update(request.data)
			.then((user) => ({ entity: user }));
	}
}
