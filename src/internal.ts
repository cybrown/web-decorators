import {IControllerClass, IControllerConfiguration} from './interfaces';

export function createPathWithRoot(root: string, path: string): string {
    if (root && path) {
        if (root[root.length - 1] !== '/' && path[0] !== '/') {
            return root + '/' + path;
        } else if (root[root.length - 1] === '/' && path[0] === '/') {
            return root + path.slice(1);
        } else {
            return root + path;
        }
    } else if (root) {
        return root;
    } else {
        return path;
    }
}

export function applyConfiguration(cls: IControllerClass, configuration: IControllerConfiguration) {
    var instance = new cls();
    configuration.middlewares.forEach(middleware => {
        configuration.adapter.addMiddleware(createPathWithRoot(configuration.root, middleware.path), instance, instance[middleware.handlerName]);
    });
    configuration.routes.forEach(route => {
        configuration.adapter.addRoute(configuration, route.method, createPathWithRoot(configuration.root, route.path), instance, route.handlerName, instance[route.handlerName]);
    });
}
