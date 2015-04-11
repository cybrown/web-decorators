import * as express from 'express';
import {ExpressAdapterData} from '../src/adapters/ExpressAdapter';
import {Controller, Get, Post, Middle, PathParam, HeaderParam, AdapterParam, BodyParam, QueryParam, SendJson} from '../src/decorators';

@Controller('/bar')
export default class BarController {

    numberOfRequests = 0;

    @Middle()
    log (req: express.Request, res: express.Response, next: Function) {
        console.log(`Request number: ${this.numberOfRequests}`);
        this.numberOfRequests++;
        next();
    }

    @Get()
    index(@HeaderParam('Host') host: string) {
        console.log(host);
        return 'ok decorator';
    }

    @Get('/raw')
    raw (@AdapterParam() {req, res}: ExpressAdapterData) {
        res.send('ok with raw response');
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
    post (@BodyParam body: any) {
        return body;
    }
}
