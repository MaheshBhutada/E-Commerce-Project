
// if you don't wan't to use require keyword 
// you should use the es6 method [import express from {express}].
// and write a line of code in file package.json 
// code : (type :'module') at line no. 6
import express, { json } from 'express';

// to connect dotenv file we require dotenv module.
import { config } from 'dotenv';

// import morgan.
import morgan from 'morgan';

// import configdb file.
import connectDB from './config/db.js';

// import the authRoute file
import authRoute from './routes/authRoute.js'

// import the categoryRoute file
import categoryRoute from './routes/categoryRoute.js'

// import the productRoute file
import productRoute from './routes/productRoute.js'

// import cros to neglect  error related to orgin when connect the client and server port.
// error name is cross-orgin error
import cors from 'cors'

import path from 'path'

import { fileURLToPath } from 'url';

// configure the file.
config()

// database config.
connectDB();

//esmodulefix.
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

// middleware.
app.use(json()); // it use to send json data in req,res 
app.use(morgan('dev'))
app.use(cors());
app.use(express.static(path.join(__dirname, './client/build')))

// all routes.
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);


app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
})

// getting the post from env file.
const PORT = process.env.PORT ;

app.listen(8000,()=>{
    console.log('Server is running on port ' + 8000);
})
