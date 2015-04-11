import * as Promise from 'bluebird';

export function unwrapAsyncValue(value: any, cb: (err: any, value: any) => void) {
    Promise.join(value, unwrappedValue => {
        if (typeof unwrappedValue === 'function') {
            unwrappedValue(cb);
        } else {
            cb(null, unwrappedValue);
        }
    }).catch(err => cb(err, null));
};
