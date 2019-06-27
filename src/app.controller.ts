import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { join } from 'path';

@Controller()
export class AppController {
    constructor() { }

    @Get()
    getInterface(@Res() res) {
        res.status(HttpStatus.OK).sendFile(join(__dirname, "..", "frontend", "index.html"));
    }
}
