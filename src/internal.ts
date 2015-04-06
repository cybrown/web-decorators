import {IControllerClass, IControllerConfiguration, IAdapter} from './interfaces';

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
