const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const userRoute = require('./routes/userRoute')
const videoRoute = require('./routes/videoRoute')
const thumbnailRoute = require('./routes/thumbnailRoute')

const app = express()

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true,
    })
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middleware for handling file uploads
app.use(fileUpload());

// Cookie-parser middleware
app.use(cookieParser());

// Routes
app.use('/api', userRoute);
app.use('/api', videoRoute);
app.use('/api', thumbnailRoute);

app.listen(5000, () => {
    console.log("Server is listening on Port 5000")
})