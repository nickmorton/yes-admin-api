import { IModelBase, IPagedRequest, IValidator, NotFoundError, ValidationError } from '@nickmorton/yes-admin-common';
import { Collection, Db, MongoClient, ObjectID } from 'mongodb';
import { IApiConfig } from '../api.config';

const UNSPECIFIED_ERROR = 'Unspecified error';

export interface IGetAllCriteria {
	skip: number;
	limit: number;
}

export interface IRepository<TEntity extends IModelBase, TGetRequest extends IPagedRequest<TEntity>> {
	getById(id: string): Promise<TEntity>;
	get(request?: TGetRequest): Promise<TEntity[]>;
	add(entity: TEntity): Promise<TEntity>;
	update(entity: TEntity): Promise<TEntity>;
}

export abstract class RepositoryBase<TEntity extends IModelBase, TGetRequest extends IPagedRequest<TEntity>>
	implements IRepository<TEntity, TGetRequest> {

	constructor(
		private config: IApiConfig,
		private collectionName: string,
		private validator: IValidator<TEntity>) {
	}

	public abstract get(request?: TGetRequest): Promise<TEntity[]>;

	public getById(id: string): Promise<TEntity> {
		return new Promise<TEntity>(async (resolve, reject) => {
			try {
				const db = await this.db;
				const entities = await this.collection(db).find<TEntity>({ _id: new ObjectID(id) })
					.limit(1)
					.toArray();
				if (entities && entities.length > 0) {
					return resolve(entities[0]);
				}
				reject(new NotFoundError());
			} catch (err) {
				reject(new Error(err.errmsg || err.message || UNSPECIFIED_ERROR));
			}
		});
	}

	public add(entity: TEntity, toObjectIdMappings: {
		[P in keyof TEntity]?: ObjectID;
	} = {}): Promise<TEntity> {
		return new Promise<TEntity>(async (resolve, reject) => {
			if (this.validator.validate(entity)) {
				entity.lastUpdated = entity.createdDate = new Date();
				try {
					const db = await this.db;
					const result = await this.collection(db).insertOne(Object.assign(entity, toObjectIdMappings));
					entity._id = result.insertedId.toHexString();
					resolve(entity);
				} catch (err) {
					reject(new Error(err.errmsg || err.message || UNSPECIFIED_ERROR));
				}
			} else {
				reject(new ValidationError());
			}
		});
	}

	public update(entity: TEntity, toObjectIdMappings: {
		[P in keyof TEntity]?: ObjectID;
	} = {}): Promise<TEntity> {
		return new Promise<TEntity>(async (resolve, reject) => {
			if (this.validator.validate(entity)) {
				const id: ObjectID = new ObjectID(entity._id);
				const { _id, ...updatedEntity } = { ...entity, ...toObjectIdMappings, lastUpdated: new Date() };
				try {
					const db = await this.db;
					await this.collection(db).replaceOne({ _id: id }, updatedEntity);
					entity._id = id.toHexString();
					resolve(entity);
				} catch (err) {
					reject(new Error(err.errmsg || err.message || UNSPECIFIED_ERROR));
				}
			} else {
				reject(new ValidationError());
			}
		});
	}

	protected get db(): Promise<Db> {
		return MongoClient.connect(this.config.dbUrl);
	}

	protected collection(db: Db): Collection {
		return db.collection(this.collectionName);
	}
}
