import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();

//Middleware functions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3900;

app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello Farts');
});
