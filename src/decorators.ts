import {IAdapter, IControllerClass, IObjectWithControllerConfiguration, IPathParameter, IQueryParameter, ParameterType, SendType} from './interfaces';
import {addConfiguration, tryApplyConfiguration, addMethodConfiguration, methodDecoratorFactory} from './core';

export function Controller(adapter: IAdapter): ClassDecorator {

    return function (target: IControllerClass) {
        addConfiguration(target.prototype);
        target.prototype.$$controllerConfiguration.adapter = adapter;
        tryApplyConfiguration(target, target.prototype.$$controllerConfiguration);
    };
}

export function Route(root: string): ClassDecorator {

    return function (target: IControllerClass) {
        addConfiguration(target.prototype);
        target.prototype.$$controllerConfiguration.root = root;
        tryApplyConfiguration(target, target.prototype.$$controllerConfiguration);
    }
}

export function Middle (path?: string): MethodDecorator {

    return function (target: IObjectWithControllerConfiguration, handlerName: string, descriptor: TypedPropertyDescriptor<Function>) {
        addConfiguration(target);
        target.$$controllerConfiguration.middlewares.push({path, handlerName});
    }
}

export function PathParam(name: string): ParameterDecorator {

    return function (_target: Function, methodName: string, index: number) {
        const target = <IObjectWithControllerConfiguration><any>_target;
        const parameterInfo: IPathParameter = {index, name, type: ParameterType.PATH_PARAMETER};
        addMethodConfiguration(target, methodName, parameterInfo);
    };
}

export function AdapterParam(): ParameterDecorator {

    return function (_target: Function, methodName: string, index: number) {
        const target = <IObjectWithControllerConfiguration><any>_target;
        addMethodConfiguration(target, methodName, {index, type: ParameterType.ADAPTER_PARAMETER});
    }
}

export function BodyParam(): ParameterDecorator {

    return function (_target: Function, methodName: string, index: number) {
        const target = <IObjectWithControllerConfiguration><any>_target;
        addMethodConfiguration(target, methodName, {index, type: ParameterType.BODY_PARAMETER});
    }
}

export function QueryParam(name: string): ParameterDecorator {

    return function (_target: Function, methodName: string, index: number) {
        const target = <IObjectWithControllerConfiguration><any>_target;
        const parameterInfo: IQueryParameter = {index, name, type: ParameterType.QUERY_PARAMETER};
        addMethodConfiguration(target, methodName, parameterInfo);
    };
}

export function SendJson(): MethodDecorator {

    return function (target: IObjectWithControllerConfiguration, methodName: string, descriptor: TypedPropertyDescriptor<any>) {
        addConfiguration(target);
        target.$$controllerConfiguration.sendTypes[methodName] = SendType.JSON;
    }
}

export const Get = methodDecoratorFactory('get');
export const Post = methodDecoratorFactory('post');
export const Put = methodDecoratorFactory('put');
export const Delete = methodDecoratorFactory('delete');
export const Patch = methodDecoratorFactory('patch');
