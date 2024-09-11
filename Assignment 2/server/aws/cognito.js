const Cognito = require("@aws-sdk/client-cognito-identity-provider");
const jwt = require("aws-jwt-verify");
const ssm = require("./ssm.js");

const cognitoClient = new Cognito.CognitoIdentityProviderClient({ region: 'ap-southeast-2' });

async function initialise() {
    try {
        const clientId = await ssm.parameters("/n12150801/cognito/clientid");  
        const userPoolId = await ssm.parameters("/n12150801/cognito/userpoolid");
        return {
            clientId, 
            userPoolId
        }
    } catch (error) {
        throw error
    }
}

// Function to sign up a user
async function signUp(username, password, email) {
    const { clientId, userPoolId } = await initialise();

    try {
        const command = new Cognito.SignUpCommand({
            ClientId: clientId,
            Username: username,
            Password: password,
            UserAttributes: [{ 
                Name: "email",
                Value: email 
            }]
        });
        const response = await cognitoClient.send(command);
        return response;
    } catch (error) {
        throw error;
    }
}

// Function to confirm sign-up with a confirmation code
async function confirmSignUp(username, confirmationCode) {
    const { clientId, userPoolId } = await initialise();

    try {
        const command = new Cognito.ConfirmSignUpCommand({
            ClientId: clientId,
            Username: username,
            ConfirmationCode: confirmationCode
        });
        const response = await cognitoClient.send(command);
        return response;
    } catch (error) {
        throw error;
    }
}

// Function to resend verification email
async function resendConfirmationEmail(username) {
    const { clientId, userPoolId } = await initialise();

    try {
        const command = new Cognito.ResendConfirmationCodeCommand({
            ClientId: clientId,
            Username: username,
        });
        const response = await cognitoClient.send(command);
        return response;
    } catch (error) {
        throw error;
    }
}

// Function to authenticate (login) a user
async function login(username, password) {
    const { clientId, userPoolId } = await initialise();

    try {
        const command = new Cognito.InitiateAuthCommand({
            AuthFlow: Cognito.AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: clientId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password
            }
        });
        const response = await cognitoClient.send(command);
        return response;
    } catch (error) {
        console.log("Enter error block")
        console.log(error)
        throw error;
    }
}

// Function to get user details from token
async function userDetails(token) {
    const { clientId, userPoolId } = await initialise();

    const idVerifier = jwt.CognitoJwtVerifier.create({
        userPoolId: userPoolId,
        tokenUse: "id",
        clientId: clientId,
    });

    try {
        const IdToken = await idVerifier.verify(token);
        return IdToken;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    signUp,
    confirmSignUp,
    resendConfirmationEmail,
    login,
    userDetails
};