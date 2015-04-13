import {IControllerClass, IControllerConfiguration, IAdapter, IObjectWithControllerConfiguration, IParameterConfiguration, SendType, ParameterType, IQueryParameter} from './interfaces';
import {ResponseMetadata} from './core';
import {unwrapAsyncValue} from './util';

export function createPathWithRoot(root: string, path: string): string {
    if (root && path) {
        if (root[root.length - 1] !== '/' && path[0] !== '/') {
            return root + '/' + path;
        } else if (root[root.length - 1] === '/' && path[0] === '/') {
            return root + path.slice(1);
        } else {
            return root + path;
        }
    } else if (root) {
        return root;
    } else {
        return path;
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
        adapter.addMiddleware(configuration, createPathWithRoot(configuration.root, middleware.path), instance, middleware.handlerName, instance[middleware.handlerName]);
    });
    configuration.routes.forEach(route => {
        adapter.addRoute(configuration, route.method, createPathWithRoot(configuration.root, route.path), instance, route.handlerName, instance[route.handlerName]);
    });
}

export function addConfiguration(target: IObjectWithControllerConfiguration) {
    if (!target.hasOwnProperty('$$controllerConfiguration')) {
        Object.defineProperty(target, '$$controllerConfiguration', {
            value: {
                routes: [],
                middlewares: [],
                adapter: null,
                root: null,
                methodsParameters: {},
                sendTypes: {}
            },
            configurable: false,
            writable: false,
            enumerable: false
        });
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

export function createParameterList(adapter: IAdapter, config: IControllerConfiguration, methodName: string, adapterRequestData: any, next: Function) {
    const parameters = [];
    if (config.methodsParameters[methodName]) {
        config.methodsParameters[methodName].forEach(paramConfig => {
            parameters[paramConfig.index] = adapter.getParameterWithConfig(paramConfig, adapterRequestData);
        });
    }
    parameters.push(next);
    return parameters;
}

export function callRequestHandler (adapter: IAdapter, handler: Function, controller: any, configuration: IControllerConfiguration, handlerName: string, adapterRequestData: any, next: Function) {
    const result = handler.apply(controller, createParameterList(adapter, configuration, handlerName, adapterRequestData, next));
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

function callSendMethod(adapter: IAdapter, handler: Function, response: ResponseMetadata, sendType: SendType, adapterRequestData: any) {
    unwrapAsyncValue(response.body, (err, body) => {
        switch (sendType) {
            case SendType.JSON:
                adapter.sendJson(response.statusCode, body, adapterRequestData, response.headers);
                break;
            default:
                adapter.send(response.statusCode, body, adapterRequestData, response.headers);
        }
    });
}

export function parameterDecoratorFactory(parameterType: ParameterType): () => ParameterDecorator {

    return function(): ParameterDecorator {

        return function (_target: Function, methodName: string, index: number) {
            // A bug in typescript 1.5.0-alpha, _target should be an Object and not Function
            const target = <IObjectWithControllerConfiguration><any>_target;
            addMethodConfiguration(target, methodName, {index, type: parameterType});
        };
    };
}

export function parameterDecoratorWithNameFactory(parameterType: ParameterType): (name: string) => ParameterDecorator {

    return function (name: string): ParameterDecorator {

        return function (_target: Function, methodName: string, index: number) {
            const target = <IObjectWithControllerConfiguration><any>_target;
            const parameterInfo: IQueryParameter = {index, name, type: parameterType};
            addMethodConfiguration(target, methodName, parameterInfo);
        };
    };
}
