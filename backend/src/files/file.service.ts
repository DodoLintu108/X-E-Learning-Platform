// files.service.ts
import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FilesService {
  async handleFileUpload(file: Express.Multer.File) {
    // You can add logic here to handle file storage, validation, or other operations
    if (!file) {
      throw new Error('No file uploaded!');
    }
    return {
      originalname: file.originalname,
      filename: file.filename,
    };
  }

  async handleImageUpload(image: Express.Multer.File) {
    if (!image) {
      throw new Error('No image uploaded!');
    }
    return {
      originalname: image.originalname,
      filename: image.filename,
    };
  }

  async downloadFile(filename: string) {
    const filePath = join(__dirname, '..', 'uploads', filename);
    try {
      await fs.access(filePath); // Check if the file exists
      return filePath;
    } catch (error) {
      throw new Error('File not found!');
    }
  }
}
