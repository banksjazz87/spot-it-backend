import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import crypto from "crypto";
import { DBMethods } from "./lib/databaseClass";
import { SQLResponse } from "./interfaces";
import EncryptClass from "./lib/EncryptClass";
import RandomPassword from "./lib/RandomPassword";
import MailerClass from "./lib/MailerClass";

dotenv.config();

const app: Express = express();

//Middleware functions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3900;
const ApiKey = process.env.APIKEY;

const dbHost = process.env.MYSQL_HOST;
const dbUser = process.env.MYSQL_USER;
const dbName = process.env.MYSQL_DB;
const dbPassword = process.env.MYSQL_PASSWORD;

const invalidKeyResponse = {
	status: 404,
	valid: false,
	message: "Please provide a valid API key",
};

app.listen(port, (): void => {
	console.log(`Server is running on port ${port}`);
});

app.get("/:key", (req: Request, res: Response): void => {
	if (req.params.key === ApiKey) {
		res.send("Hello Farts");

		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
		DB.connect();
	} else {
		res.send("What are you doing here?");
	}
});

app.post("/add-user/:key", (req: Request, res: Response): void => {
	if (req.params.key === ApiKey) {
		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
		const columns = "email, username, password, loggedIn";

		const password = new EncryptClass(req.body.password);
		const encodedPassword = password.getEncodedPassword();

		const values = [req.body.email, req.body.username, encodedPassword, 1];

		DB.insert("users", columns, values)
			.then((data: string[]): void => {
				res.send({
					status: 200,
					message: `${req.body.username} has been addded.`,
					data: data
				});

				console.log(req.body);
				console.log("User has been added");
			})
			.catch((err: SQLResponse) => {
				res.send({
					status: 500,
					message: DB.getSqlError(err),
				});
				console.log("An error has occurred while trying to add the user.");
			});
	} else {
		res.send(invalidKeyResponse);
	}
});

app.put("/update-user/:key", (req: Request, res: Response): void => {
	if (req.params.key === ApiKey) {
		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);

		const password = new EncryptClass(req.body.password);
		const encodedPassword = password.getEncodedPassword();

		DB.updatePerson("users", req.body, encodedPassword)
			.then((data: string[]): void => {
				res.send({
					status: 200,
					message: `${req.body.username} has been updated.`,
					data: data
				});
				console.log("Successfully updated the user.");
			})

			.catch((err: SQLResponse): void => {
				res.send({
					status: 500,
					message: DB.getSqlError(err),
				});
				console.log("ERROR ", err);
			});
	} else {
		res.send(invalidKeyResponse);
	}
});

app.delete("/delete-user/:key", (req: Request, res: Response): void => {
	if (req.params.key === ApiKey) {
		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);

		DB.deletePerson("users", req.body.id)
			.then((data: string[]): void => {
				res.send({
					status: 200,
					message: "1 user has been deleted",
					data: data
				});
				console.log("Success", data);
			})
			.catch((err: SQLResponse): void => {
				res.send({
					status: 500,
					message: DB.getSqlError(err),
				});
				console.log("Error in deleting a user ", err);
			});
	} else {
		res.send(invalidKeyResponse);
	}
});

app.put("/login-user/:key", (req: Request, res: Response): void => {
	if (req.params.key === ApiKey) {
		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
		const userId = req.body.id;

		DB.loginUser("users", "id", userId)
			.then((data: string[]): void => {
				res.send({
					status: 200,
					message: `${req.body.username} has been logged in.`,
					data: data
				});
				console.log("Success! ", `${req.body.username} has been logged in`);
			})
			.catch((err: SQLResponse): void => {
				res.send({
					status: 500,
					message: DB.getSqlError(err),
				});
				console.log("Error ", `${req.body.username} could not be logged in.`);
			});
	} else {
		res.send(invalidKeyResponse);
	}
});

app.put("/logout-user/:key", (req: Request, res: Response): void => {
	if (req.params.key === ApiKey) {
		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
		const userId = req.body.id;

		DB.logoutUser("users", userId, "id")
			.then((data: string[]): void => {
				res.send({
					status: 200,
					message: `${req.body.username} has been logged out.`,
					data: data
				});
				console.log(`${req.body.username} has logged out.`);
			})
			.catch((err: SQLResponse): void => {
				res.send({
					status: 500,
					message: `${req.body.username} could not be logged out.`,
				});
				console.log("Error in the logout method ", err);
			});
	} else {
		res.send(invalidKeyResponse);
	}
});

app.get("/get-valid-user/:key/:email/:password", (req: Request, res: Response): void => {
	if (req.params.key === ApiKey) {
		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
		const password = new EncryptClass(req.params.password);
		const encodedPassword = password.getEncodedPassword();
		const userEmail = req.params.email;

		DB.getValidUser("users", "email", userEmail, "password", encodedPassword)
			.then((data: string[]): void => {
				res.send({
					status: 200,
					message: `Valid user`,
					data: data,
				});
			})
			.catch((err: SQLResponse): void => {
				res.send({
					status: 500,
					message: `An error has occurred in validating ${userEmail}`,
				});
				console.log("Error in get valid user ", err);
			});
	} else {
		res.send(invalidKeyResponse);
	}
});

app.put("/set-random-password/:key", (req: Request, res: Response): void => {
	if (req.params.key === ApiKey) {
		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
		const password = new RandomPassword(12).getPassword();
		const encodedPassword = new EncryptClass(password).getEncodedPassword();

		const Email = new MailerClass(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD, [req.body.email], password, req.body.username);

		Promise.all([DB.createRandomPassword("users", "tempPassword", encodedPassword, "id", req.body.id), Email.sendMail()])
			.then((data: [string[], void]): void => {
				res.send({
					status: 200,
					message: `Temp password has been sent`,
					data: data
				});

				console.log("temp password created.");
			})

			.catch((err: SQLResponse | any): void => {
				res.send({
					status: 500,
					message: DB.getSqlError(err),
				});
				console.log("SQL Error ", err);
			});
	} else {
		res.send(invalidKeyResponse);
	}
});


app.get('/get-user-by-email/:key/:email', (req: Request, res: Response): void => {
	
	if (req.params.key === ApiKey) {
		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
		const email = req.params.email;

		DB.getUser('users', 'email', email)
			.then((data: string[]): void => {
				res.send({
					status: 200,
					message: 'User Retrieved',
					data: data
				});
				console.log('The user\'s data has been retrieved ', data);
			})
			.catch((err: SQLResponse): void => {
				res.send({
					status: 500,
					message: DB.getSqlError(err),
				});
				console.log("SQL Error ", err);
			});
	} else {
		res.send(invalidKeyResponse);
	}
});


app.get('/username/:key/:username', (req: Request, res: Response): void => {
	if (req.params.key === ApiKey) {
		const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
		const username = req.params.username;

		DB.getUser('users', 'username', username)
			.then((data: string[]): void => {
				res.send({
					status: 200,
					message: 'User retrieved',
					data: data
				});
				console.log(`${username} was found in the database `, data);
			})
			.catch((error: SQLResponse): void => {
				res.send({
					status: 500,
					message: DB.getSqlError(error)
				});
				console.log(`There has been an error with this request `, DB.getSqlError(error));
			});
	} else {
		res.send(invalidKeyResponse);
	}
})

