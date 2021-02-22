import { Module } from '@nestjs/common';
import { ImageUploadController } from './imageupload.controller';
import { ImageUploadService } from './imageupload.service';

@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
  exports: [ImageUploadService]
})
export class ImageuploadModule {}
