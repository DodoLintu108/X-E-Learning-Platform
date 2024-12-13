import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './files.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Default value (not used now, since we are using GridFS)
    }),
  ],
  controllers: [FilesController],
  providers: [FileService], // Add FileService here
})
export class FilesModule {}
