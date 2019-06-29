import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Controller('api')
export class ApiController {

    @Get('/static-data')
    getStaticData(@Res() res) {
        fs.readFile(join(__dirname, "..", "..", "assets", "files", "static", "static_data.json"), "utf-8", (error, rawData) => {
            if (error) {
                console.log(error);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Not found'});
            }

            const data = JSON.parse(rawData);
            return res.status(HttpStatus.OK).json(data);   
        })
    }

    @Get('/dynamic-data')
    getDynamicData(@Res() res) {
        fs.readFile(join(__dirname, "..", "..", "assets", "files", "dynamic", "dynamic_data.json"), "utf-8", (error, rawData) => {
            if (error) {
                console.log(error);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Not found'});
            }

            const data = JSON.parse(rawData);
            return res.status(HttpStatus.OK).json(data);   
        })
    }
}
