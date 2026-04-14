import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import {ProductRouter, CategoriesRouter, UserRouter, OrderRouter} from "./routers/index.js";
import {authJwt, errorHandler} from "./helpers/index.js";

dotenv.config();

import express from "express";


const api = process.env.API_URL;
const port = process.env.PORT || 3000;
const connectionString = process.env.CONNECTION_STRING;
const app = express();


// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//Routers
app.use(`${api}/products`, ProductRouter);
app.use(`${api}/categories`, CategoriesRouter);
app.use(`${api}/users`, UserRouter);
app.use(`${api}/orders`, OrderRouter);


mongoose.connect(connectionString)
.then(() => console.log('Database connection is ready'))
.catch(err => console.log(err));



app.listen(port,'0.0.0.0', () => {
    console.log(`API URL is set to: ${api}`);
    console.log(`Server is running on port ${port}`);
});