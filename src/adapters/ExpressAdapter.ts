import * as express from 'express';
import {IAdapter, IControllerConfiguration, ParameterType, IParameterConfiguration, IPathParameter, IQueryParameter, Header, IWebDecoratorApi} from '../interfaces';

export interface ExpressAdapterData {
    req: express.Request;
    res: express.Response;
}

export default class ExpressAdapter implements IAdapter {

    protected _webDecoratorApi: IWebDecoratorApi;

    constructor (protected app: express.Express) { }

    setWebDecoratorApi (webDecoratorApi: IWebDecoratorApi) {
        this._webDecoratorApi = webDecoratorApi;
    }

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
            return this._webDecoratorApi.callRequestHandler(this, handler, controller, configuration, handlerName, {req, res});
        });
    }

    getParameterWithConfig (paramConfig: IParameterConfiguration, adapterRequestData: ExpressAdapterData) {
        switch (paramConfig.type) {
            case ParameterType.PATH_PARAMETER:
                return adapterRequestData.req.params[(<IPathParameter>paramConfig).name];
                break;
            case ParameterType.ADAPTER_PARAMETER:
                return adapterRequestData;
                break;
            case ParameterType.BODY_PARAMETER:
                return adapterRequestData.req.body;
                break;
            case ParameterType.QUERY_PARAMETER:
                return adapterRequestData.req.query[(<IQueryParameter>paramConfig).name];
                break;
            case ParameterType.HEADER_PARAMETER:
                return adapterRequestData.req.headers[(<IQueryParameter>paramConfig).name.toLowerCase()];
                break;
            case ParameterType.COOKIE_PARAMETER:
                return adapterRequestData.req.cookies[(<IQueryParameter>paramConfig).name];
                break;
        }
    }

    send (statusCode: number, data: any, expressAdapterData: ExpressAdapterData, headers?: Header[]) {
        headers && headers.forEach(header => {
            expressAdapterData.res.set(header.field, header.value);
        });
        expressAdapterData.res.status(statusCode).send(data);
    }

    sendJson (statusCode: number, data: any, expressAdapterData: ExpressAdapterData, headers?: Header[]) {
        headers && headers.forEach(header => {
            expressAdapterData.res.header(header.field, header.value);
        });
        expressAdapterData.res.status(statusCode).json(data);
    }
}
