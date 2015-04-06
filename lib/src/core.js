var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
var internal_1 = require('./internal');
function addMethodConfiguration(target, methodName, parameterConfiguration) {
    addConfiguration(target);
    if (!target.$$controllerConfiguration.methodsParameters[methodName]) {
        target.$$controllerConfiguration.methodsParameters[methodName] = [];
    }
    target.$$controllerConfiguration.methodsParameters[methodName].push(parameterConfiguration);
}
exports.addMethodConfiguration = addMethodConfiguration;
function tryApplyConfiguration(cls, configuration) {
    if (!configuration.adapter) {
        return;
    }
    if (configuration.timeout) {
        clearTimeout(configuration.timeout);
    }
    configuration.timeout = setTimeout(function () {
        internal_1.applyConfiguration(cls, configuration);
    });
}
exports.tryApplyConfiguration = tryApplyConfiguration;
function addConfiguration(target) {
    if (!target.$$controllerConfiguration) {
        target.$$controllerConfiguration = {
            routes: [],
            middlewares: [],
            adapter: null,
            root: null,
            timeout: null,
            methodsParameters: {}
        };
    }
}
exports.addConfiguration = addConfiguration;
function methodDecoratorFactory(method) {
    return function (path) {
        return function (target, handlerName, descriptor) {
            addConfiguration(target);
            target.$$controllerConfiguration.routes.push({ method: method, path: path, handlerName: handlerName });
        };
    };
}
exports.methodDecoratorFactory = methodDecoratorFactory;
function createParameterList(adapter, config, methodName, adapterRequestData) {
    var parameters = [];
    if (config.methodsParameters[methodName]) {
        config.methodsParameters[methodName].forEach(function (paramConfig) {
            parameters[paramConfig.index] = adapter.getParameterWithConfig(paramConfig, adapterRequestData);
        });
    }
    return parameters;
}
exports.createParameterList = createParameterList;
function callRequestHandler(adapter, handler, controller, configuration, handlerName, adapterRequestData) {
    var result = handler.apply(controller, createParameterList(adapter, configuration, handlerName, adapterRequestData));
    if (result != null) {
        if (typeof result.then === 'function') {
            result.then(function (value) { return adapter.send(value, adapterRequestData); });
        }
        else {
            adapter.send(result, adapterRequestData);
        }
    }
}
exports.callRequestHandler = callRequestHandler;
