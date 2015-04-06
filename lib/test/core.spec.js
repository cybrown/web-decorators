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
var core = require('../src/core');
var interfaces_1 = require('../src/interfaces');
describe('Core', function () {
    describe('addMethodConfiguration', function () {
        it('should set a configuration object', function () {
            var target = {
                $$controllerConfiguration: {
                    methodsParameters: {}
                }
            };
            core.addMethodConfiguration(target, 'toto', { index: 0, type: 0 });
            assert(target.$$controllerConfiguration.methodsParameters['toto']);
        });
        it('should not override previous configuration object', function () {
            var reference = [];
            var target = {
                $$controllerConfiguration: {
                    methodsParameters: {
                        toto: reference
                    }
                }
            };
            core.addMethodConfiguration(target, 'toto', { index: 0, type: 0 });
            assert.equal(target.$$controllerConfiguration.methodsParameters.toto, reference);
        });
    });
    describe('tryApplyConfiguration', function () {
        it('should not add timeout if adapter is not present', function () {
            function FooCtrl() { }
            ;
            var configuration = {};
            core.tryApplyConfiguration(FooCtrl, configuration);
            assert(!configuration.timeout);
        });
        it('should add timeout if adapter is present', function () {
            function FooCtrl() { }
            ;
            var configuration = {
                adapter: {}
            };
            core.tryApplyConfiguration(FooCtrl, configuration);
            assert(configuration.timeout);
        });
    });
    describe('addConfiguration', function () {
        it('should set a configuration object', function () {
            var target = {
                $$controllerConfiguration: null
            };
            core.addConfiguration(target);
            assert(target.$$controllerConfiguration);
        });
        it('should not override previous configuration object', function () {
            var reference = {};
            var target = {
                $$controllerConfiguration: reference
            };
            core.addConfiguration(target);
            assert.equal(target.$$controllerConfiguration, reference);
        });
    });
    describe('methodDecoratorFactory', function () {
        it('should add a route to configuration object', function () {
            var getDecoratorFactory = core.methodDecoratorFactory('get');
            var getDecorator = getDecoratorFactory('/path');
            function target() { }
            ;
            getDecorator(target, 'path', {});
            assert.equal(target.$$controllerConfiguration.routes.length, 1);
            var route = target.$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'get');
            assert.equal(route.handlerName, 'path');
        });
    });
    describe('createParameterList', function () {
        it('should call getParameterWithConfig for each parameter configuration object', function () {
            var getParameterWithConfigSpy = sinon.spy();
            var adapter = {
                getParameterWithConfig: getParameterWithConfigSpy
            };
            var paramConfig1 = {
                index: 0,
                type: interfaces_1.ParameterType.PATH_PARAMETER,
                name: 'toto'
            };
            var paramConfig2 = {
                index: 1,
                type: interfaces_1.ParameterType.ADAPTER_PARAMETER
            };
            var config = {
                methodsParameters: {
                    hello: [paramConfig1, paramConfig2]
                }
            };
            var adapterRequestData = { key: 'value' };
            core.createParameterList(adapter, config, 'hello', adapterRequestData);
            assert(getParameterWithConfigSpy.calledTwice);
            assert(getParameterWithConfigSpy.calledWith(paramConfig1, adapterRequestData));
            assert(getParameterWithConfigSpy.calledWith(paramConfig2, adapterRequestData));
        });
    });
    describe('callRequestHandler', function () {
        it('should call the request handler of the adapter for a synchronous result', function () {
            var sendSpy = sinon.spy();
            var adapter = {
                send: sendSpy
            };
            function FooClass() { }
            var totoSpy = sinon.stub().returns('sync result');
            FooClass.prototype.toto = totoSpy;
            var controller = new FooClass();
            var configuration = {
                methodsParameters: {
                    toto: []
                }
            };
            var handlerName = 'toto';
            var adapterRequestData = { key: 'adapter' };
            core.callRequestHandler(adapter, totoSpy, controller, configuration, handlerName, adapterRequestData);
            assert(totoSpy.calledOn(controller));
            assert(totoSpy.calledOnce);
            assert(sendSpy.calledOnce);
            assert(sendSpy.calledWith('sync result', adapterRequestData));
        });
        it('should call the request handler of the adapter for an asynchronous result', function (done) {
            var sendSpy = sinon.spy();
            var adapter = {
                send: sendSpy
            };
            function FooClass() { }
            var asyncPromiseResult = new Promise(function (resolve, reject) {
                resolve('async result');
            });
            var totoSpy = sinon.stub().returns(asyncPromiseResult);
            FooClass.prototype.toto = totoSpy;
            var controller = new FooClass();
            var configuration = {
                methodsParameters: {
                    toto: []
                }
            };
            var handlerName = 'toto';
            var adapterRequestData = { key: 'adapter' };
            core.callRequestHandler(adapter, totoSpy, controller, configuration, handlerName, adapterRequestData);
            asyncPromiseResult.then(function () {
                assert(totoSpy.calledOn(controller));
                assert(totoSpy.calledOnce);
                assert(sendSpy.calledOnce);
                assert(sendSpy.calledWith('async result', adapterRequestData));
                done();
            });
        });
    });
});
