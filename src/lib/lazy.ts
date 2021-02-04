export class Lazy<TObject> {
    private _instance: TObject;

    constructor(private factory: () => TObject) {
    }

    public get instance(): TObject {
        if (!this._instance) {
            this._instance = this.factory();
        }

        return this._instance;
    }
}
