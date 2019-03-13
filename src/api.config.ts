export interface IApiConfig {
	dbUrl: string;
}

export const apiConfig: IApiConfig = {
	dbUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/yes-admin',
};
