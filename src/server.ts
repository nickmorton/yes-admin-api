import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as e from 'express';
import { apiConfig } from './api.config';
import * as apiRoutes from './api.routes';

const port: number = process.argv[2] || process.env.PORT || 3000;
const app: e.Express = e();

app
	.use(cors())
	.use(bodyParser.json());

apiRoutes.register(app, apiConfig);

app
	.use((req: e.Request, res: e.Response) => {
		console.log(`Not found '${req.url}'`);
		res
			.type('text/plain')
			.status(404)
			.send('404 - Not Found');
	});

app.listen(port, () => {
	console.log(`This express app is listening on port: ${port}`);
});
