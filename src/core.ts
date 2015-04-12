import {IControllerClass, IObjectWithControllerConfiguration, IControllerConfiguration, IParameterConfiguration, IAdapter, SendType} from './interfaces';
import {createPathWithRoot} from './internal';
import {unwrapAsyncValue, Optional} from './util';

export interface Header {
    field: string;
    value: string;
}

export class ResponseMetadata {

    private _statusCode: number;
    private _headers: Header[] = [];
    private _body: any;

    get statusCode() {return this._statusCode;}
    get headers() {return this._headers;}
    get body() {return this._body;}

    constructor (statusCode: number);
    constructor (body: any);
    constructor (statusCode: number, body: any);
    constructor (statusCodeOrBody: number | any, maybeBody?: any) {
        if (typeof statusCodeOrBody === 'number') {
            [this._statusCode, this._body] = [statusCodeOrBody, maybeBody];
        } else {
            [this._statusCode, this._body] = [200, statusCodeOrBody];
        }
    }

    append(field: string, value: string) {
        this._headers.push({field, value});
    }

    replace(field: string, value: string) {
        this.findHeaderByField(field)
            .ifPresent(header => header.value = value)
            .orElse(() => this.append(field, value));
    }

    private findHeaderByField(field: string): Optional<Header> {
        return Optional.of(this._headers.filter(header => header.field == field)[0]);
    }
}

export function addMethodConfiguration(target: IObjectWithControllerConfiguration, methodName: string, parameterConfiguration: IParameterConfiguration) {
    addConfiguration(target);
    if (!target.$$controllerConfiguration.methodsParameters[methodName]) {
        target.$$controllerConfiguration.methodsParameters[methodName] = [];
    }
    target.$$controllerConfiguration.methodsParameters[methodName].push(parameterConfiguration);
}

export function applyConfiguration(adapter: IAdapter, cls: IControllerClass) {
    const configuration = cls.prototype.$$controllerConfiguration;
    var instance = new cls();
    configuration.middlewares.forEach(middleware => {
        adapter.addMiddleware(createPathWithRoot(configuration.root, middleware.path), instance, instance[middleware.handlerName]);
    });
    configuration.routes.forEach(route => {
        adapter.addRoute(configuration, route.method, createPathWithRoot(configuration.root, route.path), instance, route.handlerName, instance[route.handlerName]);
    });
}

export function addConfiguration(target: IObjectWithControllerConfiguration) {
    if (!target.$$controllerConfiguration) {
        target.$$controllerConfiguration = {
            routes: [],
            middlewares: [],
            adapter: null,
            root: null,
            methodsParameters: {},
            sendTypes: {}
        }
    }
}

export function methodDecoratorFactory(method: string): (path?: string) => MethodDecorator {

    return function (path?: string): MethodDecorator {

        return function (target: IObjectWithControllerConfiguration, handlerName: string, descriptor: TypedPropertyDescriptor<Function>) {
            addConfiguration(target);
            target.$$controllerConfiguration.routes.push({method, path, handlerName});
        };
    }
}

export function createParameterList(adapter: IAdapter, config: IControllerConfiguration, methodName: string, adapterRequestData: any) {
    const parameters = [];
    if (config.methodsParameters[methodName]) {
        config.methodsParameters[methodName].forEach(paramConfig => {
            parameters[paramConfig.index] = adapter.getParameterWithConfig(paramConfig, adapterRequestData);
        });
    }
    return parameters;
}

export function callRequestHandler (adapter: IAdapter, handler: Function, controller: any, configuration: IControllerConfiguration, handlerName: string, adapterRequestData: any) {
    const result = handler.apply(controller, createParameterList(adapter, configuration, handlerName, adapterRequestData));
    if (result != null) {
        callSendMethod(adapter, handler, wrapInResponseMetadata(result), configuration.sendTypes[handlerName], adapterRequestData);
    }
}

function wrapInResponseMetadata(value: any) {
    if (value instanceof ResponseMetadata) {
        return value;
    } else {
        return new ResponseMetadata(200, value);
    }
}

export class DecoratedAppBootstraper {

    controllers: IControllerClass[] = [];

    constructor (protected adapter: IAdapter) {

    }

    controller (controllerClass: any): DecoratedAppBootstraper {
        this.controllers.push(controllerClass);
        return this;
    }

    start (): DecoratedAppBootstraper {
        this.controllers.forEach(controllerClass => applyConfiguration(this.adapter, controllerClass));
        return this;
    }
}

function callSendMethod(adapter: IAdapter, handler: Function, response: ResponseMetadata, sendType: SendType, adapterRequestData: any) {
    unwrapAsyncValue(response.body, (err, body) => {
        switch (sendType) {
            case SendType.JSON:
                adapter.sendJson(body, adapterRequestData);
                break;
            default:
                adapter.send(body, adapterRequestData);
        }
    });
}
