"use strict";
/**
 * @param takes on a parameter of number for how long you would like the password to be.
 * Used to generate a random password.
 */
Object.defineProperty(exports, "__esModule", { value: true });
class RandomPassword {
    constructor(length) {
        this.bank = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        this.length = length;
    }
    getBankArray() {
        const array = this.bank.split("");
        return array;
    }
    getRandomNumber() {
        const array = this.getBankArray();
        const random = Math.floor(Math.random() * array.length);
        return random;
    }
    getPassword() {
        let password = "";
        const bankArray = this.getBankArray();
        for (let i = 0; i < this.length; i++) {
            let index = this.getRandomNumber();
            password += bankArray[index];
        }
        return password;
    }
}
exports.default = RandomPassword;
