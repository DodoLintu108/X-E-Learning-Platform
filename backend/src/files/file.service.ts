// file.service.ts
import { Injectable } from '@nestjs/common';
import { GridFsStorage } from 'multer-gridfs-storage';
import * as mongoose from 'mongoose';

@Injectable()
export class FileService {
  private storage;

  constructor() {
    const mongoURI =
      'mongodb+srv://abdelrhmanmersal:merso2003@main.y2sz6.mongodb.net/main?retryWrites=true&w=majority'; // Replace with your MongoDB URI
    this.storage = new GridFsStorage({
      url: mongoURI,
      file: (req, file) => {
        return {
          bucketName: 'courseFiles', // The collection name to store files
          filename: file.originalname, // Filename in MongoDB
        };
      },
    });
  }

  // This method is used to get the configured storage for file uploads
  getStorage() {
    return this.storage;
  }
}
