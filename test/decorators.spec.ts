import * as assert from 'assert';
import * as sinon from 'sinon';
import * as decorators from '../src/decorators';
import {ParameterType} from '../src/interfaces';

describe ('Decorators', () => {

    describe ('@AdapterParam', () => {

        it ('should add parameter request information from adapter to configuration', () => {
            function target() {};
            decorators.AdapterParam()(target, 'method', 3);
            assert((<any>target).$$controllerConfiguration.methodsParameters['method'][0]);
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].index, 3);
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].type, ParameterType.ADAPTER_PARAMETER);
        });
    });

    describe ('@BodyParam', () => {

        it ('should add parameter body information to configuration', () => {
            function target() {};
            decorators.BodyParam()(target, 'method', 3);
            assert((<any>target).$$controllerConfiguration.methodsParameters['method'][0]);
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].index, 3);
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].type, ParameterType.BODY_PARAMETER);
        });
    });

    describe ('@QueryParam', () => {

        it ('should add parameter query information to configuration', () => {
            function target() {};
            decorators.QueryParam('name')(target, 'method', 3);
            assert((<any>target).$$controllerConfiguration.methodsParameters['method'][0]);
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].index, 3);
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].name, 'name');
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].type, ParameterType.QUERY_PARAMETER);
        });
    });

    describe ('@PathParam', () => {

        it ('should add parameter path information to configuration', () => {
            function target() {};
            decorators.PathParam('name')(target, 'method', 3);
            assert((<any>target).$$controllerConfiguration.methodsParameters['method'][0]);
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].index, 3);
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].name, 'name');
            assert.equal((<any>target).$$controllerConfiguration.methodsParameters['method'][0].type, ParameterType.PATH_PARAMETER);
        });
    });

    describe ('@Route', () => {

        it ('should add route information and try to apply it', () => {
            function target() {}
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

    describe ('@Controller', () => {

        it ('should add controller information and try to apply it', () => {
            const adapter = <any>{};
            function target() {}
            decorators.Controller(adapter)(target);
            assert.equal(target.prototype.$$controllerConfiguration.adapter, adapter);
            assert(target.prototype.$$controllerConfiguration.timeout);
        });
    });

    describe ('@Middle', () => {

        it ('should add middleware information', () => {
            const adapter = <any>{};
            function target() {}
            decorators.Middle('/path')(target, 'method', {});
            assert.equal((<any>target).$$controllerConfiguration.middlewares.length, 1);
            assert.equal((<any>target).$$controllerConfiguration.middlewares[0].path, '/path');
            assert.equal((<any>target).$$controllerConfiguration.middlewares[0].handlerName, 'method');
        });
    });

    describe ('HTTP verbs', () => {

        it ('should add a get route to configuration object', () => {
            const getDecorator = decorators.Get('/path');
            function target() {};
            getDecorator(target, 'path', {});
            assert.equal((<any>target).$$controllerConfiguration.routes.length, 1);
            const route = (<any>target).$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'get');
            assert.equal(route.handlerName, 'path');
        });

        it ('should add a post route to configuration object', () => {
            const getDecorator = decorators.Post('/path');
            function target() {};
            getDecorator(target, 'path', {});
            assert.equal((<any>target).$$controllerConfiguration.routes.length, 1);
            const route = (<any>target).$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'post');
            assert.equal(route.handlerName, 'path');
        });

        it ('should add a put route to configuration object', () => {
            const getDecorator = decorators.Put('/path');
            function target() {};
            getDecorator(target, 'path', {});
            assert.equal((<any>target).$$controllerConfiguration.routes.length, 1);
            const route = (<any>target).$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'put');
            assert.equal(route.handlerName, 'path');
        });

        it ('should add a delete route to configuration object', () => {
            const getDecorator = decorators.Delete('/path');
            function target() {};
            getDecorator(target, 'path', {});
            assert.equal((<any>target).$$controllerConfiguration.routes.length, 1);
            const route = (<any>target).$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'delete');
            assert.equal(route.handlerName, 'path');
        });
    });
});
