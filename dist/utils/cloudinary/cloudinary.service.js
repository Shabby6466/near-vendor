"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = class CloudinaryService {
    constructor() {
        this.configured = false;
    }
    ensureConfigured() {
        if (this.configured)
            return;
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!cloudName || !apiKey || !apiSecret)
            return;
        cloudinary_1.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
        });
        this.configured = true;
    }
    isEnabled() {
        return !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET;
    }
    uploadImage(file, opts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!file)
                return { success: false, error: "No file uploaded" };
            this.ensureConfigured();
            if (!this.isEnabled())
                return { success: false, error: "Cloudinary not configured" };
            const folder = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.folder) !== null && _a !== void 0 ? _a : process.env.CLOUDINARY_FOLDER) !== null && _b !== void 0 ? _b : "nearvendor";
            const res = yield new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({
                    folder,
                    public_id: opts === null || opts === void 0 ? void 0 : opts.publicId,
                    resource_type: "image",
                }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                stream.end(file.buffer);
            });
            return {
                success: true,
                imageUrl: (res === null || res === void 0 ? void 0 : res.secure_url) || (res === null || res === void 0 ? void 0 : res.url) || null,
                publicId: (res === null || res === void 0 ? void 0 : res.public_id) || null,
            };
        });
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)()
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map