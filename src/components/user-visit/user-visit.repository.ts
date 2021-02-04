import { IUserVisit, IUserVisitsGetRequest, UserVisitValidator } from '@nickmorton/yes-admin-common';
import { MongoClient, ObjectID } from 'mongodb';
import { IApiConfig } from '../../api.config';
import { IRepository, RepositoryBase } from '../../lib';

export class UserVisitRepository
    extends RepositoryBase<IUserVisit, IUserVisitsGetRequest>
    implements IRepository<IUserVisit, IUserVisitsGetRequest> {

    constructor(config: IApiConfig, validator: UserVisitValidator) {
        super(config, 'userVisits', validator);
    }

    public async get(request: IUserVisitsGetRequest): Promise<IUserVisit[]> {
        const criteria = { _userId: new ObjectID(request.userId) };
        let client: MongoClient;
        try {
            client = await this.mongoClient();
            const result = await this.collection(client).find<IUserVisit>(criteria)
                .sort(request.sort)
                .skip(+request.skip)
                .limit(+request.limit)
                .toArray();
            return result;
        } finally {
            client.close();
        }
    }

    public add(entity: IUserVisit): Promise<IUserVisit> {
        return super.add(entity, { _userId: new ObjectID(entity._userId) });
    }

    public update(entity: IUserVisit): Promise<IUserVisit> {
        return super.update(entity, { _userId: new ObjectID(entity._userId) });
    }
}
