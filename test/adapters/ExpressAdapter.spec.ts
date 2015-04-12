import * as assert from 'assert';
import * as sinon from 'sinon';
import * as express from 'express';
import ExpressAdapter from '../../src/adapters/ExpressAdapter';
import {ParameterType} from '../../src/interfaces';

describe ('ExpressAdapter', () => {

    let app: express.Express;
    let adapter: ExpressAdapter;

    beforeEach(() => {
        app = <any>{};
        adapter = new ExpressAdapter(app);
    });

    describe ('addMiddleware', () => {

        it ('should add a middleware with a path', () => {
            const controller = {};
            function handler () {};
            const useSpy = sinon.spy();
            app.use = useSpy;
            adapter.addMiddleware('/path', controller, handler);
            assert(useSpy.calledOnce);
            assert(useSpy.calledWith('/path', sinon.match.func));
        });

        it ('should add a middleware without a path', () => {
            const controller = {};
            function handler () {};
            const useSpy = sinon.spy();
            app.use = useSpy;
            adapter.addMiddleware(undefined, controller, handler);
            assert(useSpy.calledOnce);
            assert(useSpy.calledWith(sinon.match.func));
        });
    });

    describe ('addRoute', () => {

        it ('should add a route', () => {
            const configuration = <any>{};
            const controller = <any>{};
            const getSpy = sinon.spy();
            app.get = getSpy;
            adapter.addRoute(configuration, 'get', '/path', controller, 'index', function () {});
            assert(getSpy.calledOnce);
            assert(getSpy.calledWith('/path', sinon.match.func));
        });
    });

    describe ('send', () => {

        it ('should call send on response', () => {
            const sendSpy = sinon.spy();
            const data = {key: 'data'};
            const adapterData = {
                res: {
                    send: sendSpy
                }
            };
            adapter.send(200, data, <any>adapterData);
            assert(sendSpy.calledOnce);
            assert(sendSpy.calledWith(200, data));
        });

        it ('should call set with headers on response', () => {
            const sendSpy = sinon.spy();
            const setSpy = sinon.spy();
            const data = {key: 'data'};
            const adapterData = {
                res: {
                    send: sendSpy,
                    set: setSpy
                }
            };
            adapter.send(402, data, <any>adapterData, [{field: 'Location', value: 'http://localhost'}]);
            assert(sendSpy.calledOnce);
            assert(sendSpy.calledWith(402, data));
            assert(setSpy.calledOnce);
            assert(setSpy.calledWith('Location', 'http://localhost'));
        });
    });

    describe ('getParameterWithConfig', () => {

        it ('should get a PATH_PARAMETER', () => {
            const paramConfig = {
                index: 1,
                type: ParameterType.PATH_PARAMETER,
                name: 'toto'
            };
            const adapterRequestData = {
                req: {
                    params: {
                        toto: 'value'
                    }
                }
            };
            var result = adapter.getParameterWithConfig(paramConfig, <any>adapterRequestData);
            assert.equal(result, 'value');
        });

        it ('should get an ADAPTER_PARAMETER', () => {
            const paramConfig = {
                index: 1,
                type: ParameterType.ADAPTER_PARAMETER
            };
            const adapterRequestData = {
                res: 'response'
            };
            var result = adapter.getParameterWithConfig(paramConfig, <any>adapterRequestData);
            assert.equal(result, adapterRequestData);
        });

        it ('should get a BODY_PARAMETER', () => {
            const paramConfig = {
                index: 1,
                type: ParameterType. BODY_PARAMETER
            };
            const bodyObject = {key: 'body'};
            const adapterRequestData = {
                req: {
                    body: bodyObject
                }
            };
            var result = adapter.getParameterWithConfig(paramConfig, <any>adapterRequestData);
            assert.equal(result, bodyObject);
        });

        it ('should get a QUERY_PARAMETER', () => {
            const paramConfig = {
                index: 1,
                type: ParameterType.QUERY_PARAMETER,
                name: 'toto'
            };
            const adapterRequestData = {
                req: {
                    query: {
                        toto: 'value'
                    }
                }
            };
            var result = adapter.getParameterWithConfig(paramConfig, <any>adapterRequestData);
            assert.equal(result, 'value');
        });

        it ('should get a HEADER_PARAMETER', () => {
            const paramConfig = {
                index: 1,
                type: ParameterType.HEADER_PARAMETER,
                name: 'Toto'
            };
            const adapterRequestData = {
                req: {
                    headers: {
                        toto: 'value'
                    }
                }
            };
            var result = adapter.getParameterWithConfig(paramConfig, <any>adapterRequestData);
            assert.equal(result, 'value');
        });

        it ('should get a COOKIE_PARAMETER', () => {
            const paramConfig = {
                index: 1,
                type: ParameterType.COOKIE_PARAMETER,
                name: 'toto'
            };
            const adapterRequestData = {
                req: {
                    cookies: {
                        toto: 'value'
                    }
                }
            };
            var result = adapter.getParameterWithConfig(paramConfig, <any>adapterRequestData);
            assert.equal(result, 'value');
        });
    });
});
