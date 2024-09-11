const cognito = require('../aws/cognito.js')

// Function to register a new user
const register_user = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        console.log("register_user try block")
        const cognitoResponse = await cognito.signUp(username, password, email);
        console.log(cognitoResponse)

        const statusCode = cognitoResponse.$metadata?.httpStatusCode

        // Successful initial registration
        res.status(statusCode).json({ 
            message: 'User signed up successfully. Please check your email for a verification code.', 
        });

    } catch (error) {
        console.log("register_user error block")
        console.log(error)
        const statusCode = error.$metadata?.httpStatusCode || "Unknown Status Code";
        const errorMessage = error.message || "Unknown Error Message";
        const errorType = error.__type || "Unknown Error Type";

        res.status(statusCode).json({
            errorType: errorType,
            statusCode: statusCode,
            errorMessage: errorMessage,
        })
    }
}

const confirm_user = async(req, res) => {
    const { username, code } = req.body;
    
    try {
        const cognitoResponse = await cognito.confirmSignUp(username, code);

        const statusCode = cognitoResponse.$metadata?.httpStatusCode

        res.status(statusCode).json({ 
            message: 'Your account has been successfully confirmed. You can now log in.', 
        });

    } catch (error) {
        const statusCode = error.$metadata?.httpStatusCode || "Unknown Status Code";
        const errorMessage = error.message || "Unknown Error Message";
        const errorType = error.__type || "Unknown Error Type";

        res.status(statusCode).json({
            errorType: errorType,
            statusCode: statusCode,
            errorMessage: errorMessage,
        })
    }
}

const resend_email = async(req, res) => {
    const { username } = req.body;

    try {
        const cognitoResponse = await cognito.resendConfirmationEmail(username);

        const statusCode = cognitoResponse.$metadata?.httpStatusCode

        res.status(statusCode).json({ 
            message: 'Verification email have been resend.', 
        });

    } catch (error) {
        const statusCode = error.$metadata?.httpStatusCode || "Unknown Status Code";
        const errorMessage = error.message || "Unknown Error Message";
        const errorType = error.__type || "Unknown Error Type";

        res.status(statusCode).json({
            errorType: errorType,
            statusCode: statusCode,
            errorMessage: errorMessage,
        })
    }
}

// Function to log in a user
const login_user = async(req, res) => {
    const { username, password } = req.body;

    try {
        const cognitoResponse = await cognito.login(username, password);

        const statusCode = cognitoResponse.$metadata?.httpStatusCode
        const token = cognitoResponse.AuthenticationResult.IdToken

        res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'Strict' });

        res.status(statusCode).json({ 
            message: 'Login Successful', 
        });
    } catch (error) {
        console.log(error)
        const statusCode = error.$metadata?.httpStatusCode || "Unknown Status Code";
        const errorMessage = error.message || "Unknown Error Message";
        const errorType = error.__type || "Unknown Error Type";

        res.status(statusCode).json({
            errorType: errorType,
            statusCode: statusCode,
            errorMessage: errorMessage,
        })
    }
}

// Function to log out a user
const logout_user = (req, res) => {

    res.clearCookie('token', {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict' 
    });

    // Send a response to indicate successful logout
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    register_user, 
    login_user,
    logout_user,
    resend_email,
    confirm_user,
}