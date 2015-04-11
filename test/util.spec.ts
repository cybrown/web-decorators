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
