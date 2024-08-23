"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
/**
 * Used to encrypt the passwords.
 */
class Encrypt {
    constructor(password) {
        this.password = password;
    }
    getSalt() {
        const salt = crypto_1.default.randomBytes(16).toString('hex');
        return salt;
    }
    hashPassword() {
        const hash = crypto_1.default.createHash('sha256').update(this.getSalt + this.password).digest('hex');
        return hash;
    }
    getEncodedPassword() {
        return this.hashPassword();
    }
}
exports.default = Encrypt;
