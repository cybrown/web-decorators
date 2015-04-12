import {IControllerClass, IObjectWithControllerConfiguration, IControllerConfiguration, IParameterConfiguration, IAdapter, SendType, Header, ParameterType, IQueryParameter, IWebDecoratorApi} from './interfaces';
import * as internal from './internal';
import {unwrapAsyncValue, Optional} from './util';

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
        return this;
    }

    replace(field: string, value: string) {
        this.findHeaderByField(field)
            .ifPresent(header => header.value = value)
            .orElse(() => this.append(field, value));
        return this;
    }

    private findHeaderByField(field: string): Optional<Header> {
        return Optional.of(this._headers.filter(header => header.field == field)[0]);
    }
}

export class DecoratedAppBootstraper {

    controllers: IControllerClass[] = [];

    constructor (protected adapter: IAdapter, protected webDecoratorApi: IWebDecoratorApi) {
        adapter.setWebDecoratorApi(webDecoratorApi);
    }

    controller (controllerClass: any): DecoratedAppBootstraper {
        this.controllers.push(controllerClass);
        return this;
    }

    start (): DecoratedAppBootstraper {
        this.controllers.forEach(controllerClass => this.webDecoratorApi.applyConfiguration(this.adapter, controllerClass));
        return this;
    }
}

export class WebDecoratorApi implements IWebDecoratorApi {

    callRequestHandler (adapter: IAdapter, handler: Function, controller: any, configuration: IControllerConfiguration, handlerName: string, adapterRequestData: any, next: Function) {
        return internal.callRequestHandler(adapter, handler, controller, configuration, handlerName, adapterRequestData, next);
    }

    applyConfiguration (adapter: IAdapter, cls: IControllerClass) {
        return internal.applyConfiguration(adapter, cls);
    }
}

export const defaultWebDecoratorApi = new WebDecoratorApi();
