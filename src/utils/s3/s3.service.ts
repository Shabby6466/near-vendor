import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { ResponseCode, ResponseMessage } from '@utils/enum';
import * as querystring from 'querystring';

@Injectable()
export class S3Service {
  constructor() {}

  /**
   * @param req
   * @param file
   * @param callback
   */
  static imageFilter(this: void, req, file: Express.Multer.File, callback): void {
    const ext = path.extname(file.originalname).toLowerCase();
    const validFileTypes = ['image', 'video'];
    const fileType = file.mimetype.split('/')[0];
    if (!validFileTypes.includes(fileType) || !ext.match(/\.(jpg|png|jpeg|mp4)$/)) {
      callback(
        new HttpException(
          {
            message: ResponseMessage.INVALID_IMAGE_FORMAT,
            statusCode: ResponseCode.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    callback(null, true);
  }

  static fileFilter(this: void, req, file: Express.Multer.File, callback): void {
    const ext = path.extname(file.originalname).toLowerCase();
    const validFileTypes = ['application', 'image', 'text'];
    const fileType = file.mimetype.split('/')[0];
    if (!validFileTypes.includes(fileType) || !ext.match(/\.(pdf|jpg|png|jpeg|csv)$/)) {
      callback(
        new HttpException(
          {
            message: ResponseMessage.INVALID_FILE_FORMAT,
            statusCode: ResponseCode.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    callback(null, true);
  }

  /**
   * @returns
   */
  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      signatureVersion: 's3v4',
      region: process.env.AWS_REGION,
    });
  }

  /**
   * @param file
   * @returns
   */
  upload(file: Express.Multer.File) {
    const bucketS3 = process.env.AWS_BUCKET_NAME;
    const { originalname, buffer, mimetype } = file;
    const mediaName = new Date().toISOString() + '_' + originalname.replace(/\s/g, '');
    return this.uploadS3(buffer, bucketS3, mediaName, mimetype);
  }

  uploadMultiple(files: Express.Multer.File[]) {
    const bucketS3 = process.env.AWS_BUCKET_NAME;
    return files.map((singleFile) => {
      const { originalname, buffer, mimetype } = singleFile;
      const mediaName = new Date().toISOString() + '_' + originalname.replace(/\s/g, '');
      return this.uploadS3(buffer, bucketS3, mediaName, mimetype);
    });
  }

  /**
   * @param file
   * @param bucket
   * @param name
   * @param mimetype
   * @returns
   */
  uploadS3(file: any, bucket: string, name, mimetype?) {
    try {
      const s3 = this.getS3();
      const params = {
        acl: 'public-read',
        Bucket: bucket,
        Key: name,
        ContentType: mimetype,
        Body: file,
      };
      return s3.upload(params).promise();
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param doc
   * @param mimetype
   * @returns
   */

  uploadS3CSVText(doc: string, mimetype: string, key: string) {
    try {
      const s3 = this.getS3();
      const bucketS3 = process.env.AWS_BUCKET_NAME;
      const params = {
        Bucket: bucketS3,
        Key: `${key}${Date.now()}.csv`,
        ContentType: mimetype,
        Body: doc,
      };
      return s3.upload(params).promise();
    } catch (err) {
      throw err;
    }
  }

  getPublicURL(key: string) {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  /**
   * @param Key
   * @returns
   */
  getSignedURL(key) {
    try {
      const s3 = this.getS3();
      return s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Expires: 100000,
      });
    } catch (error) {
      throw error;
    }
  }

  public async getKeys() {
    try {
      const s3 = this.getS3();
      const keysArray: string[] = [];
      const lists = await s3.listObjects({ Bucket: process.env.AWS_BUCKET_NAME }).promise();
      lists.Contents.forEach((obj) => keysArray.push(obj.Key));
      return keysArray;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param Key
   * @returns
   */
  async deleteObject(key: string) {
    try {
      const s3 = this.getS3();
      const Bucket = process.env.AWS_BUCKET_NAME;
      await s3
        .deleteObject({
          Bucket,
          Key: key,
        })
        .promise();
      return;
    } catch (error) {
      throw error;
    }
  }

  getObject(key: string) {
    const s3 = this.getS3();
    const Bucket = process.env.AWS_BUCKET_NAME;
    return s3.getObject({ Bucket, Key: key }).promise();
  }

  getKeyFromUrl(url: string) {
    const urlParts = url.split('/');
    const imageKey = urlParts[urlParts.length - 1];
    return querystring.unescape(imageKey);
  }
}
