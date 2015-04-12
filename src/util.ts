import * as Promise from 'bluebird';

export function unwrapAsyncValue<T>(value: any, cb: (err: any, value: T) => void) {
    Promise.join(value, unwrappedValue => {
        if (typeof unwrappedValue === 'function') {
            unwrappedValue(cb);
        } else {
            cb(null, unwrappedValue);
        }
    }).catch(err => cb(err, null));
};

export class Optional<T> {

    private _value: T;

    constructor (value: T) {
        if (value == null) {
            if (Optional.absent == null) {
                Optional.absent = this;
            }
            return Optional.absent;
        } else {
            this._value = value;
        }
    }

    get isEmpty(): boolean {return this._value == null;}
    get isPresent(): boolean {return !this.isEmpty;}

    get get(): T {
        if (this.isEmpty) {
            throw new Error('Can not get of absent');
        } else {
            return this._value;
        }
    }

    getOrElse(defaultValue: T): T {
        return this.isEmpty ? defaultValue : this._value;
    }

    ifPresent(cb: (value: T) => void): Optional<T> {
        if (!this.isEmpty) {
            cb(this._value);
        }
        return this;
    }

    orElse(cb: () => void): Optional<T> {
        if (this.isEmpty) {
            cb();
        }
        return this;
    }

    map<U>(cb: (value: T) => U): Optional<U> {
        if (!this.isEmpty) {
            return Optional.of(cb(this._value));
        }
        return Optional.absent;
    }

    flatMap<U>(cb: (value: T) => Optional<U>): Optional<U> {
        if (!this.isEmpty) {
            return cb(this._value);
        }
        return Optional.absent;
    }

    static of<V>(value: V): Optional<V> {
        if (value == null) {
            return Optional.absent;
        } else {
            return new Optional(value);
        }
    }

    static absent = new Optional(null);
}
