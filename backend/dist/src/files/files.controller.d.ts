import { FilesService } from './file.service';
import { Response } from 'express';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadImage(image: any): Promise<{
        originalname: string;
        filename: string;
    }>;
    uploadFile(file: any): Promise<{
        originalname: string;
        filename: string;
    }>;
    seeUploadedFile(filename: any, res: Response): Promise<void>;
    seeUploadedImage(imagePath: any, res: Response): Promise<void>;
}
