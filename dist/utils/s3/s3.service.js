"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const path = __importStar(require("path"));
const enum_1 = require("@utils/enum");
const querystring = __importStar(require("querystring"));
let S3Service = class S3Service {
    constructor() { }
    static imageFilter(req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        const validFileTypes = ['image', 'video'];
        const fileType = file.mimetype.split('/')[0];
        if (!validFileTypes.includes(fileType) || !ext.match(/\.(jpg|png|jpeg|mp4)$/)) {
            callback(new common_1.HttpException({
                message: enum_1.ResponseMessage.INVALID_IMAGE_FORMAT,
                statusCode: enum_1.ResponseCode.BAD_REQUEST,
            }, common_1.HttpStatus.BAD_REQUEST), false);
        }
        callback(null, true);
    }
    static fileFilter(req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        const validFileTypes = ['application', 'image', 'text'];
        const fileType = file.mimetype.split('/')[0];
        if (!validFileTypes.includes(fileType) || !ext.match(/\.(pdf|jpg|png|jpeg|csv)$/)) {
            callback(new common_1.HttpException({
                message: enum_1.ResponseMessage.INVALID_FILE_FORMAT,
                statusCode: enum_1.ResponseCode.BAD_REQUEST,
            }, common_1.HttpStatus.BAD_REQUEST), false);
        }
        callback(null, true);
    }
    getS3() {
        return new aws_sdk_1.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            signatureVersion: 's3v4',
            region: process.env.AWS_REGION,
        });
    }
    upload(file) {
        const bucketS3 = process.env.AWS_BUCKET_NAME;
        const { originalname, buffer, mimetype } = file;
        const mediaName = new Date().toISOString() + '_' + originalname.replace(/\s/g, '');
        return this.uploadS3(buffer, bucketS3, mediaName, mimetype);
    }
    uploadMultiple(files) {
        const bucketS3 = process.env.AWS_BUCKET_NAME;
        return files.map((singleFile) => {
            const { originalname, buffer, mimetype } = singleFile;
            const mediaName = new Date().toISOString() + '_' + originalname.replace(/\s/g, '');
            return this.uploadS3(buffer, bucketS3, mediaName, mimetype);
        });
    }
    uploadS3(file, bucket, name, mimetype) {
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
        }
        catch (err) {
            throw err;
        }
    }
    uploadS3CSVText(doc, mimetype, key) {
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
        }
        catch (err) {
            throw err;
        }
    }
    getPublicURL(key) {
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }
    getSignedURL(key) {
        try {
            const s3 = this.getS3();
            return s3.getSignedUrl('getObject', {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
                Expires: 100000,
            });
        }
        catch (error) {
            throw error;
        }
    }
    getKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3 = this.getS3();
                const keysArray = [];
                const lists = yield s3.listObjects({ Bucket: process.env.AWS_BUCKET_NAME }).promise();
                lists.Contents.forEach((obj) => keysArray.push(obj.Key));
                return keysArray;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteObject(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3 = this.getS3();
                const Bucket = process.env.AWS_BUCKET_NAME;
                yield s3
                    .deleteObject({
                    Bucket,
                    Key: key,
                })
                    .promise();
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getObject(key) {
        const s3 = this.getS3();
        const Bucket = process.env.AWS_BUCKET_NAME;
        return s3.getObject({ Bucket, Key: key }).promise();
    }
    getKeyFromUrl(url) {
        const urlParts = url.split('/');
        const imageKey = urlParts[urlParts.length - 1];
        return querystring.unescape(imageKey);
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3Service);
//# sourceMappingURL=s3.service.js.map