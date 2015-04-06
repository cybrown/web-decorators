import * as express from 'express';
import {IAdapter, IControllerConfiguration, ParameterType, IParameterConfiguration, IPathParameter, IQueryParameter} from '../interfaces';
import {createParameterList, callRequestHandler} from '../core';

export interface ExpressAdapterData {
    req: express.Request;
    res: express.Response;
}

export default class ExpressAdapter implements IAdapter {

    constructor (protected app: express.Express) { }

    addMiddleware(path: string, controller: any, handler: Function) {
        console.log(`Add middleware: ${path}`);
        if (path) {
            this.app.use(path, (req, res, next) => handler.call(controller, req, res, next));
        } else {
            this.app.use((req, res, next) => handler.call(controller, req, res, next));
        }
    }

    addRoute(configuration: IControllerConfiguration, method: string, path: string, controller: any, handlerName: string, handler: Function) {
        console.log(`Add route: ${method} ${path}`);
        this.app[method](path, (req, res, next) => {
            return callRequestHandler(this, handler, controller, configuration, handlerName, {req, res});
        });
    }

    getParameterWithConfig (paramConfig: IParameterConfiguration, adapterRequestData: ExpressAdapterData) {
        switch (paramConfig.type) {
            case ParameterType.PATH_PARAMETER:
                return adapterRequestData.req.params[(<IPathParameter>paramConfig).name];
                break;
            case ParameterType.RES_PARAMETER:
                return adapterRequestData.res;
                break;
            case ParameterType.REQ_PARAMETER:
                return adapterRequestData.req;
                break;
            case ParameterType.BODY_PARAMETER:
                return adapterRequestData.req.body;
                break;
            case ParameterType.QUERY_PARAMETER:
                return adapterRequestData.req.query[(<IQueryParameter>paramConfig).name];
                break;
        }
    }

    send (data: any, expressAdapterData: ExpressAdapterData) {
        expressAdapterData.res.send(data);
    }
}
