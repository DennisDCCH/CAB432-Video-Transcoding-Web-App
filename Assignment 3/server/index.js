const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path'); 

const userRoute = require('./routes/userRoute')
const videoRoute = require('./routes/videoRoute')
const thumbnailRoute = require('./routes/thumbnailRoute')

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middleware for handling file uploads
app.use(fileUpload());

// Cookie-parser middleware
app.use(cookieParser());

// Routes
app.use('/', userRoute);
app.use('/', videoRoute);
app.use('/', thumbnailRoute);


app.listen(5000, () => {
    console.log("Server is listening on Port 5000")
})