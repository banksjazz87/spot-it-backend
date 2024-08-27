"use strict";
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
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
class Mailer {
    constructor(userEmail, userPassword, sendAddress, password, username) {
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.sendAddress = sendAddress;
        this.password = password;
        this.username = username;
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.userEmail,
                pass: this.userPassword,
            },
        });
    }
    //Used to get the current date as a month/date/year.
    getDate() {
        const date = new Date();
        const stringOfDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return stringOfDate;
    }
    /**
     * @returns Promise<void>
     * @description this is used to send an email.
     */
    sendMail() {
        return __awaiter(this, void 0, void 0, function* () {
            //compiler, being used compile the handlebars template.
            this.transporter.use("compile", hbs({
                viewEngine: {
                    extname: ".hbs",
                    layoutsDir: "templates/",
                    defaultLayout: false,
                    partialsDir: "templates/",
                },
                viewPath: "templates/",
                extName: ".hbs",
            }));
            //Actually sending the email.
            const info = yield this.transporter.sendMail({
                from: `Spot It App <${this.userEmail}>`,
                to: this.sendAddress,
                subject: "Temporary Login Password",
                template: "email_template",
                context: {
                    password: this.password,
                    username: this.username,
                    date: this.getDate(),
                },
            });
            console.log(`Message Sent: ${info.messageId}`);
        });
    }
}
exports.default = Mailer;
