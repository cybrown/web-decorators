import * as express from 'express';
import {IAdapter, IControllerConfiguration, ParameterType, IParameterConfiguration, IPathParameter, IQueryParameter} from '../interfaces';

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
            handler.apply(controller, this.createParameterList(configuration, handlerName, req, res));
        });
    }

    getParameterWithConfig (paramConfig: IParameterConfiguration, req: express.Request, res: express.Response) {
        switch (paramConfig.type) {
            case ParameterType.PATH_PARAMETER:
                return req.params[(<IPathParameter>paramConfig).name];
                break;
            case ParameterType.RES_PARAMETER:
                return res;
                break;
            case ParameterType.REQ_PARAMETER:
                return req;
                break;
            case ParameterType.BODY_PARAMETER:
                return req.body;
                break;
            case ParameterType.QUERY_PARAMETER:
                return req.query[(<IQueryParameter>paramConfig).name];
                break;
        }
    }

    private createParameterList(config: IControllerConfiguration, methodName: string, req: express.Request, res: express.Response) {
        const parameters = [];
        if (config.methodsParameters[methodName]) {
            config.methodsParameters[methodName].forEach(paramConfig => {
                parameters[paramConfig.index] = this.getParameterWithConfig(paramConfig, req, res);
            });
        }
        return parameters;
    }
}
