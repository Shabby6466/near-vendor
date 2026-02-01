import * as bcrypt from "bcryptjs";

export class Hash {
  static async make(plainText: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainText, salt);
  }

  static async compare(plainText: string, hash: string) {
    return bcrypt.compare(plainText, hash);
  }
}
