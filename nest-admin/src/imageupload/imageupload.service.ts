import { S3 } from 'aws-sdk';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ImageUploadService {
  // tslint:disable-next-line: no-empty
  constructor() {}

  async upload(file) {
    const { originalname } = file;
    const bucketS3 = 'nest-image-upload-bucket';
    const uploaded = await this.uploadS3(file.buffer, bucketS3, originalname);
    return uploaded;
  }

  async uploadS3(file, bucket, name) {
      const s3 = this.getS3();
      const params = {
          Bucket: bucket,
          Key: String(name),
          Body: file,
      };
      const _ = new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
          if (err) {
              Logger.error(err);
              reject(err.message);
          }
          resolve(data);
          });
      });

      return params.Key;
  }

  getS3() {
      return new S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
  }
}
