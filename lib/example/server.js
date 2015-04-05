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
    Foo.prototype.index = function (req, res) {
        res.send('ok decorator');
    };
    Foo.prototype.hello = function (req, res, name) {
        res.send("Hello: " + name);
    };
    Foo.prototype.age = function (res, age) {
        res.send(age);
    };
    Foo.prototype.post = function (body, res) {
        res.json(body);
    };
    Object.defineProperty(Foo.prototype, "log", __decorate([decorators_1.Middle()], Foo.prototype, "log", Object.getOwnPropertyDescriptor(Foo.prototype, "log")));
    __decorate([decorators_1.ReqParam()], Foo.prototype, "index", 0);
    __decorate([decorators_1.ResParam()], Foo.prototype, "index", 1);
    Object.defineProperty(Foo.prototype, "index", __decorate([decorators_1.Get()], Foo.prototype, "index", Object.getOwnPropertyDescriptor(Foo.prototype, "index")));
    __decorate([decorators_1.ReqParam()], Foo.prototype, "hello", 0);
    __decorate([decorators_1.ResParam()], Foo.prototype, "hello", 1);
    __decorate([decorators_1.PathParam("name")], Foo.prototype, "hello", 2);
    Object.defineProperty(Foo.prototype, "hello", __decorate([decorators_1.Get('/hello/:name')], Foo.prototype, "hello", Object.getOwnPropertyDescriptor(Foo.prototype, "hello")));
    __decorate([decorators_1.ResParam()], Foo.prototype, "age", 0);
    __decorate([decorators_1.QueryParam("age")], Foo.prototype, "age", 1);
    Object.defineProperty(Foo.prototype, "age", __decorate([decorators_1.Get('/age')], Foo.prototype, "age", Object.getOwnPropertyDescriptor(Foo.prototype, "age")));
    __decorate([decorators_1.BodyParam], Foo.prototype, "post", 0);
    __decorate([decorators_1.ResParam], Foo.prototype, "post", 1);
    Object.defineProperty(Foo.prototype, "post", __decorate([decorators_1.Post()], Foo.prototype, "post", Object.getOwnPropertyDescriptor(Foo.prototype, "post")));
    Foo = __decorate([decorators_1.Route('/bar'), decorators_1.Controller(new ExpressAdapter_1.default(app))], Foo);
    return Foo;
})();
app.listen(3000);
