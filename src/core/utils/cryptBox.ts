import * as bcrypt from "bcryptjs";

export class CryptBox {
  async hashString(string: string): Promise<string> {
    return await bcrypt.hash(string, await bcrypt.genSalt(10));
  }
  async verifyHash(hash: string, string: string): Promise<boolean> {
    return await bcrypt.compare(string, hash);
  }
}
