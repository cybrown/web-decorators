import {IAdapter, IControllerClass, IObjectWithControllerConfiguration, IPathParameter, IQueryParameter, ParameterType} from './interfaces';
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

export function ResParam(): ParameterDecorator {

    return function (_target: Function, methodName: string, index: number) {
        const target = <IObjectWithControllerConfiguration><any>_target;
        addMethodConfiguration(target, methodName, {index, type: ParameterType.RES_PARAMETER});
    }
}

export function ReqParam(): ParameterDecorator {

    return function (_target: Function, methodName: string, index: number) {
        const target = <IObjectWithControllerConfiguration><any>_target;
        addMethodConfiguration(target, methodName, {index, type: ParameterType.REQ_PARAMETER});
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

export const Get = methodDecoratorFactory('get');
export const Post = methodDecoratorFactory('post');
export const Put = methodDecoratorFactory('put');
export const Delete = methodDecoratorFactory('delete');
export const Patch = methodDecoratorFactory('patch');
