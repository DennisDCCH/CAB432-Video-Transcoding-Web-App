const db = require('../database');

// Define SQL operations for User

// Creating a new user
const createUser = (username, email, password, callback) => {
    // Define SQL query with placeholders
    const sql = `INSERT INTO User (username, email, password) VALUES (?, ?, ?)`;

    // Run SQL query to insert user data
    db.run(sql, [username, email, password], function(err) {
        if (err) {
            // Check if the error is due to a unique constraint violation
            if (err.code === 'SQLITE_CONSTRAINT') {
                return callback(new Error('Username already exists'), null);
            }
            // Handle other potential errors
            return callback(err, null);
        }
        callback(null, this.lastID);
    });
};

const getUserByUsername = (username, callback) => {
    const sql = `SELECT * FROM User WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row);
    });
};

module.exports = {
    createUser,
    getUserByUsername
};
