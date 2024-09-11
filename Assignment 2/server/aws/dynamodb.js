require("dotenv").config();
const DynamoDB = require("@aws-sdk/client-dynamodb");
const DynamoDBLib = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDB.DynamoDBClient({ region: "ap-southeast-2" });
const docClient = DynamoDBLib.DynamoDBDocumentClient.from(client);

const tableName = "n12150801-assignment-videometadata"
const qutUsername = "n12150801@qut.edu.au";
const sortKey = "idtoken_videoid";

async function createTable() {
    command = new DynamoDB.CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [
            {
                AttributeName: "qut-username",
                AttributeType: "S",
            },
            {
                AttributeName: sortKey,
                AttributeType: "S", // Setting the sort key to String type
            },
        ],
        KeySchema: [
            {
                AttributeName: "qut-username",
                KeyType: "HASH",
            },
            {
                AttributeName: sortKey,
                KeyType: "RANGE",
            },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
        },
    });
      
    // Send the command to create the table
    try {
        const response = await client.send(command);
        console.log("Create Table command response:", response);
    } catch (err) {
        console.log(err);
    }
}

async function addMetadata(idToken, videoID, metadata) {
    const compositeSortKey = `${idToken}#${videoID}`;

    const command = new DynamoDBLib.PutCommand({
        TableName: tableName,
        Item: {
            "qut-username": qutUsername,
            "idtoken_videoid": compositeSortKey,
            "metadata": metadata,
        },
    })

    try {
        const response = await docClient.send(command);
        return response
    } catch (error) {
        throw error
    }
}

async function queryUser(idToken) {
    const command = new DynamoDBLib.QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "#username = :username and begins_with(#compositeKey, :idToken)",
        ExpressionAttributeNames: {
            "#username": "qut-username",
            "#compositeKey": "idtoken_videoid",
        },
        ExpressionAttributeValues: {
            ":username": qutUsername,
            ":idToken": idToken,
        },
    });

    try {
        const response = await docClient.send(command);
        return response 
    } catch (error) {
        throw error
    }
}


async function getVideo(idtoken_videoid) {
    const command = new DynamoDBLib.GetCommand({
        TableName: tableName,
        Key: {
        "qut-username": qutUsername,
        "idtoken_videoid": idtoken_videoid,
        },
    })

    try {
        const response = await docClient.send(command);
        return response
    } catch (error) {
        throw error
    }
}

async function deleteVideo(idToken, videoID) {
    const compositeSortKey = `${idToken}#${videoID}`;
    const command = new DynamoDBLib.DeleteCommand({
        TableName: tableName,
        Key: {
        "qut-username": qutUsername,
        "idtoken_videoid": compositeSortKey,
        },
    })

    try {
        const response = await docClient.send(command);
        return response
    } catch (error) {
        throw error
    }
}

module.exports = {
    addMetadata,
    queryUser,
    getVideo,
    deleteVideo,
}
