import { IAuthenticatedUser } from '@nickmorton/yes-admin-common';
import * as e from 'express';
import * as passport from 'passport';
import { Strategy as GoogleVerifyTokenStrategy } from 'passport-google-verify-token';


export function configureAuthentication(app: e.Express) {
	passport.use(
		new GoogleVerifyTokenStrategy(
			{ clientID: process.env.GOOGLE_OAUTH20_CLIENT_ID, },
			(googleUser: IGoogleUser, _googleId, done) => {
				// User authorization checks here.
				// return done(null, false,{ message: 'Optional login failed message'})
				return done(null, mapGoogleTokenToAuthenticatedUser(googleUser), { scope: 'read' });
			}
		)
	);

	app.use(passport.initialize());
}

export function authenticate() {
	return passport.authenticate('google-verify-token', { session: false });
}

interface IGoogleUser {
	email: string; family_name: string; given_name: string; name: string; picture: string;
}

function mapGoogleTokenToAuthenticatedUser(googleUser: IGoogleUser): IAuthenticatedUser {
	return {
		email: googleUser.email,
		firstName: googleUser.given_name,
		fullName: googleUser.name,
		lastName: googleUser.family_name,
		pictureUrl: googleUser.picture,
	};
}
