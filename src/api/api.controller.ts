import { Controller, Get, Res, HttpStatus, Post, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from  'multer';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

const MAX_FILES_COUNT = 12;
const MAX_TOTAL_SPACE = 100;

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
            cb(null, file.originalname);
        },
    }),
    fileFilter: async function(req, file, cb) {
        const pathToDir = join(__dirname, "..", "..", "assets", "files", "multiple");
        try {
            const files = await getFilesInDir(pathToDir);
            const fileSizes = await getFileSizes(files, pathToDir);
            const checkResult = checkSpaceLimit(fileSizes);
            if (checkResult)
                return cb(null, true);
            else
                return cb(new Error('Error on upload'));
        } catch(error) {
            return cb(new Error('Error on upload'));
        }

    }
};

function getFilesInDir(pathToDir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(pathToDir, function(error, files) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(files);
            }
        })
    })
}

function getFileSizes(fileNames: string[], pathToDir: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
        const fileSizes = [];
        fileNames.forEach(item => {
            fileSizes.push(getFileSize(item, pathToDir));
        });
        Promise.all(fileSizes).then(res => {
            resolve(res);
        })
        .catch(error => {
            reject(error);
        })
    })
}

function getFileSize(filename: string, pathToDir: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const pathToFile = `${pathToDir}/${filename}`;
        fs.lstat(pathToFile, function(error, stats) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(stats.size);
            }
        })
    })
}

function checkSpaceLimit(fileSizes: number[]): boolean {
    const total = fileSizes.reduce((current, next) => {
        current += next;
        return current;
    }, 0)
    console.log('total size is ', total);
    return (total / 1000000) < MAX_TOTAL_SPACE ? true : false;
}

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
    @UseInterceptors(FilesInterceptor('files', MAX_FILES_COUNT, multipleFilesUploadOptions))
    uploadMultipleFiles(@UploadedFiles() files, @Res() res) {
        console.log(files);
        return res.status(HttpStatus.OK).json({message: 'Files has been uploaded'});
    }
}
