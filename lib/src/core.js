var internal_1 = require('./internal');
function addMethodConfiguration(target, methodName) {
    if (!target.$$controllerConfiguration.methodsParameters[methodName]) {
        target.$$controllerConfiguration.methodsParameters[methodName] = {};
    }
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
