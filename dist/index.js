"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const databaseClass_1 = require("./lib/databaseClass");
const EncryptClass_1 = __importDefault(require("./lib/EncryptClass"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//Middleware functions
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT || 3900;
const ApiKey = process.env.APIKEY;
const dbHost = process.env.MYSQL_HOST;
const dbUser = process.env.MYSQL_USER;
const dbName = process.env.MYSQL_DB;
const dbPassword = process.env.MYSQL_PASSWORD;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.get("/:key", (req, res) => {
    if (req.params.key === ApiKey) {
        res.send("Hello Farts");
        const DB = new databaseClass_1.DBMethods(dbHost, dbUser, dbName, dbPassword);
        DB.connect();
    }
    else {
        res.send("What are you doing here?");
    }
});
app.post("/add-user/:key", (req, res) => {
    if (req.params.key === ApiKey) {
        const DB = new databaseClass_1.DBMethods(dbHost, dbUser, dbName, dbPassword);
        const columns = "email, username, password, loggedIn";
        const password = new EncryptClass_1.default(req.body.password);
        const encodedPassword = password.getEncodedPassword();
        const values = [req.body.email, req.body.username, encodedPassword, 1];
        DB.insert("users", columns, values)
            .then((data) => {
            res.send({
                status: 200,
                message: `${req.body.username} has been addded.`,
            });
            console.log(req.body);
            console.log("User has been added");
        })
            .catch((err) => {
            res.send({
                status: 500,
                message: DB.getSqlError(err),
            });
            console.log("An error has occurred while trying to add the user.");
        });
    }
    else {
        res.send({
            status: 401,
            message: "Please try again with a valid API key.",
        });
    }
});
app.put("/update-user/:key", (req, res) => {
    const DB = new databaseClass_1.DBMethods(dbHost, dbUser, dbName, dbPassword);
    const password = new EncryptClass_1.default(req.body.password);
    const encodedPassword = password.getEncodedPassword();
    DB.updatePerson("users", req.body, encodedPassword)
        .then((data) => {
        res.send({
            status: 200,
            message: `${req.body.username} has been updated.`,
        });
        console.log("Successfully updated the user.");
    })
        .catch((err) => {
        res.send({
            status: 500,
            message: DB.getSqlError(err),
        });
        console.log("ERROR ", err);
    });
});
app.delete("/delete-user/:key", (req, res) => {
    const DB = new databaseClass_1.DBMethods(dbHost, dbUser, dbName, dbPassword);
    DB.deletePerson("users", req.body.id)
        .then((data) => {
        res.send({
            status: 200,
            message: "1 user has been deleted",
        });
        console.log("Success", data);
    })
        .catch((err) => {
        res.send({
            status: 500,
            message: DB.getSqlError(err),
        });
        console.log("Error in deleting a user ", err);
    });
});
app.put("/login-user/:key", (req, res) => {
    const DB = new databaseClass_1.DBMethods(dbHost, dbUser, dbName, dbPassword);
    const userId = req.body.id;
    DB.loginUser("users", "id", userId)
        .then((data) => {
        res.send({
            status: 200,
            message: `${req.body.userName} has been logged in.`,
        });
        console.log("Success! ", `${req.body.userName} has been logged in`);
    })
        .catch((err) => {
        res.send({
            status: 500,
            message: DB.getSqlError(err),
        });
        console.log("Error ", `${req.body.userName} could not be logged in.`);
    });
});
app.put("/logout-user/:key", (req, res) => {
    const DB = new databaseClass_1.DBMethods(dbHost, dbUser, dbName, dbPassword);
    const userId = req.body.id;
    DB.logoutUser('users', userId, 'id')
        .then((data) => {
        res.send({
            "status": 200,
            "message": `${req.body.userName} has been logged out.`
        });
        console.log(`${req.body.userName} has logged out.`);
    })
        .catch((err) => {
        res.send({
            "status": 500,
            "message": `${req.body.userName} could not be logged out.`
        });
        console.log('Error in the logout method ', err);
    });
});
app.get('/get-valid-user/:key', (req, res) => {
    const DB = new databaseClass_1.DBMethods(dbHost, dbUser, dbName, dbPassword);
    const password = new EncryptClass_1.default(req.body.password);
    const encodedPassword = password.getEncodedPassword();
    const userEmail = req.body.email;
    DB.getValidUser('users', 'email', userEmail, 'password', encodedPassword)
        .then((data) => {
        res.send({
            "status": 200,
            "valid": true,
            "message": `Valid user`,
            "data": data
        });
        console.log('Success in getting the user ', data);
    })
        .catch((err) => {
        res.send({
            "status": 500,
            "valid": false,
            "message": `An error has occurred in validating ${userEmail}`
        });
        console.log('Error in get valid user ', err);
    });
});
