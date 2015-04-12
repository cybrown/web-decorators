import * as assert from 'assert';
import * as sinon from 'sinon';
import * as internal from '../src/internal';
import * as core from '../src/core';
import {IControllerConfiguration, ParameterType, SendType, Header} from "../src/interfaces";

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

    describe ('addMethodConfiguration', () => {

        it ('should set a configuration object', () => {
            const target = {
                $$controllerConfiguration: {
                    methodsParameters: {}
                }
            };
            internal.addMethodConfiguration(<any>target, 'toto', {index: 0, type: 0});
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
            internal.addMethodConfiguration(<any>target, 'toto', {index: 0, type: 0});
            assert.equal(target.$$controllerConfiguration.methodsParameters.toto, reference);
        });
    });

    describe ('applyConfiguration', () => {

        it ('should call constructor only once', () => {
            var FooClass = sinon.spy();
            let configuration = {
                routes: [],
                middlewares: [],
                root: undefined,
                timeout: null,
                methodsParameters: {}
            };
            FooClass.prototype.$$controllerConfiguration = configuration;
            internal.applyConfiguration(<any>{addRoute: function(){}}, <any>FooClass);
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
            FooClass.prototype.$$controllerConfiguration = configuration;
            internal.applyConfiguration(<any>adapter, <any>FooClass);
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
            FooClass.prototype.$$controllerConfiguration = configuration;
            internal.applyConfiguration(<any>adapter, <any>FooClass);
            assert(addMiddlewareSpy.calledTwice);
            assert(addMiddlewareSpy.calledWith('/app/root/titi', sinon.match.instanceOf(FooClass), FooClass.prototype.toto));
            assert(addMiddlewareSpy.calledWith('/app/root/titi2', sinon.match.instanceOf(FooClass), FooClass.prototype.totoGet));
        });
    });

    describe ('addConfiguration', () => {

        it ('should set a configuration object', () => {
            const target = {
                $$controllerConfiguration: null
            };
            internal.addConfiguration(<any>target);
            assert(target.$$controllerConfiguration);
        });

        it ('should not override previous configuration object', () => {
            const reference = {};
            const target = {
                $$controllerConfiguration: reference
            };
            internal.addConfiguration(<any>target);
            assert.equal(target.$$controllerConfiguration, reference);
        });
    });

    describe ('methodDecoratorFactory', () => {

        it ('should add a route to configuration object', () => {
            const getDecoratorFactory = internal.methodDecoratorFactory('get');
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
                type: ParameterType.ADAPTER_PARAMETER
            };
            const config = <any>{
                methodsParameters: {
                    hello: [paramConfig1, paramConfig2]
                }
            };
            const adapterRequestData = {key: 'value'};
            internal.createParameterList(adapter, config, 'hello', adapterRequestData);
            assert(getParameterWithConfigSpy.calledTwice);
            assert(getParameterWithConfigSpy.calledWith(paramConfig1, adapterRequestData));
            assert(getParameterWithConfigSpy.calledWith(paramConfig2, adapterRequestData));
        });
    });

    describe ('callRequestHandler with raw body', () => {

        it ('should call the request handler of the adapter for a synchronous result', () => {
            const sendSpy = sinon.spy();
            const adapter = {
                send: sendSpy
            };
            function FooClass() {}
            const totoSpy = sinon.stub().returns('sync result');
            FooClass.prototype.toto = totoSpy;
            const controller = new FooClass();
            const configuration = {
                methodsParameters: {
                    toto: []
                },
                sendTypes: {}
            };
            const handlerName = 'toto';
            const adapterRequestData = {key: 'adapter'};
            internal.callRequestHandler(<any>adapter, totoSpy, controller, <any>configuration, handlerName, adapterRequestData);
            assert(totoSpy.calledOn(controller));
            assert(totoSpy.calledOnce);
            assert(sendSpy.calledOnce);
            assert(sendSpy.calledWith(200, 'sync result', adapterRequestData));
        });

        it ('should call the request handler of the adapter for an asynchronous result with a promise', (done) => {
            const sendSpy = sinon.spy();
            const adapter = {
                send: sendSpy
            };
            function FooClass() {}
            const asyncPromiseResult = new Promise((resolve: (a: any) => void, reject) => {
                resolve('async result');
            });
            const totoSpy = sinon.stub().returns(asyncPromiseResult);
            FooClass.prototype.toto = totoSpy;
            const controller = new FooClass();
            const configuration = {
                methodsParameters: {
                    toto: []
                },
                sendTypes: {}
            };
            const handlerName = 'toto';
            const adapterRequestData = {key: 'adapter'};
            internal.callRequestHandler(<any>adapter, totoSpy, controller, <any>configuration, handlerName, adapterRequestData);
            setTimeout(() => {
                asyncPromiseResult.then(() => {
                    assert(totoSpy.calledOn(controller));
                    assert(totoSpy.calledOnce);
                    assert(sendSpy.calledOnce);
                    assert(sendSpy.calledWith(200, 'async result', adapterRequestData));
                    done();
                });
            }, 20);
        });

        it ('should call the request handler of the adapter for an asynchronous result with a thunk', (done) => {
            const sendSpy = sinon.spy();
            const adapter = {
                send: sendSpy
            };
            function FooClass() {}
            const asyncPromiseResult = (cb: (err, result) => void) => {
                setTimeout(() => {
                    cb(null, 'async result');
                });
            };
            const totoSpy = sinon.stub().returns(asyncPromiseResult);
            FooClass.prototype.toto = totoSpy;
            const controller = new FooClass();
            const configuration = {
                methodsParameters: {
                    toto: []
                },
                sendTypes: {}
            };
            const handlerName = 'toto';
            const adapterRequestData = {key: 'adapter'};
            internal.callRequestHandler(<any>adapter, totoSpy, controller, <any>configuration, handlerName, adapterRequestData);
            setTimeout(() => {
                assert(totoSpy.calledOn(controller));
                assert(totoSpy.calledOnce);
                assert(sendSpy.calledOnce);
                assert(sendSpy.calledWith(200, 'async result', adapterRequestData));
                done();
            }, 20);
        });

        it ('should call the json send method if the method is decorated with @SendJson', () => {
            const sendJsonSpy = sinon.spy();
            const adapter = {
                sendJson: sendJsonSpy
            };
            function FooClass() {}
            const totoSpy = sinon.stub().returns('sync result');
            FooClass.prototype.toto = totoSpy;
            const controller = new FooClass();
            const configuration = {
                methodsParameters: {
                    toto: []
                },
                sendTypes: {
                    toto: SendType.JSON
                }
            };
            const handlerName = 'toto';
            const adapterRequestData = {key: 'adapter'};
            internal.callRequestHandler(<any>adapter, totoSpy, controller, <any>configuration, handlerName, adapterRequestData);
            assert(totoSpy.calledOn(controller));
            assert(totoSpy.calledOnce);
            assert(sendJsonSpy.calledOnce);
            assert(sendJsonSpy.calledWith(200, 'sync result', adapterRequestData));
        });
    });

    describe ('callRequestHandler with ResponseMetadata', () => {

        it ('should call the request handler of the adapter for a synchronous result', () => {
            const sendSpy = sinon.spy();
            const adapter = {
                send: sendSpy
            };
            function FooClass() {}
            const response = new core.ResponseMetadata(302, 'sync result');
            const totoSpy = sinon.stub().returns(response);
            FooClass.prototype.toto = totoSpy;
            const controller = new FooClass();
            const configuration = {
                methodsParameters: {
                    toto: []
                },
                sendTypes: {}
            };
            const handlerName = 'toto';
            const adapterRequestData = {key: 'adapter'};
            internal.callRequestHandler(<any>adapter, totoSpy, controller, <any>configuration, handlerName, adapterRequestData);
            assert(totoSpy.calledOn(controller));
            assert(totoSpy.calledOnce);
            assert(sendSpy.calledOnce);
            assert(sendSpy.calledWith(302, 'sync result', adapterRequestData));
        });

        it ('should call the request handler of the adapter for an asynchronous result with a promise', (done) => {
            const sendSpy = sinon.spy();
            const adapter = {
                send: sendSpy
            };
            function FooClass() {}
            const asyncPromiseResult = new core.ResponseMetadata(new Promise((resolve: (a: any) => void, reject) => {
                resolve('async result');
            }));
            const totoSpy = sinon.stub().returns(asyncPromiseResult);
            FooClass.prototype.toto = totoSpy;
            const controller = new FooClass();
            const configuration = {
                methodsParameters: {
                    toto: []
                },
                sendTypes: {}
            };
            const handlerName = 'toto';
            const adapterRequestData = {key: 'adapter'};
            internal.callRequestHandler(<any>adapter, totoSpy, controller, <any>configuration, handlerName, adapterRequestData);
            setTimeout(() => {
                asyncPromiseResult.body.then(() => {
                    assert(totoSpy.calledOn(controller));
                    assert(totoSpy.calledOnce);
                    assert(sendSpy.calledOnce);
                    assert(sendSpy.calledWith(200, 'async result', adapterRequestData));
                    done();
                });
            }, 20);
        });

        it ('should call the request handler of the adapter for an asynchronous result with a thunk', (done) => {
            const sendSpy = sinon.spy();
            const adapter = {
                send: sendSpy
            };
            function FooClass() {}
            const asyncPromiseResult = (cb: (err, result) => void) => {
                setTimeout(() => {
                    cb(null, 'async result');
                });
            };
            const response = new core.ResponseMetadata(302, asyncPromiseResult);
            const headers: Header[] = [{
                field: 'Content-Type',
                value: 'application/json'
            }];
            response.append('Content-Type', 'application/json');
            const totoSpy = sinon.stub().returns(response);
            FooClass.prototype.toto = totoSpy;
            const controller = new FooClass();
            const configuration = {
                methodsParameters: {
                    toto: []
                },
                sendTypes: {}
            };
            const handlerName = 'toto';
            const adapterRequestData = {key: 'adapter'};
            internal.callRequestHandler(<any>adapter, totoSpy, controller, <any>configuration, handlerName, adapterRequestData);
            setTimeout(() => {
                assert(totoSpy.calledOn(controller));
                assert(totoSpy.calledOnce);
                assert(sendSpy.calledOnce);
                assert(sendSpy.calledWith(302, 'async result', adapterRequestData, sinon.match(value => {
                    console.log(value);
                    return value.length === 1 &&
                        value[0].field === 'Content-Type' &&
                        value[0].value === 'application/json';
                })));
                done();
            }, 20);
        });

        it ('should call the json send method if the method is decorated with @SendJson', () => {
            const sendJsonSpy = sinon.spy();
            const adapter = {
                sendJson: sendJsonSpy
            };
            function FooClass() {}
            const response = new core.ResponseMetadata(400, 'sync result');
            const totoSpy = sinon.stub().returns(response);
            FooClass.prototype.toto = totoSpy;
            const controller = new FooClass();
            const configuration = {
                methodsParameters: {
                    toto: []
                },
                sendTypes: {
                    toto: SendType.JSON
                }
            };
            const handlerName = 'toto';
            const adapterRequestData = {key: 'adapter'};
            internal.callRequestHandler(<any>adapter, totoSpy, controller, <any>configuration, handlerName, adapterRequestData);
            assert(totoSpy.calledOn(controller));
            assert(totoSpy.calledOnce);
            assert(sendJsonSpy.calledOnce);
            assert(sendJsonSpy.calledWith(400, 'sync result', adapterRequestData));
        });
    });
});
