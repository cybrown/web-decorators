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
(function (ParameterType) {
    ParameterType[ParameterType["PATH_PARAMETER"] = 0] = "PATH_PARAMETER";
    ParameterType[ParameterType["ADAPTER_PARAMETER"] = 1] = "ADAPTER_PARAMETER";
    ParameterType[ParameterType["BODY_PARAMETER"] = 2] = "BODY_PARAMETER";
    ParameterType[ParameterType["QUERY_PARAMETER"] = 3] = "QUERY_PARAMETER";
})(exports.ParameterType || (exports.ParameterType = {}));
var ParameterType = exports.ParameterType;
