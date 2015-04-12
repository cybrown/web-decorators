import * as express from 'express';
import {ExpressAdapterData} from '../src/adapters/ExpressAdapter';
import {Controller, Get, Post, Middle, PathParam, HeaderParam, CookieParam, AdapterParam, BodyParam, QueryParam, SendJson} from '../src/decorators';
import {ResponseMetadata} from '../src/core';

@Controller('/bar')
export default class BarController {

    numberOfRequests = 0;

    @Middle()
    log (@AdapterParam() {req, res}: ExpressAdapterData, next: Function) {
        console.log(`Request number: ${this.numberOfRequests}`);
        this.numberOfRequests++;
        next();
    }

    @Get()
    index(@HeaderParam('Host') host: string) {
        console.log(host);
        return new ResponseMetadata('ok decorator');
    }

    @Get('/redir')
    redirect() {
        return new ResponseMetadata(302).append('Location', '/bar/redir-target');
    }

    @Get('/redir-target')
    redirectTarget(@HeaderParam('referer') referer: string) {
        return new ResponseMetadata(200, 'Redirect OK !');
    }

    @Get('/raw')
    raw (@AdapterParam() {req, res}: ExpressAdapterData) {
        res.send('ok with raw response');
    }

    @Get('/cookie')
    cookie (@CookieParam('sessionId') sessionId: string) {
        return sessionId;
    }

    @Get('/async')
    asyncIndex () {
        return new Promise<string>((resolve: (result: string) => void, reject) => {
            setTimeout(() => {
                resolve('async ok');
            }, 2000);
        });
    }

    @Get('/hello/:name')
    hello (@PathParam("name") name: string) {
        return `Hello: ${name}`;
    }

    @Get('/age')
    age (@QueryParam("age") age: string) {
        return age;
    }

    @Get('/jsonstr')
    @SendJson()
    json () {
        return "json string !"
    }

    @Post()
    post (@BodyParam() body: any) {
        return body;
    }
}
