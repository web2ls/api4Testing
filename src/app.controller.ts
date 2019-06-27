import { Controller, Get, Res, HttpStatus, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

const PATH_TO_STATIC_DATA = '/public/files/static_data.json';

@Controller('api')
export class AppController {
    constructor() { }

    @Get('/static-data')
    getStaticData(@Res() res) {
        fs.readFile(join(__dirname, "public", "files", "static_data.json"), "utf-8", (error, rawData) => {
            if (error) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Not found'});
            }
            const data = JSON.parse(rawData);
            return res.status(HttpStatus.OK).json(data);
          

        })
    }
}
