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
var interfaces_1 = require('../../src/interfaces');
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
    describe('send', function () {
        it('should call send on response', function () {
            var sendSpy = sinon.spy();
            var data = { key: 'data' };
            var adapterData = {
                res: {
                    send: sendSpy
                }
            };
            adapter.send(data, adapterData);
            assert(sendSpy.calledOnce);
            assert(sendSpy.calledWith(data));
        });
    });
    describe('getParameterWithConfig', function () {
        it('should get a PATH_PARAMETER', function () {
            var paramConfig = {
                index: 1,
                type: interfaces_1.ParameterType.PATH_PARAMETER,
                name: 'toto'
            };
            var adapterRequestData = {
                req: {
                    params: {
                        toto: 'value'
                    }
                }
            };
            var result = adapter.getParameterWithConfig(paramConfig, adapterRequestData);
            assert.equal(result, 'value');
        });
        it('should get a RES_PARAMETER', function () {
            var paramConfig = {
                index: 1,
                type: interfaces_1.ParameterType.RES_PARAMETER
            };
            var responseObject = { key: 'response' };
            var adapterRequestData = {
                res: responseObject
            };
            var result = adapter.getParameterWithConfig(paramConfig, adapterRequestData);
            assert.equal(result, responseObject);
        });
        it('should get a REQ_PARAMETER', function () {
            var paramConfig = {
                index: 1,
                type: interfaces_1.ParameterType.REQ_PARAMETER
            };
            var requestObject = { key: 'request' };
            var adapterRequestData = {
                req: requestObject
            };
            var result = adapter.getParameterWithConfig(paramConfig, adapterRequestData);
            assert.equal(result, requestObject);
        });
        it('should get a BODY_PARAMETER', function () {
            var paramConfig = {
                index: 1,
                type: interfaces_1.ParameterType.BODY_PARAMETER
            };
            var bodyObject = { key: 'body' };
            var adapterRequestData = {
                req: {
                    body: bodyObject
                }
            };
            var result = adapter.getParameterWithConfig(paramConfig, adapterRequestData);
            assert.equal(result, bodyObject);
        });
        it('should get a QUERY_PARAMETER', function () {
            var paramConfig = {
                index: 1,
                type: interfaces_1.ParameterType.QUERY_PARAMETER,
                name: 'toto'
            };
            var adapterRequestData = {
                req: {
                    query: {
                        toto: 'value'
                    }
                }
            };
            var result = adapter.getParameterWithConfig(paramConfig, adapterRequestData);
            assert.equal(result, 'value');
        });
    });
});
