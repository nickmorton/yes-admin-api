import { IPagedResponse, IRequest, IResponse, IUser, IUserGetRequest } from '@nickmorton/yes-admin-common';
import { IRepository } from '../../lib';

export class UserService {
    constructor(private repository: IRepository<IUser, IUserGetRequest>) {
    }

    public get = (request: IUserGetRequest): Promise<IPagedResponse<IUser>> => {
        return this.repository.get(request)
            .then((users) => ({ entities: users }));
    }

    public add = (request: IRequest<IUser>): Promise<IResponse<IUser>> => {
        return this.repository.add(request.data)
            .then((user) => ({ entity: user }));
    }

    public getById = (userId: string): Promise<IResponse<IUser>> => {
        return this.repository.getById(userId)
            .then((user) => ({ entity: user }));
    }

    public update = (request: IRequest<IUser>): Promise<IResponse<IUser>> => {
        return this.repository.update(request.data)
            .then((user) => ({ entity: user }));
    }
}
