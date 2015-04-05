web-decorators
==============

# Prerequisites

Tested with nodejs 0.12, built with Typescript 1.5.0-alpha (provided in the dependencies).

# Installation

Run npm install to install the dependencies and typing definition.
Run npm script build to build the typescript source files to the /lib directory.

# Example

The typescript example is in the /example directory, build the project and run node lib/example/server.js

# API

@Controller(adapter): Defines a class as a controller, the parameter is an adapter to a backend (express adapter is included).

@Route(path): Define a root path for a controller.

@Get(path), @Post(path), @Put(path), Delete(path): Define a method as an handler for an HTTP verb.

@PathParam(name), @QueryParam(name), @BodyParam: Define a handler parameter to receive data from the request path parameters, query string or body.

@ReqParam(), @ResParam(): Define a handler parameter as a raw request or response.
