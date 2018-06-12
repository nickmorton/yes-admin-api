import { IUserVisit, IUserVisitGetRequest, UserVisitValidator } from '@nickmorton/yes-admin-common';
import { ObjectID } from 'mongodb';
import { IApiConfig } from '../../api.config';
import { IRepository, RepositoryBase } from '../../lib';

export class UserVisitRepository
	extends RepositoryBase<IUserVisit, IUserVisitGetRequest>
	implements IRepository<IUserVisit, IUserVisitGetRequest> {

	constructor(config: IApiConfig, validator: UserVisitValidator) {
		super(config, 'user-visits', validator);
	}

	public async get(request: IUserVisitGetRequest): Promise<IUserVisit[]> {
		const db = await this.db;
		const criteria = { userId: new ObjectID(request.userId) };

		try {
			return await this.collection(db).find<IUserVisit>(criteria)
				.sort(request.sort)
				.skip(+request.skip)
				.limit(+request.limit)
				.toArray();
		} catch (err) {
			console.log(err);
		} finally {
			db.close();
		}
	}
}
