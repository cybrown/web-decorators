export interface Header {
    field: string;
    value: string;
}

export enum ParameterType {
    PATH_PARAMETER,
    ADAPTER_PARAMETER,
    BODY_PARAMETER,
    QUERY_PARAMETER,
    HEADER_PARAMETER,
    COOKIE_PARAMETER
}

export enum SendType {
    JSON
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
    setWebDecoratorApi(api: IWebDecoratorApi);
    addMiddleware(configuration: IControllerConfiguration, path: string, controller: any, handlerName: string, handler: Function);
    addRoute(configuration: IControllerConfiguration, method: string, path: string, controller: any, methodName: string, handler: Function);
    getParameterWithConfig (paramConfig: IParameterConfiguration, adapterRequestData: any);
    send(statusCode: number, data: any, adapterRequestData: any, headers?: Header[]);
    sendJson(statusCode: number, data: any, adapterRequestData: any, headers?: Header[]);
}

export interface IControllerConfiguration {
    routes: IRoute[];
    middlewares: IMiddleware[];
    root: string;
    methodsParameters: {[methodName: string]: IParameterConfiguration[]};
    sendTypes: {[methodName: string]: SendType};
}

export interface IObjectWithControllerConfiguration {
    $$controllerConfiguration: IControllerConfiguration;
}

export interface IWebDecoratorApi {
    callRequestHandler (adapter: IAdapter, handler: Function, controller: any, configuration: IControllerConfiguration, handlerName: string, adapterRequestData: any, next: Function);
    applyConfiguration (adapter: IAdapter, cls: IControllerClass);
}
