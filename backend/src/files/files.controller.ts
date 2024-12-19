// files.controller.ts
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage')
  @UseInterceptors(FilesInterceptor('image'))
  async uploadImage(@UploadedFiles() image) {
    try {
      return await this.filesService.handleImageUpload(image);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('uploadFile')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(@UploadedFiles() file) {
    try {
      return await this.filesService.handleFileUpload(file);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('download/:filename')
  async seeUploadedFile(@Param('filename') filename, @Res() res: Response) {
    try {
      const filePath = await this.filesService.downloadFile(filename);
      return res.sendFile(filePath);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('download-image/:imagePath')
  async seeUploadedImage(@Param('imagePath') imagePath, @Res() res: Response) {
    try {
      const filePath = await this.filesService.downloadFile(imagePath);
      return res.sendFile(filePath);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
