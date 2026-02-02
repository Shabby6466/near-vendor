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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiVisionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = __importDefault(require("crypto"));
let GeminiVisionService = class GeminiVisionService {
    constructor() {
        this.model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    }
    endpoint() {
        const key = process.env.GEMINI_API_KEY;
        if (!key)
            throw new Error("GEMINI_API_KEY not set");
        return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${key}`;
    }
    sha256(buf) {
        return crypto_1.default.createHash("sha256").update(buf).digest("hex");
    }
    describeImage(image, mimeType, hintText) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = "You are helping a local inventory search app. " +
                "Describe the item in the image as a short shopping query (brand + product + key attributes). " +
                "Return ONLY the query text, no quotes, no extra words.";
            const body = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: hintText ? `${prompt}\nHint: ${hintText}` : prompt },
                            {
                                inlineData: {
                                    mimeType,
                                    data: image.toString("base64"),
                                },
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 64,
                },
            };
            const res = yield fetch(this.endpoint(), {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = (yield res.json());
            if (!res.ok) {
                throw new Error(((_a = json === null || json === void 0 ? void 0 : json.error) === null || _a === void 0 ? void 0 : _a.message) || `Gemini request failed (${res.status})`);
            }
            const text = ((_e = (_d = (_c = (_b = json === null || json === void 0 ? void 0 : json.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e.map((p) => p.text).filter(Boolean).join(" ")) || "";
            return text.trim();
        });
    }
};
exports.GeminiVisionService = GeminiVisionService;
exports.GeminiVisionService = GeminiVisionService = __decorate([
    (0, common_1.Injectable)()
], GeminiVisionService);
//# sourceMappingURL=gemini-vision.service.js.map