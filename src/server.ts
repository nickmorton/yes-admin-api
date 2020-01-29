import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import * as e from 'express';
import * as helmet from 'helmet';
import { apiConfig } from './api.config';
import * as apiRoutes from './api.routes';
import { authenticate, configureAuthentication } from './authentication';

dotenvConfig();

const port: number = +process.env.PORT || 3000;
const app: e.Express = e();
// TODO: Input validation with joi

configureAuthentication(app);

app
	.use(helmet())
	.use(cors())
	.use(bodyParser.json({ reviver: dateReviver }));

app.post(
	'/api/auth/google/token',
	authenticate(),
	(req, res) => {
		console.log(req);
		res.send(req.user);
	});

apiRoutes.register(app, apiConfig);

app
	.use((req, res) => {
		console.log(`Not found '${req.url}'`);
		res
			.type('text/plain')
			.status(404)
			.send('404 - Not Found');
	})
	.use((err: any, _req: e.Request, _res: e.Response, _next: e.NextFunction) => {
		// TODO: implement error handler and logging
		console.error(err);
	});

app.listen(port, () => {
	console.log(`This express app is listening on port: ${port}`);
});

function dateReviver(_key: string, value: any): any {
	if (typeof value === 'string' && /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.test(value)) {
		return new Date(value);
	}

	return value;
}
