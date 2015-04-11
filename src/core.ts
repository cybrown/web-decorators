import {IControllerClass, IObjectWithControllerConfiguration, IControllerConfiguration, IParameterConfiguration, IAdapter, SendType} from './interfaces';
import {createPathWithRoot} from './internal';
import {unwrapAsyncValue} from './util';

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
        unwrapAsyncValue(result, (err, result) => {
            callSendMethod(adapter, handler, result, configuration.sendTypes[handlerName], adapterRequestData);
        });
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

function callSendMethod(adapter: IAdapter, handler: Function, result: any, sendType: SendType, adapterRequestData: any) {
    switch (sendType) {
        case SendType.JSON:
            adapter.sendJson(result, adapterRequestData);
            break;
        default:
            adapter.send(result, adapterRequestData);
    }
}
