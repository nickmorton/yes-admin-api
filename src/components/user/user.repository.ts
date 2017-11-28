import { IUser, IUserGetRequest, UserValidator } from '@nickmorton/yes-admin-common';
import { IApiConfig } from '../../api.config';
import { IRepository, RepositoryBase } from '../../lib';

export class UserRepository extends RepositoryBase<IUser, IUserGetRequest> implements IRepository<IUser, IUserGetRequest> {
	constructor(config: IApiConfig, validator: UserValidator) {
		super(config, 'users', validator);
	}

	// // db.users.insert({ forename: 'Nick', surname: 'Morton', dob: new Date(1959, 9, 20) })
	// // db.users.insert({ forename: 'Liz', surname: 'Morton', dob: new Date(1969, 5, 24) })
	// // db.users.insert({ forename: 'Nathan', surname: 'Morton', dob: new Date(2005, 6, 15) })

	public async get(request: IUserGetRequest): Promise<IUser[]> {
		const db = await this.db;
		let criteria = {};

		if (request.name) {
			let nameRegexp: RegExp;
			const names = request.name.trim().split(' ');
			switch (names.length) {
				case 1:
					nameRegexp = new RegExp(request.name, 'i');
					criteria = { $or: [{ forename: nameRegexp }, { surname: nameRegexp }] };
					break;

				case 2:
					criteria = { $and: [{ forename: new RegExp(names[0], 'i') }, { surname: new RegExp(names[1], 'i') }] };
					break;

				default:
					const nameTerms = names.reduce((terms, name) => {
						nameRegexp = new RegExp(name, 'i');
						return [...terms, { forename: nameRegexp }, { surname: nameRegexp }];
					}, []);

					criteria = { $or: nameTerms };
					break;
			}
		}

		return this.collection(db).find<IUser>(criteria)
			.skip(+request.skip)
			.limit(+request.limit)
			.toArray()
			.then((result) => {
				db.close();
				return result;
			});
	}
}
