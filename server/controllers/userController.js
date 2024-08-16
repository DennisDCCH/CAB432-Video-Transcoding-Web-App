const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.js');

const saltRounds = 10;
const JWT_SECRET = 'JWT_SECRET' // Should be saved in .env

// Function to register a new user
const register_user = (req, res) => {
    const { username, email, password } = req.body;

    // Hash Password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }

        //Save the user with the hashed password
        userModel.createUser(username, email, hashedPassword, (err, userID) => {
            if (err) {
                if (err.message === 'Username already exists') {
                    return res.status(409).json({ message: 'Username already exists' }); // 409 Conflict
                }
                return res.status(500).json({ error: err.message }); // 500 Internal Server Error
            }

            // Successful registration
            res.status(201).json({ message: 'User created successfully', userID });
        })
    })
}

// Function to log in a user
const login_user = (req, res) => {
    const { username, password } = req.body;

    userModel.getUserByUsername(username, (err, user) => {
        if(err){
            return res.status(500).json({ error: err.message });
        }
        
        if(!user){
            // No such username found in database
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err){
                return res.status(500).json({ error: err.message });
            }
            if(!isMatch){
                // Wrong Password
                return res.status(401).json({ message: "Invalid Credentials" });
            }

            // Generating JWT
            const token  = jwt.sign(
                { 
                    userID: user.id, 
                    username: user.username
                },
                JWT_SECRET,
                {
                    expiresIn: '24h'
                }
            );

            // Setting JWT as cookie
            res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'Strict' });

            // Successful login
            res.json({ message: "Login Successful", userID: user.id });
        })
    })
}

// Function to log out a user
const logout_user = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token', {
        httpOnly: true, // Ensure it matches the cookie attributes used when setting it
        secure: process.env.NODE_ENV === 'production', // Use the same secure setting
        sameSite: 'Strict' // Match the sameSite attribute
    });

    // Send a response to indicate successful logout
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    register_user, 
    login_user,
    logout_user,
}