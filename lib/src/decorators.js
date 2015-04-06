var interfaces_1 = require('./interfaces');
var core_1 = require('./core');
function Controller(adapter) {
    return function (target) {
        core_1.addConfiguration(target.prototype);
        target.prototype.$$controllerConfiguration.adapter = adapter;
        core_1.tryApplyConfiguration(target, target.prototype.$$controllerConfiguration);
    };
}
exports.Controller = Controller;
function Route(root) {
    return function (target) {
        core_1.addConfiguration(target.prototype);
        target.prototype.$$controllerConfiguration.root = root;
        core_1.tryApplyConfiguration(target, target.prototype.$$controllerConfiguration);
    };
}
exports.Route = Route;
function Middle(path) {
    return function (target, handlerName, descriptor) {
        core_1.addConfiguration(target);
        target.$$controllerConfiguration.middlewares.push({ path: path, handlerName: handlerName });
    };
}
exports.Middle = Middle;
function PathParam(name) {
    return function (_target, methodName, index) {
        var target = _target;
        var parameterInfo = { index: index, name: name, type: interfaces_1.ParameterType.PATH_PARAMETER };
        core_1.addMethodConfiguration(target, methodName, parameterInfo);
    };
}
exports.PathParam = PathParam;
function ResParam() {
    return function (_target, methodName, index) {
        var target = _target;
        core_1.addMethodConfiguration(target, methodName, { index: index, type: interfaces_1.ParameterType.RES_PARAMETER });
    };
}
exports.ResParam = ResParam;
function ReqParam() {
    return function (_target, methodName, index) {
        var target = _target;
        core_1.addMethodConfiguration(target, methodName, { index: index, type: interfaces_1.ParameterType.REQ_PARAMETER });
    };
}
exports.ReqParam = ReqParam;
function BodyParam() {
    return function (_target, methodName, index) {
        var target = _target;
        core_1.addMethodConfiguration(target, methodName, { index: index, type: interfaces_1.ParameterType.BODY_PARAMETER });
    };
}
exports.BodyParam = BodyParam;
function QueryParam(name) {
    return function (_target, methodName, index) {
        var target = _target;
        var parameterInfo = { index: index, name: name, type: interfaces_1.ParameterType.QUERY_PARAMETER };
        core_1.addMethodConfiguration(target, methodName, parameterInfo);
    };
}
exports.QueryParam = QueryParam;
exports.Get = core_1.methodDecoratorFactory('get');
exports.Post = core_1.methodDecoratorFactory('post');
exports.Put = core_1.methodDecoratorFactory('put');
exports.Delete = core_1.methodDecoratorFactory('delete');
exports.Patch = core_1.methodDecoratorFactory('patch');
