import { IPagedResponse, IResponse, IUser, IUserGetRequest, UserValidator } from '@nickmorton/yes-admin-common';
import * as e from 'express';
import { IApiConfig } from '../../api.config';
import { Lazy } from '../../lib';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

export function register(app: e.Application, config: IApiConfig) {
    const service: Lazy<UserService> = new Lazy(
        () => new UserService(new UserRepository(config, new UserValidator()))
    );
    app
        .get('/api/users', (req, res, next) => {
            const params: IUserGetRequest = { ...req.query };
            if (req.query.sort) {
                params.sort = JSON.parse(req.query.sort);
            }

            service.instance.get(params).then((response: IPagedResponse<IUser>) => res.json(response))
                .catch((err) => next(err));
        })
        .post('/api/users', (req, res, next) => {
            service.instance.add(req.body).then((response: IResponse<IUser>) => res.json(response))
                .catch((err) => next(err));
        })
        .get('/api/users/:userId', (req, res, next) => {
            service.instance.getById(req.params.userId)
                .then((response: IResponse<IUser>) => res.json(response))
                .catch((err) => next(err));
        })
        .put('/api/users/:userId', (req, res, next) => {
            // TODO: Validate route userId against request resource.
            service.instance.update(req.body)
                .then((response: IResponse<IUser>) => res.json(response))
                .catch((err) => next(err));
        });
}
