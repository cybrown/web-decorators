web-decorators
==============
Decorator based api for express or any web server framework.

Prerequisites
-------------

Tested with nodejs 0.12, built with Typescript 1.5.0-alpha (provided in the dependencies).

Installation
------------

 - Run `npm install` to install the dependencies and typing definition.
 - Run `npm run build` to build the typescript source files to the /lib directory.

Features
--------

 - Define classes as controllers
 - Define root path for an entier controller
 - Define routes on get, post, put, delete and patch
 - Define middlewares on routes
 - Inject data from the query string, path parameter or entire body
 - Force send Json data
 - Inject the backend object to use directly the underlying framework if needed
 - Abstract the underlying framework in front of an adapter (express is provided)

Example
-------

The typescript example is in the /example directory, build the project with `npm run build` and run `node lib/example/server.js`

Decorator API
-------------

@Controller(adapter): Defines a class as a controller, the parameter is an adapter to a backend (express adapter is included).

@Route(path): Define a root path for a controller.

@Get(path), @Post(path), @Put(path), @Delete(path): Define a method as an handler for an HTTP verb.
If @Route is used on the controller, both are concatenated.
The result can be directly returned with a return statement, or a promise can be used for an asynchronous result.

@Middle(path?): Set a middleware on path.
If @Route is used on the controller, both are concatenated.

@PathParam(name), @QueryParam(name), @BodyParam(), @HeaderParam(), @CookieParam(): Define a handler parameter to receive data from the request path parameters, query string or body.

@AdapterParam(): Define a handler parameter as an object defined by the backend implementation, with express, this object contains res as the http response and req as the http request.

Adapters
--------

The API can use any class implementing the IAdapter interface, the express adapter is provided.

An adapter must provide the following methods:
 - addMiddleware: add a middleware, optionally on a specific path
 - addRoute: register an handler on a specific method and path
 - send: send raw data to the client, with status code and headers
 - sendJson: send data as json to the client, with status code and headers
 - getParameterWithConfig: extract a parameter (from query string, path param...) with the provided configuration

The backend is free to use any kind of request and response shape, so it does not assume that something like node's http request and response are used.
