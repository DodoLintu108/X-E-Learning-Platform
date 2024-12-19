// files.module.ts
import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './file.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
