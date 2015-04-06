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
var core_1 = require('../core');
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
            var result = handler.apply(controller, core_1.createParameterList(_this, configuration, handlerName, { req: req, res: res }));
            if (result != null) {
                if (typeof result.then === 'function') {
                    result.then(function (value) { return res.send(value); });
                }
                else {
                    res.send(result);
                }
            }
        });
    };
    ExpressAdapter.prototype.getParameterWithConfig = function (paramConfig, adapterRequestData) {
        switch (paramConfig.type) {
            case interfaces_1.ParameterType.PATH_PARAMETER:
                return adapterRequestData.req.params[paramConfig.name];
                break;
            case interfaces_1.ParameterType.RES_PARAMETER:
                return adapterRequestData.res;
                break;
            case interfaces_1.ParameterType.REQ_PARAMETER:
                return adapterRequestData.req;
                break;
            case interfaces_1.ParameterType.BODY_PARAMETER:
                return adapterRequestData.req.body;
                break;
            case interfaces_1.ParameterType.QUERY_PARAMETER:
                return adapterRequestData.req.query[paramConfig.name];
                break;
        }
    };
    return ExpressAdapter;
})();
exports.default = ExpressAdapter;
