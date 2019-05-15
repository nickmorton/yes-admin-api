import { IUserVisit, IUserVisitsGetRequest, UserVisitValidator } from '@nickmorton/yes-admin-common';
import { ObjectID } from 'mongodb';
import { IApiConfig } from '../../api.config';
import { IRepository, RepositoryBase } from '../../lib';

export class UserVisitRepository
	extends RepositoryBase<IUserVisit, IUserVisitsGetRequest>
	implements IRepository<IUserVisit, IUserVisitsGetRequest> {

	constructor(config: IApiConfig, validator: UserVisitValidator) {
		super(config, 'userVisits', validator);
	}

	public async get(request: IUserVisitsGetRequest): Promise<IUserVisit[]> {
		const db = await this.db;
		const criteria = { _userId: new ObjectID(request.userId) };

		try {
			const result = await this.collection(db).find<IUserVisit>(criteria)
				.sort(request.sort)
				.skip(+request.skip)
				.limit(+request.limit)
				.toArray();
			return result;
		} catch (err) {
			console.log(err);
		} finally {
			db.close();
		}
	}

	public add(entity: IUserVisit): Promise<IUserVisit> {
		return super.add(entity, { _userId: new ObjectID(entity._userId)});
	}
}
