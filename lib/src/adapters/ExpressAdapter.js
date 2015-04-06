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
var interfaces_1 = require('../interfaces');
var ExpressAdapter = (function () {
    function ExpressAdapter(app) {
        this.app = app;
    }
    ExpressAdapter.prototype.addMiddleware = function (path, controller, handler) {
        console.log("Add middleware: " + path);
        if (path) {
            this.app.use(path, function (req, res, next) { return handler.call(controller, req, res, next); });
        }
        else {
            this.app.use(function (req, res, next) { return handler.call(controller, req, res, next); });
        }
    };
    ExpressAdapter.prototype.addRoute = function (configuration, method, path, controller, handlerName, handler) {
        var _this = this;
        console.log("Add route: " + method + " " + path);
        this.app[method](path, function (req, res, next) {
            handler.apply(controller, _this.createParameterList(configuration, handlerName, req, res));
        });
    };
    ExpressAdapter.prototype.getParameterWithConfig = function (paramConfig, req, res) {
        switch (paramConfig.type) {
            case interfaces_1.ParameterType.PATH_PARAMETER:
                return req.params[paramConfig.name];
                break;
            case interfaces_1.ParameterType.RES_PARAMETER:
                return res;
                break;
            case interfaces_1.ParameterType.REQ_PARAMETER:
                return req;
                break;
            case interfaces_1.ParameterType.BODY_PARAMETER:
                return req.body;
                break;
            case interfaces_1.ParameterType.QUERY_PARAMETER:
                return req.query[paramConfig.name];
                break;
        }
    };
    ExpressAdapter.prototype.createParameterList = function (config, methodName, req, res) {
        var _this = this;
        var parameters = [];
        if (config.methodsParameters[methodName]) {
            config.methodsParameters[methodName].forEach(function (paramConfig) {
                parameters[paramConfig.index] = _this.getParameterWithConfig(paramConfig, req, res);
            });
        }
        return parameters;
    };
    return ExpressAdapter;
})();
exports.default = ExpressAdapter;
