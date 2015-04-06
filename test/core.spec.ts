import * as assert from 'assert';
import * as sinon from 'sinon';
import * as core from '../src/core';
import {ParameterType} from '../src/interfaces';

describe ('Core', () => {

    describe ('addMethodConfiguration', () => {

        it ('should set a configuration object', () => {
            const target = {
                $$controllerConfiguration: {
                    methodsParameters: {}
                }
            };
            core.addMethodConfiguration(<any>target, 'toto', {index: 0, type: 0});
            assert(target.$$controllerConfiguration.methodsParameters['toto']);
        });

        it ('should not override previous configuration object', () => {
            const reference = [];
            const target = {
                $$controllerConfiguration: {
                    methodsParameters: {
                        toto: reference
                    }
                }
            };
            core.addMethodConfiguration(<any>target, 'toto', {index: 0, type: 0});
            assert.equal(target.$$controllerConfiguration.methodsParameters.toto, reference);
        });
    });

    describe ('tryApplyConfiguration', () => {

        it ('should not add timeout if adapter is not present', () => {
            function FooCtrl() {};
            const configuration = <any>{};
            core.tryApplyConfiguration(<any>FooCtrl, <any>configuration);
            assert(!configuration.timeout);
        });

        it ('should add timeout if adapter is present', () => {
            function FooCtrl() {};
            const configuration = <any>{
                adapter: {}
            };
            core.tryApplyConfiguration(<any>FooCtrl, <any>configuration);
            assert(configuration.timeout);
        });
    });

    describe ('addConfiguration', () => {

        it ('should set a configuration object', () => {
            const target = {
                $$controllerConfiguration: null
            };
            core.addConfiguration(<any>target);
            assert(target.$$controllerConfiguration);
        });

        it ('should not override previous configuration object', () => {
            const reference = {};
            const target = {
                $$controllerConfiguration: reference
            };
            core.addConfiguration(<any>target);
            assert.equal(target.$$controllerConfiguration, reference);
        });
    });

    describe ('methodDecoratorFactory', () => {

        it ('should add a route to configuration object', () => {
            const getDecoratorFactory = core.methodDecoratorFactory('get');
            const getDecorator = getDecoratorFactory('/path');
            function target() {};
            getDecorator(target, 'path', {});
            assert.equal((<any>target).$$controllerConfiguration.routes.length, 1);
            const route = (<any>target).$$controllerConfiguration.routes[0];
            assert.equal(route.path, '/path');
            assert.equal(route.method, 'get');
            assert.equal(route.handlerName, 'path');
        });
    });

    describe ('createParameterList', () => {

        it ('should call getParameterWithConfig for each parameter configuration object', () => {
            const getParameterWithConfigSpy = sinon.spy();
            const adapter = <any>{
                getParameterWithConfig: getParameterWithConfigSpy
            };
            const paramConfig1 = {
                index: 0,
                type: ParameterType.PATH_PARAMETER,
                name: 'toto'
            };
            const paramConfig2 = {
                index: 1,
                type: ParameterType.REQ_PARAMETER
            };
            const config = <any>{
                methodsParameters: {
                    hello: [paramConfig1, paramConfig2]
                }
            };
            const adapterRequestData = {key: 'value'};
            core.createParameterList(adapter, config, 'hello', adapterRequestData);
            assert(getParameterWithConfigSpy.calledTwice);
            assert(getParameterWithConfigSpy.calledWith(paramConfig1, adapterRequestData));
            assert(getParameterWithConfigSpy.calledWith(paramConfig2, adapterRequestData));
        });
    });
});
