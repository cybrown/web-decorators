import * as assert from 'assert';
import * as sinon from 'sinon';
import * as express from 'express';
import ExpressAdapter from '../../src/adapters/ExpressAdapter';

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
});
