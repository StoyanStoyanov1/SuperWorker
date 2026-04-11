import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import ProductRouter from "./routers/product.js";
dotenv.config();

import express from "express";


const api = process.env.API_URL;
const port = process.env.PORT || 3000;
const connectionString = process.env.CONNECTION_STRING;
const app = express();


// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

//Routers
app.use(`${api}/products`, ProductRouter);


mongoose.connect(connectionString)
.then(() => console.log('Database connection is ready'))
.catch(err => console.log(err));



app.listen(port,'0.0.0.0', () => {
    console.log(`API URL is set to: ${api}`);
    console.log(`Server is running on port ${port}`);
});