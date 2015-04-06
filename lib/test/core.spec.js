var assert = require('assert');
var core = require('../src/core');
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
});
