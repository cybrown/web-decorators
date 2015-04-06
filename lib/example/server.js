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
var express = require('express');
var bodyParser = require('body-parser');
var decorators_1 = require('../src/decorators');
var ExpressAdapter_1 = require('../src/adapters/ExpressAdapter');
var Promise = require('bluebird');
var app = express();
app.use(bodyParser.json());
var Foo = (function () {
    function Foo() {
        this.numberOfRequests = 0;
    }
    Foo.prototype.log = function (req, res, next) {
        console.log("Request number: " + this.numberOfRequests);
        this.numberOfRequests++;
        next();
    };
    Foo.prototype.index = function () {
        return 'ok decorator';
    };
    Foo.prototype.asyncIndex = function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve('async ok');
            }, 2000);
        });
    };
    Foo.prototype.hello = function (name) {
        return "Hello: " + name;
    };
    Foo.prototype.age = function (age) {
        return age;
    };
    Foo.prototype.post = function (body) {
        return body;
    };
    Object.defineProperty(Foo.prototype, "log", __decorate([decorators_1.Middle()], Foo.prototype, "log", Object.getOwnPropertyDescriptor(Foo.prototype, "log")));
    Object.defineProperty(Foo.prototype, "index", __decorate([decorators_1.Get()], Foo.prototype, "index", Object.getOwnPropertyDescriptor(Foo.prototype, "index")));
    Object.defineProperty(Foo.prototype, "asyncIndex", __decorate([decorators_1.Get('/async')], Foo.prototype, "asyncIndex", Object.getOwnPropertyDescriptor(Foo.prototype, "asyncIndex")));
    __decorate([decorators_1.PathParam("name")], Foo.prototype, "hello", 0);
    Object.defineProperty(Foo.prototype, "hello", __decorate([decorators_1.Get('/hello/:name')], Foo.prototype, "hello", Object.getOwnPropertyDescriptor(Foo.prototype, "hello")));
    __decorate([decorators_1.QueryParam("age")], Foo.prototype, "age", 0);
    Object.defineProperty(Foo.prototype, "age", __decorate([decorators_1.Get('/age')], Foo.prototype, "age", Object.getOwnPropertyDescriptor(Foo.prototype, "age")));
    __decorate([decorators_1.BodyParam], Foo.prototype, "post", 0);
    Object.defineProperty(Foo.prototype, "post", __decorate([decorators_1.Post()], Foo.prototype, "post", Object.getOwnPropertyDescriptor(Foo.prototype, "post")));
    Foo = __decorate([decorators_1.Route('/bar'), decorators_1.Controller(new ExpressAdapter_1.default(app))], Foo);
    return Foo;
})();
app.listen(3000);
