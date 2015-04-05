var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
var assert = require('assert');
var sinon = require('sinon');
var internal = require('../src/internal');
describe('Internal', function () {
    describe('createPathWithRoot', function () {
        it('trailing slash on root and path', function () {
            var res = internal.createPathWithRoot('root/', '/path');
            assert.equal(res, 'root/path');
        });
        it('trailing slash only rooth', function () {
            var res = internal.createPathWithRoot('root/', 'path');
            assert.equal(res, 'root/path');
        });
        it('trailing slash only path', function () {
            var res = internal.createPathWithRoot('root', '/path');
            assert.equal(res, 'root/path');
        });
        it('trailing slash none', function () {
            var res = internal.createPathWithRoot('root', 'path');
            assert.equal(res, 'root/path');
        });
        it('root not defined', function () {
            var res = internal.createPathWithRoot(undefined, '/path');
            assert.equal(res, '/path');
        });
        it('path not defined', function () {
            var res = internal.createPathWithRoot('root/', undefined);
            assert.equal(res, 'root/');
        });
    });
    describe('applyConfiguration', function () {
        it('should call constructor only once', function () {
            var FooClass = sinon.spy();
            var configuration = {
                adapter: { addRoute: function () { } },
                routes: [],
                middlewares: [],
                root: undefined,
                timeout: null,
                methodsParameters: {}
            };
            internal.applyConfiguration(FooClass, configuration);
            assert(FooClass.calledOnce);
        });
        it('should call addRoute for each configured route', function () {
            var FooClass = sinon.spy();
            FooClass.prototype.toto = function () { };
            FooClass.prototype.totoGet = function () { };
            var addRouteSpy = sinon.spy();
            var adapter = {
                addRoute: addRouteSpy
            };
            var routes = [{
                    method: 'post',
                    path: '/titi',
                    handlerName: 'toto'
                }, {
                    method: 'get',
                    path: '/titi2',
                    handlerName: 'totoGet'
                }];
            var configuration = {
                adapter: adapter,
                routes: routes,
                middlewares: [],
                root: '/app/root',
                timeout: null,
                methodsParameters: {}
            };
            internal.applyConfiguration(FooClass, configuration);
            assert(addRouteSpy.calledTwice);
            assert(addRouteSpy.calledWith(configuration, 'post', '/app/root/titi', sinon.match.instanceOf(FooClass), 'toto', FooClass.prototype.toto));
            assert(addRouteSpy.calledWith(configuration, 'get', '/app/root/titi2', sinon.match.instanceOf(FooClass), 'totoGet', FooClass.prototype.totoGet));
        });
        it('should call addMiddleware for each configured middleware', function () {
            var FooClass = sinon.spy();
            FooClass.prototype.toto = function () { };
            FooClass.prototype.totoGet = function () { };
            var addMiddlewareSpy = sinon.spy();
            var adapter = {
                addMiddleware: addMiddlewareSpy
            };
            var middlewares = [{
                    path: '/titi',
                    handlerName: 'toto'
                }, {
                    path: '/titi2',
                    handlerName: 'totoGet'
                }];
            var configuration = {
                adapter: adapter,
                routes: [],
                middlewares: middlewares,
                root: '/app/root',
                timeout: null,
                methodsParameters: {}
            };
            internal.applyConfiguration(FooClass, configuration);
            assert(addMiddlewareSpy.calledTwice);
            assert(addMiddlewareSpy.calledWith('/app/root/titi', sinon.match.instanceOf(FooClass), FooClass.prototype.toto));
            assert(addMiddlewareSpy.calledWith('/app/root/titi2', sinon.match.instanceOf(FooClass), FooClass.prototype.totoGet));
        });
    });
});
