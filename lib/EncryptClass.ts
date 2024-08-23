import crypto from "crypto";

/**
 * Used to encrypt the passwords.
 */
export default class Encrypt {
    password: string;

    constructor(password: string) {
        this.password = password;
    }

    getSalt(): string {
        const salt = crypto.randomBytes(16).toString('hex');
        return salt;
    }

    hashPassword(): string {
        const hash = crypto.createHash('sha256').update(this.getSalt + this.password).digest('hex');
        return hash;
    }

    getEncodedPassword(): string {
        return this.hashPassword();
    }
}
