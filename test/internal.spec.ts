import * as assert from 'assert';
import * as sinon from 'sinon';
import * as internal from '../src/internal';
import {IControllerConfiguration, ParameterType} from "../src/interfaces";

describe('Internal', () => {

    describe ('createPathWithRoot', () => {

        it ('trailing slash on root and path', () => {
            var res = internal.createPathWithRoot('root/', '/path');
            assert.equal(res, 'root/path');
        });

        it ('trailing slash only rooth', () => {
            var res = internal.createPathWithRoot('root/', 'path');
            assert.equal(res, 'root/path');
        });

        it ('trailing slash only path', () => {
            var res = internal.createPathWithRoot('root', '/path');
            assert.equal(res, 'root/path');
        });

        it ('trailing slash none', () => {
            var res = internal.createPathWithRoot('root', 'path');
            assert.equal(res, 'root/path');
        });

        it ('root not defined', () => {
            var res = internal.createPathWithRoot(undefined, '/path');
            assert.equal(res, '/path');
        });

        it ('path not defined', () => {
            var res = internal.createPathWithRoot('root/', undefined);
            assert.equal(res, 'root/');
        });
    });
});
