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
var decorators = require('../src/decorators');
var interfaces_1 = require('../src/interfaces');
describe('Decorators', function () {
    describe('@ReqParam', function () {
        it('should add parameter request information to configuration', function () {
            function target() { }
            ;
            decorators.ReqParam()(target, 'method', 3);
            assert(target.$$controllerConfiguration.methodsParameters['method'][0]);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].index, 3);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].type, interfaces_1.ParameterType.REQ_PARAMETER);
        });
    });
    describe('@ResParam', function () {
        it('should add parameter response information to configuration', function () {
            function target() { }
            ;
            decorators.ResParam()(target, 'method', 3);
            assert(target.$$controllerConfiguration.methodsParameters['method'][0]);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].index, 3);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].type, interfaces_1.ParameterType.RES_PARAMETER);
        });
    });
    describe('@BodyParam', function () {
        it('should add parameter body information to configuration', function () {
            function target() { }
            ;
            decorators.BodyParam()(target, 'method', 3);
            assert(target.$$controllerConfiguration.methodsParameters['method'][0]);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].index, 3);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].type, interfaces_1.ParameterType.BODY_PARAMETER);
        });
    });
    describe('@QueryParam', function () {
        it('should add parameter query information to configuration', function () {
            function target() { }
            ;
            decorators.QueryParam('name')(target, 'method', 3);
            assert(target.$$controllerConfiguration.methodsParameters['method'][0]);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].index, 3);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].name, 'name');
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].type, interfaces_1.ParameterType.QUERY_PARAMETER);
        });
    });
    describe('@PathParam', function () {
        it('should add parameter path information to configuration', function () {
            function target() { }
            ;
            decorators.PathParam('name')(target, 'method', 3);
            assert(target.$$controllerConfiguration.methodsParameters['method'][0]);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].index, 3);
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].name, 'name');
            assert.equal(target.$$controllerConfiguration.methodsParameters['method'][0].type, interfaces_1.ParameterType.PATH_PARAMETER);
        });
    });
    describe('@Route', function () {
        it('should add route information and try to apply it', function () {
            function target() { }
            target.prototype = {
                $$controllerConfiguration: {
                    adapter: {}
                }
            };
            decorators.Route('/path')(target);
            assert.equal(target.prototype.$$controllerConfiguration.root, '/path');
            assert(target.prototype.$$controllerConfiguration.timeout);
        });
    });
    describe('@Controller', function () {
        it('should add controller information and try to apply it', function () {
            var adapter = {};
            function target() { }
            decorators.Controller(adapter)(target);
            assert.equal(target.prototype.$$controllerConfiguration.adapter, adapter);
            assert(target.prototype.$$controllerConfiguration.timeout);
        });
    });
    describe('@Middle', function () {
        it('should add middleware information', function () {
            var adapter = {};
            function target() { }
            decorators.Middle('/path')(target, 'method', {});
            assert.equal(target.$$controllerConfiguration.middlewares.length, 1);
            assert.equal(target.$$controllerConfiguration.middlewares[0].path, '/path');
            assert.equal(target.$$controllerConfiguration.middlewares[0].handlerName, 'method');
        });
    });
    describe('HTTP verbs', function () {
        it('should add a get route to configuration object', function () {
            var getDecorator = decorators.Get('/path');
            function target() { }
            ;
            getDecorator(target, 'path', {});
            assert.equal(target.$$controllerConfiguration.routes.length, 1);
            var route = target.$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'get');
            assert.equal(route.handlerName, 'path');
        });
        it('should add a post route to configuration object', function () {
            var getDecorator = decorators.Post('/path');
            function target() { }
            ;
            getDecorator(target, 'path', {});
            assert.equal(target.$$controllerConfiguration.routes.length, 1);
            var route = target.$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'post');
            assert.equal(route.handlerName, 'path');
        });
        it('should add a put route to configuration object', function () {
            var getDecorator = decorators.Put('/path');
            function target() { }
            ;
            getDecorator(target, 'path', {});
            assert.equal(target.$$controllerConfiguration.routes.length, 1);
            var route = target.$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'put');
            assert.equal(route.handlerName, 'path');
        });
        it('should add a delete route to configuration object', function () {
            var getDecorator = decorators.Delete('/path');
            function target() { }
            ;
            getDecorator(target, 'path', {});
            assert.equal(target.$$controllerConfiguration.routes.length, 1);
            var route = target.$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'delete');
            assert.equal(route.handlerName, 'path');
        });
    });
});
