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
var ExpressAdapter_1 = require('../../src/adapters/ExpressAdapter');
describe('ExpressAdapter', function () {
    var app;
    var adapter;
    beforeEach(function () {
        app = {};
        adapter = new ExpressAdapter_1.default(app);
    });
    describe('addMiddleware', function () {
        it('should add a middleware with a path', function () {
            var controller = {};
            function handler() { }
            ;
            var useSpy = sinon.spy();
            app.use = useSpy;
            adapter.addMiddleware('/path', controller, handler);
            assert(useSpy.calledOnce);
            assert(useSpy.calledWith('/path', sinon.match.func));
        });
        it('should add a middleware without a path', function () {
            var controller = {};
            function handler() { }
            ;
            var useSpy = sinon.spy();
            app.use = useSpy;
            adapter.addMiddleware(undefined, controller, handler);
            assert(useSpy.calledOnce);
            assert(useSpy.calledWith(sinon.match.func));
        });
    });
    describe('addRoute', function () {
        it('should add a route', function () {
            var configuration = {};
            var controller = {};
            var getSpy = sinon.spy();
            app.get = getSpy;
            adapter.addRoute(configuration, 'get', '/path', controller, 'index', function () { });
            assert(getSpy.calledOnce);
            assert(getSpy.calledWith('/path', sinon.match.func));
        });
    });
});
