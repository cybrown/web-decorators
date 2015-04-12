import {IAdapter, IControllerClass, IObjectWithControllerConfiguration, IPathParameter, IQueryParameter, ParameterType, SendType} from './interfaces';
import {addConfiguration, applyConfiguration, addMethodConfiguration, methodDecoratorFactory, parameterDecoratorFactory, parameterDecoratorWithNameFactory} from './core';

export function Controller(root: string): ClassDecorator {

    return function (target: IControllerClass) {
        addConfiguration(target.prototype);
        target.prototype.$$controllerConfiguration.root = root;
    }
}

export function Middle (path?: string): MethodDecorator {

    return function (target: IObjectWithControllerConfiguration, handlerName: string, descriptor: TypedPropertyDescriptor<Function>) {
        addConfiguration(target);
        target.$$controllerConfiguration.middlewares.push({path, handlerName});
    }
}

export function SendJson(): MethodDecorator {

    return function (target: IObjectWithControllerConfiguration, methodName: string, descriptor: TypedPropertyDescriptor<any>) {
        addConfiguration(target);
        target.$$controllerConfiguration.sendTypes[methodName] = SendType.JSON;
    }
}

export const AdapterParam = parameterDecoratorFactory(ParameterType.ADAPTER_PARAMETER);
export const BodyParam = parameterDecoratorFactory(ParameterType.BODY_PARAMETER);
export const PathParam = parameterDecoratorWithNameFactory(ParameterType.PATH_PARAMETER);
export const QueryParam = parameterDecoratorWithNameFactory(ParameterType.QUERY_PARAMETER);
export const HeaderParam = parameterDecoratorWithNameFactory(ParameterType.HEADER_PARAMETER);
export const CookieParam = parameterDecoratorWithNameFactory(ParameterType.COOKIE_PARAMETER);

export const Get = methodDecoratorFactory('get');
export const Post = methodDecoratorFactory('post');
export const Put = methodDecoratorFactory('put');
export const Delete = methodDecoratorFactory('delete');
export const Patch = methodDecoratorFactory('patch');
