export enum ParameterType {
    PATH_PARAMETER,
    ADAPTER_PARAMETER,
    BODY_PARAMETER,
    QUERY_PARAMETER
}

export interface IControllerClass extends Function {
    prototype: IObjectWithControllerConfiguration;
    new (): Function;
}

export interface IRoute {
    method: string;
    path: string;
    handlerName: string;
}

export interface IMiddleware {
    path?: string;
    handlerName: string;
}

export interface IParameterConfiguration {
    index: number,
    type: ParameterType
}

export interface IPathParameter extends IParameterConfiguration {
    name: string
}

export interface IQueryParameter extends IParameterConfiguration {
    name: string
}

export interface IAdapter {
    addMiddleware(path: string, controller: any, handler: Function);
    addRoute(configuration: IControllerConfiguration, method: string, path: string, controller: any, methodName: string, handler: Function);
    getParameterWithConfig (paramConfig: IParameterConfiguration, adapterRequestData: any);
    send(data: any, adapterRequestData: any);
}

export interface IControllerConfiguration {
    adapter: IAdapter;
    routes: IRoute[];
    middlewares: IMiddleware[];
    root: string;
    timeout: number;
    methodsParameters: {[methodName: string]: IParameterConfiguration[]};
}

export interface IObjectWithControllerConfiguration {
    $$controllerConfiguration: IControllerConfiguration;
}
