"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//Middleware functions
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT || 3900;
const ApiKey = process.env.APIKEY;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.get('/:key', (req, res) => {
    if (req.params.key === ApiKey) {
        res.send("Hello Farts");
    }
    else {
        res.send('What are you doing here?');
    }
});
