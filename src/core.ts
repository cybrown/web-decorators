import {IControllerClass, IObjectWithControllerConfiguration, IControllerConfiguration, IParameterConfiguration} from './interfaces';
import {createPathWithRoot, applyConfiguration} from './internal';

export function addMethodConfiguration(target: IObjectWithControllerConfiguration, methodName: string, parameterConfiguration: IParameterConfiguration) {
    addConfiguration(target);
    if (!target.$$controllerConfiguration.methodsParameters[methodName]) {
        target.$$controllerConfiguration.methodsParameters[methodName] = [];
    }
    target.$$controllerConfiguration.methodsParameters[methodName].push(parameterConfiguration);
}

export function tryApplyConfiguration(cls: IControllerClass, configuration: IControllerConfiguration) {
    if (!configuration.adapter) {
        return;
    }
    if (configuration.timeout) {
        clearTimeout(configuration.timeout);
    }
    configuration.timeout = setTimeout(() => {
        applyConfiguration(cls, configuration);
    });
}

export function addConfiguration(target: IObjectWithControllerConfiguration) {
    if (!target.$$controllerConfiguration) {
        target.$$controllerConfiguration = {
            routes: [],
            middlewares: [],
            adapter: null,
            root: null,
            timeout: null,
            methodsParameters: {}
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
