import { IUser, IUserVisit } from '@nickmorton/yes-admin-common';

export interface IUserBusinessRules {
	updateLastVisited(user: IUser, ...visits: IUserVisit[]): IUser;
}

export class UserBusinessRules implements IUserBusinessRules {
	public updateLastVisited(user: IUser, ...visits: IUserVisit[]): IUser {
		let lastVisited: Date = null;
		if (visits && visits.length > 0) {
			const maxDate = Math.max(...visits.map((v) => v.date.valueOf()));
			if (maxDate > 0) {
				lastVisited = new Date(maxDate);
			}
		}

		return Object.assign({}, user, { lastVisited } as IUser);
	}
}
