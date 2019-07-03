import { Controller, Get, Res, HttpStatus, Post, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from  'multer';

const options = {
    storage: diskStorage({
        destination: 'assets/files/dynamic/',
        filename: function(req, file, cb) {
            cb(null, 'dynamic_data.json')
        }
    })
};

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

    @Post('/dynamic-data')
    @UseInterceptors(FileInterceptor('file', options))
    uploadJSONData(@UploadedFile() file) {
        console.log(file);
    }
}
