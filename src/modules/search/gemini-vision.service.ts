import { Injectable } from "@nestjs/common";
import crypto from "crypto";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

@Injectable()
export class GeminiVisionService {
  private model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  private endpoint() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY not set");
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${key}`;
  }

  sha256(buf: Buffer) {
    return crypto.createHash("sha256").update(buf).digest("hex");
  }

  async describeImage(image: Buffer, mimeType: string, hintText?: string) {
    const prompt =
      "You are helping a local inventory search app. " +
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

    const res = await fetch(this.endpoint(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as GeminiResponse;
    if (!res.ok) {
      throw new Error((json as any)?.error?.message || `Gemini request failed (${res.status})`);
    }

    const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join(" ") || "";
    return text.trim();
  }
}
