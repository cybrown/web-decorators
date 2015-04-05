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

    describe ('applyConfiguration', () => {

        it ('should call constructor only once', () => {
            var FooClass = sinon.spy();
            let configuration = {
                adapter: {addRoute: function(){}},
                routes: [],
                middlewares: [],
                root: undefined,
                timeout: null,
                methodsParameters: {}
            };
            internal.applyConfiguration(<any>FooClass, <any>configuration);
            assert(FooClass.calledOnce);
        });

        it ('should call addRoute for each configured route', () => {
            var FooClass = sinon.spy();
            FooClass.prototype.toto = function () {};
            FooClass.prototype.totoGet = function () {};
            var addRouteSpy = sinon.spy();
            let adapter = {
                addRoute: addRouteSpy
            };
            let routes = [{
                method: 'post',
                path: '/titi',
                handlerName: 'toto'
            }, {
                method: 'get',
                path: '/titi2',
                handlerName: 'totoGet'
            }];
            let configuration = {
                adapter: adapter,
                routes: routes,
                middlewares: [],
                root: '/app/root',
                timeout: null,
                methodsParameters: {}
            };
            internal.applyConfiguration(<any>FooClass, <any>configuration);
            assert(addRouteSpy.calledTwice);
            assert(addRouteSpy.calledWith(configuration, 'post', '/app/root/titi', sinon.match.instanceOf(FooClass), 'toto', FooClass.prototype.toto));
            assert(addRouteSpy.calledWith(configuration, 'get', '/app/root/titi2', sinon.match.instanceOf(FooClass), 'totoGet', FooClass.prototype.totoGet));
        });

        it ('should call addMiddleware for each configured middleware', () => {
            var FooClass = sinon.spy();
            FooClass.prototype.toto = function () {};
            FooClass.prototype.totoGet = function () {};
            var addMiddlewareSpy = sinon.spy();
            let adapter = {
                addMiddleware: addMiddlewareSpy
            };
            let middlewares = [{
                path: '/titi',
                handlerName: 'toto'
            }, {
                path: '/titi2',
                handlerName: 'totoGet'
            }];
            let configuration = {
                adapter: adapter,
                routes: [],
                middlewares: middlewares,
                root: '/app/root',
                timeout: null,
                methodsParameters: {}
            };
            internal.applyConfiguration(<any>FooClass, <any>configuration);
            assert(addMiddlewareSpy.calledTwice);
            assert(addMiddlewareSpy.calledWith('/app/root/titi', sinon.match.instanceOf(FooClass), FooClass.prototype.toto));
            assert(addMiddlewareSpy.calledWith('/app/root/titi2', sinon.match.instanceOf(FooClass), FooClass.prototype.totoGet));
        });
    });
});
