import { Controller, Get, Res, HttpStatus, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { getUnpackedSettings } from 'http2';

const PATH_TO_STATIC_DATA = '/public/files/static_data.json';

@Controller()
export class AppController {
    constructor() { }

    @Get()
    getInterface(@Res() res) {
        res.status(HttpStatus.OK).sendFile(join(__dirname, "..", "frontend", "index.html"));
    }

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
