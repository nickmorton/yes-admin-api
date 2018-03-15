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
					nameRegexp = new RegExp(names[0], 'i');
					criteria = { $or: [{ forename: nameRegexp }, { surname: nameRegexp }] };
					break;

				case 2:
					const nameRegexpList = [new RegExp(names[0], 'i'), new RegExp(names[1], 'i')];
					criteria = {
						$and: [
							{ forename: { $in: nameRegexpList } },
							{ surname: { $in: nameRegexpList } },
						],
					};
					break;

				default:
					const nameTerms = names.reduce((terms: string[], name: string) => {
						nameRegexp = new RegExp(name, 'i');
						return [...terms, { forename: nameRegexp }, { surname: nameRegexp }];
					}, []);

					criteria = { $or: nameTerms };
					break;
			}
		}

		try {
			return await this.collection(db).find<IUser>(criteria)
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
