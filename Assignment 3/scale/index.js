const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

require('./controllers/videoController')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middleware for handling file uploads
app.use(fileUpload());

// Cookie-parser middleware
app.use(cookieParser());

// Basic "Hello World" route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hello World</title>
        </head>
        <body>
            <h1>Hello, World!</h1>
        </body>
        </html>
    `);
});


app.listen(8000, () => {
    console.log("Server is listening on Port 8000")
})