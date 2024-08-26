const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

export default class Mailer {
	userEmail: any;
	userPassword: any;
	sendAddress: any;
	transporter: any;
    emailHTML: any;
    password: string;
    username: string;
	

	constructor(userEmail: any, userPassword: any, sendAddress: string[], password: string, username: string) {
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
	getDate(): string {
		const date = new Date();
		const stringOfDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
		return stringOfDate;
	}

	/**
	 * @returns Promise<void>
	 * @description this is used to send an email.
	 */
	async sendMail(): Promise<void> {
		//compiler, being used compile the handlebars template.
		this.transporter.use(
			"compile",
			hbs({
				viewEngine: {
					extname: ".hbs",
					layoutsDir: "templates/",
					defaultLayout: false,
					partialsDir: "templates/",
				},
				viewPath: "templates/",
				extName: ".hbs",
			})
		);

		//Actually sending the email.
		const info = await this.transporter.sendMail({
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
	}
}
