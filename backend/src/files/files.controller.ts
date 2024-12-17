import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service'; // Import the file service

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
   //   storage: this.fileService.getStorage(), // Use GridFS storage
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not uploaded!');
    }

    // TypeScript will now know that file is not undefined
    return {
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
    };
  }


  // @Get(`view/:filename`)
  // async serveFile(@Param('filename') filename: string) {
  //   return {
  //     file: filename,
  //   };
  // }


}
