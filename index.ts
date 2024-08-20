import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import crypto from "crypto";
import { DBMethods } from "./lib/databaseClass";
import { SQLResponse } from "./interfaces";

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

app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});

app.get('/:key', (req: Request, res: Response): void => {
    if (req.params.key === ApiKey) {
        res.send("Hello Farts");

        const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
        DB.connect();
    } else {
        res.send('What are you doing here?');
    }
});

app.post('/add-user/:key', (req: Request, res: Response): void => {
    if (req.params.key === ApiKey) {
        const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);
        const columns = 'email, username, password, loggedIn';
        
        const password = crypto.createHash('sha256', req.body.password);
        const encodedPassword = password.digest('hex');

        const values = [req.body.email, req.body.username, encodedPassword, 1];

        DB.insert('users', columns, values)
            .then((data: string[]): void => {
                res.send({
                    "status": 200,
                    "message": `${req.body.username} has been addded.`
                });

                console.log(req.body);
                console.log('User has been added');
            })
            .catch((err: SQLResponse) => {
                res.send({
                    "status": 500,
                    "message": DB.getSqlError(err)
                })
                console.log('An error has occurred while trying to add the user.')
            });
    } else {
        res.send({
            "status": 401,
            "message": "Please try again with a valid API key."
        });
    }
});

app.put('/update-user/:key', (req: Request, res: Response): void => {
    const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);

    const password = crypto.createHash("sha256", req.body.password);
    const encodedPassword = password.digest("hex");

    DB.updatePerson("users", req.body, encodedPassword)
        .then((data: string[]): void => {
            res.send({
                "status": 200,
                "message": `${req.body.username} has been updated.`
            });
            console.log('Successfully updated the user.');
        })
    
        .catch((err: SQLResponse): void => {
            res.send({
                "status": 500,
                "message": DB.getSqlError(err)
            });
            console.log('ERROR ', err);
        });
});

app.delete('/delete-user/:key', (req: Request, res: Response): void => {
    const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword);

    DB.deletePerson('users', req.body.id)
        .then((data: string[]): void => {
            res.send({
                "status": 200,
                "message": "1 user has been deleted"
            })
            console.log('Success', data);
        })
        .catch((err: SQLResponse): void => {
            res.send({
                "status": 500,
                "message": DB.getSqlError(err)
            });
            console.log('Error in deleting a user ', err);
        });
});


app.put('/login/:key', (req: Request, res: Response): void => {
    const DB = new DBMethods(dbHost, dbUser, dbName, dbPassword); 


})

