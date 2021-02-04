import {
    IPagedResponse,
    IRequest,
    IResponse,
    IUser,
    IUserGetRequest,
    IUserVisit,
    IUserVisitsGetRequest
} from '@nickmorton/yes-admin-common';
import { IRepository } from '../../lib';
import { IUserBusinessRules } from '../user/user.business-rules';

export class UserVisitService {
    constructor(
        private visitRepository: IRepository<IUserVisit, IUserVisitsGetRequest>,
        private userRespository: IRepository<IUser, IUserGetRequest>,
        private userBusinessRules: IUserBusinessRules) { }

    public async getById(visitId: string): Promise<IResponse<IUserVisit>> {
        const entity = await this.visitRepository.getById(visitId);
        return { entity };
    }

    public async get(request: IUserVisitsGetRequest): Promise<IPagedResponse<IUserVisit>> {
        const entities = await this.visitRepository.get(request);
        return { entities };
    }

    public async add(userId: string, request: IRequest<IUserVisit>): Promise<IResponse<IUserVisit>> {
        const user = await this.userRespository.getById(userId);
        const addedVisit = await this.visitRepository.add({ _userId: userId, ...request.data });
        const visits = await this.visitRepository.get({ userId, limit: Number.MAX_SAFE_INTEGER, skip: 0 });
        const updatedUser = this.userBusinessRules.updateLastVisited(user, ...visits);
        await this.userRespository.update(updatedUser);
        return { entity: addedVisit };
    }

    public async update(request: IRequest<IUserVisit>): Promise<IResponse<IUserVisit>> {
        const entity = await this.visitRepository.update(request.data);
        return { entity };
    }
}
