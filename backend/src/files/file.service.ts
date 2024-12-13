import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage';
import * as multer from 'multer';

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

  getStorage() {
    return this.storage;
  }
}
