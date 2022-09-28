import { sign, verify } from "jsonwebtoken";
export const jwt = {
  createToken(data: {}) {
    return sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
  },
  decodeToken(token: string) {
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded;
  },
};
