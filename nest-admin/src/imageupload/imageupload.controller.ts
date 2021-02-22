import { Controller, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './imageupload.service';
import * as path from 'path';

@Controller('imageupload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file) {
    const upload = await this.imageUploadService.upload(file);
    // console.log(path.join('https://nest-image-upload-bucket.s3.ap-northeast-2.amazonaws.com/',`${upload}`));
    return {
      url: `https://nest-image-upload-bucket.s3.ap-northeast-2.amazonaws.com/${upload}`
    }
  }
}
