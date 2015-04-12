import * as assert from 'assert';
import * as util from '../src/util';

describe ('unwrapAsyncValue', () => {

    let wrappedValue;

    beforeEach(() => {
        wrappedValue = {'toto': 'tata'};
    });

    it ('should give a normal value as is', done => {
        util.unwrapAsyncValue(wrappedValue, (err, value) => {
            assert.equal(value, wrappedValue);
            done(err);
        });
    });

    it ('should unwrap a promise value', done => {
        const promise = new Promise((resolve, reject) => {
            resolve(wrappedValue);
        });
        util.unwrapAsyncValue(promise, (err, value) => {
            assert.equal(value, wrappedValue);
            done(err);
        });
    });

    it ('should unwrap an error from a promise', done => {
        const promise = new Promise((resolve, reject) => {
            reject(new Error());
        });
        util.unwrapAsyncValue(promise, (err, value) => {
            assert(err);
            done();
        });
    });

    it ('should unwrap a thunk value', done => {
        const thunk = (cb: (err, value) => void) => {
            cb(null, wrappedValue);
        };
        util.unwrapAsyncValue(thunk, (err, value) => {
            assert.equal(value, wrappedValue);
            done(err);
        });
    });

    it ('should unwrap an error from a thunk', done => {
        const thunk = (cb: (err, value) => void) => {
            cb(new Error(), null);
        };
        util.unwrapAsyncValue(thunk, (err, value) => {
            assert(err);
            done();
        });
    });
});

describe ('Optional', () => {

    it ('should create an Optional of a value', () => {
        var maybeOne = new util.Optional(1);
        assert.equal(maybeOne.get, 1);
    });

    it ('should throw if get on absent', () => {
        assert.throws(() => util.Optional.absent.get);
    });

    it ('Optional.absent should equal new Optional(null)', () => {
        assert.strictEqual(util.Optional.absent, new util.Optional(null));
    });

    it ('Optional.absent should equal new Optional(undefined)', () => {
        assert.strictEqual(util.Optional.absent, new util.Optional(undefined));
    });

    it ('Optional.absent should equal Optional.of(null)', () => {
        assert.strictEqual(util.Optional.absent, util.Optional.of(null));
    });

    it ('Optional.absent should equal Optional.of(undefined)', () => {
        assert.strictEqual(util.Optional.absent, util.Optional.of(undefined));
    });

    it ('should call ifPresent if Optional is not absent', done => {
        util.Optional.of(42).ifPresent(value => {
            assert.equal(value, 42);
            done();
        });
    });

    it ('should call orElse if Optional is absent', done => {
        util.Optional.absent.orElse(done);
    });

    it ('should transform the value when map is called', () => {
        assert.equal(util.Optional.of(13).map(value => value + 1).get, 14);
    });

    it ('should transform the value when flatMap is call', () => {
        assert.equal(util.Optional.of(13).flatMap(value => util.Optional.of(value + 1)).get, 14);
    });

    it ('should not execute map if value is absent', done => {
        util.Optional.absent.map(value => {
            done(true);
            return value;
        });
        done();
    });

    it ('should return absent if create an optional of null or undefined', () => {
        assert.equal(new util.Optional(null), util.Optional.absent);
        assert.equal(new util.Optional(undefined), util.Optional.absent);
    });

    it ('should return the default value if absent with getOrElse', () => {
        assert.equal(util.Optional.absent.getOrElse(12), 12);
    });

    it ('should return the internal value with getOrElse if present', () => {
        assert.equal(util.Optional.of(42).getOrElse(13), 42);
    });
});
