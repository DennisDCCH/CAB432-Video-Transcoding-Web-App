const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path')

const userRoute = require('./routes/userRoute')
const videoRoute = require('./routes/videoRoute')

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

// Serve static files from 'uploads' and 'thumbnails' directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));


app.listen(5000, () => {
    console.log("Server is listening on Port 5000")
})