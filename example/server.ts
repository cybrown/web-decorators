import * as express from 'express';
import * as bodyParser from 'body-parser';
import {Controller, Get, Post, Middle, Route, PathParam, ResParam, ReqParam, BodyParam, QueryParam} from '../src/decorators';
import ExpressAdapter from '../src/adapters/ExpressAdapter';
import * as Promise from 'bluebird';

var app = express();
app.use(bodyParser.json());

@Route('/bar')
@Controller(new ExpressAdapter(app))
class Foo {

    numberOfRequests = 0;

    @Middle()
    log (req: express.Request, res: express.Response, next: Function) {
        console.log(`Request number: ${this.numberOfRequests}`);
        this.numberOfRequests++;
        next();
    }

    @Get()
    index() {
        return 'ok decorator';
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

    @Post()
    post (@BodyParam body: any) {
        return body;
    }
}

app.listen(3000);
