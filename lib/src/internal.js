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
