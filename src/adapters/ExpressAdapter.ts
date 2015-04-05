import * as express from 'express';
import {IAdapter, IControllerConfiguration, ParameterType, IPathParameter, IQueryParameter} from '../interfaces';

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

    private createParameterList(config: IControllerConfiguration, methodName: string, req: express.Request, res: express.Request) {
        const parameters = [];
        if (config.methodsParameters[methodName]) {
            Object.keys(config.methodsParameters[methodName]).forEach(_index => {
                const index: number = parseInt(_index, 10);
                const paramConfig = config.methodsParameters[methodName][index];
                switch (paramConfig.type) {
                    case ParameterType.PATH_PARAMETER:
                        parameters[index] = req.params[(<IPathParameter>paramConfig).name];
                        break;
                    case ParameterType.RES_PARAMETER:
                        parameters[index] = res;
                        break;
                    case ParameterType.REQ_PARAMETER:
                        parameters[index] = req;
                        break;
                    case ParameterType.BODY_PARAMETER:
                        parameters[index] = req.body;
                        break;
                    case ParameterType.QUERY_PARAMETER:
                        parameters[index] = req.query[(<IQueryParameter>paramConfig).name];
                        break;
                }
            });
        }
        return parameters;
    }
}
