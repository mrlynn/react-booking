import express from "express"; 
import { readdirSync } from 'fs';
import cors from 'cors';
require('dotenv').config();
const morgan = require("morgan");
import mongoose from 'mongoose';

//
// read through /routes direction, map the files and require them as middleware
//
const app = express();
console.log("Process: ", process.env.PORT);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.log('Connection to Database Failed: ', err));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// route middleware
readdirSync('./routes').map((r) => 
    app.use('/api', require(`./routes/${r}`))
);

// Middleware
const port = process.env.PORT || 8000;
app.listen(port, ()=> {
    console.log(`Server is running port ${port}`)
})