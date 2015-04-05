import * as express from 'express';
import * as bodyParser from 'body-parser';
import {Controller, Get, Post, Middle, Route, PathParam, ResParam, ReqParam, BodyParam, QueryParam} from '../src/decorators';
import ExpressAdapter from '../src/adapters/ExpressAdapter';

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
    index(@ReqParam() req, @ResParam() res) {
        res.send('ok decorator');
    }

    @Get('/hello/:name')
    hello (@ReqParam() req, @ResParam() res: express.Response, @PathParam("name") name: string) {
        res.send(`Hello: ${name}`);
    }

    @Get('/age')
    age (@ResParam() res, @QueryParam("age") age: string) {
        res.send(age)
    }

    @Post()
    post(@BodyParam body: any, @ResParam res: express.Response) {
        res.json(body);
    }
}

app.listen(3000);
