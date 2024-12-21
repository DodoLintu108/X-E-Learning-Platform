export declare class FilesService {
    handleFileUpload(file: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
    }>;
    handleImageUpload(image: Express.Multer.File): Promise<{
        originalname: string;
        filename: string;
    }>;
    downloadFile(filename: string): Promise<string>;
}
