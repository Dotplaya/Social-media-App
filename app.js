const express = require('express');
const app  = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const UserRoute = require('./routes/users');
const AuthRoute = require('./routes/auth');
const PostRoute = require('./routes/post');
const Post = require('./models/Post');
const PORT = process.env.PORT;

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(
    () => console.log('Connected to Mongodb')
).catch((err) => console.log('Failed to connect to mongo db', err));


//middle ware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use( UserRoute);
app.use('api/auth', AuthRoute);
app.use('', PostRoute);



app.listen(8080, () => {
    const currentTime = new Date().toLocaleTimeString();
    console.log(`listening on port ${PORT} and time ${currentTime}`);
})