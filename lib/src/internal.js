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
function createPathWithRoot(root, path) {
    if (root && path) {
        if (root[root.length - 1] !== '/' && path[0] !== '/') {
            return root + '/' + path;
        }
        else if (root[root.length - 1] === '/' && path[0] === '/') {
            return root + path.slice(1);
        }
        else {
            return root + path;
        }
    }
    else if (root) {
        return root;
    }
    else {
        return path;
    }
}
exports.createPathWithRoot = createPathWithRoot;
function applyConfiguration(cls, configuration) {
    var instance = new cls();
    configuration.middlewares.forEach(function (middleware) {
        configuration.adapter.addMiddleware(createPathWithRoot(configuration.root, middleware.path), instance, instance[middleware.handlerName]);
    });
    configuration.routes.forEach(function (route) {
        configuration.adapter.addRoute(configuration, route.method, createPathWithRoot(configuration.root, route.path), instance, route.handlerName, instance[route.handlerName]);
    });
}
exports.applyConfiguration = applyConfiguration;
