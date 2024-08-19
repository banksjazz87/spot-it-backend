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
const ApiKey = process.env.APIKEY;

app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});

app.get('/:key', (req: Request, res: Response): void => {
    if (req.params.key === ApiKey) {
        res.send("Hello Farts");
    } else {
        res.send('What are you doing here?');
    }
});
