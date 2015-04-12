import * as assert from 'assert';
import * as sinon from 'sinon';
import * as core from '../src/core';
import {ParameterType, SendType, Header} from '../src/interfaces';

describe ('Core', () => {

    describe ('DecoratedAppBootstraper', () => {

        it ('should bootstrap an application', () => {
            const addRouteSpy = sinon.spy();
            const addMiddlewareSpy = sinon.spy();
            const adapter = {
                addRoute: addRouteSpy,
                addMiddleware: addMiddlewareSpy,
                setWebDecoratorApi: () => {}
            };
            function FooController () {};
            FooController.prototype.$$controllerConfiguration = {
                routes: [{}],
                middlewares: [{}]
            };
            const bootstrapper = new core.DecoratedAppBootstraper(<any>adapter, core.defaultWebDecoratorApi)
                .controller(FooController)
                .start();
            assert(addRouteSpy.calledOnce);
            assert(addMiddlewareSpy.calledOnce);
        });

        it ('should set the web decorator api to the adapter', () => {
            const setWebDecoratorApiSpy = sinon.spy();
            const adapter = {
                setWebDecoratorApi: setWebDecoratorApiSpy
            };
            function FooController () {};
            FooController.prototype.$$controllerConfiguration = {
                routes: [],
                middlewares: []
            };
            const bootstrapper = new core.DecoratedAppBootstraper(<any>adapter, core.defaultWebDecoratorApi)
                .controller(FooController)
                .start();
            assert(setWebDecoratorApiSpy.calledOnce);
        });
    });

    describe ('ResponseMetadata', () => {

        it ('should create a response with 200 status code', () => {
            const res = new core.ResponseMetadata('test');
            assert.equal(res.statusCode, 200);
            assert.equal(res.body, 'test');
        });

        it ('should create a reponse with status code and body', () => {
            const res = new core.ResponseMetadata(404, 'toto');
            assert.equal(res.statusCode, 404);
            assert.equal(res.body, 'toto');
        });

        it ('should create a response with only a status code', () => {
            const res = new core.ResponseMetadata(500);
            assert.equal(res.statusCode, 500);
        });

        it ('should add headers to the response', () => {
            const res = new core.ResponseMetadata(200);
            res.append('content-type', 'application/json');
            assert.equal(res.headers.length, 1);
            assert.equal(res.headers[0].field, 'content-type');
            assert.equal(res.headers[0].value, 'application/json');
        });

        it ('should add multiple headers', () => {
            const res = new core.ResponseMetadata(200);
            res.append('content-type', 'application/json');
            res.append('lang', 'en-EN');
            assert.equal(res.headers.length, 2);
            assert.equal(res.headers[0].field, 'content-type');
            assert.equal(res.headers[0].value, 'application/json');
        });

        it ('should replace headers to the response', () => {
            const res = new core.ResponseMetadata(200);
            res.append('content-type', 'application/json');
            res.replace('content-type', 'application/xml');
            assert.equal(res.headers.length, 1);
            assert.equal(res.headers[0].field, 'content-type');
            assert.equal(res.headers[0].value, 'application/xml');
        });

        it ('should return this after append', () => {
            const res = new core.ResponseMetadata(200);
            assert.equal(res.append('a', 'b'), res);
        });

        it ('should return this after replace', () => {
            const res = new core.ResponseMetadata(200);
            assert.equal(res.replace('a', 'b'), res);
        });
    });
});
