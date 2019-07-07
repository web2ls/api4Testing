import { Controller, Get, Res, HttpStatus, Post, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from  'multer';

const singleFileUploadOptions = {
    storage: diskStorage({
        destination: 'assets/files/dynamic/',
        filename: function(req, file, cb) {
            cb(null, 'dynamic_data.json')
        }
    })
};

const multipleFilesUploadOptions = {
    storage: diskStorage({
        destination: 'assets/files/multiple/',
        filename: function(req, file, cb) {
            console.log(file);
            cb(null, file.originalname);
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
    @UseInterceptors(FileInterceptor('file', singleFileUploadOptions))
    uploadJSONData(@UploadedFile() file, @Res() res) {
        console.log(file);
        return res.status(HttpStatus.OK).json({message: 'File has been uploaded'});
    }

    @Post('/upload')
    @UseInterceptors(FilesInterceptor('files', 3, multipleFilesUploadOptions))
    uploadMultipleFiles(@UploadedFiles() files, @Res() res) {
        console.log(files);
        return res.status(HttpStatus.OK).json({message: 'Files has been uploaded'});
    }
}
