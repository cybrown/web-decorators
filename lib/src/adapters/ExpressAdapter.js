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
    ExpressAdapter.prototype.createParameterList = function (config, methodName, req, res) {
        var parameters = [];
        if (config.methodsParameters[methodName]) {
            Object.keys(config.methodsParameters[methodName]).forEach(function (_index) {
                var index = parseInt(_index, 10);
                var paramConfig = config.methodsParameters[methodName][index];
                switch (paramConfig.type) {
                    case interfaces_1.ParameterType.PATH_PARAMETER:
                        parameters[index] = req.params[paramConfig.name];
                        break;
                    case interfaces_1.ParameterType.RES_PARAMETER:
                        parameters[index] = res;
                        break;
                    case interfaces_1.ParameterType.REQ_PARAMETER:
                        parameters[index] = req;
                        break;
                    case interfaces_1.ParameterType.BODY_PARAMETER:
                        parameters[index] = req.body;
                        break;
                    case interfaces_1.ParameterType.QUERY_PARAMETER:
                        parameters[index] = req.query[paramConfig.name];
                        break;
                }
            });
        }
        return parameters;
    };
    return ExpressAdapter;
})();
exports.default = ExpressAdapter;
