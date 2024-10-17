const SQS = require("@aws-sdk/client-sqs");
const sqsQueueUrl = "https://sqs.ap-southeast-2.amazonaws.com/901444280953/n12150801-assessment";
const client = new SQS.SQSClient({
    region: "ap-southeast-2",
});

async function sendMessage(json) {
    message = json
    const command = new SQS.SendMessageCommand({
        QueueUrl: sqsQueueUrl,
        DelaySeconds: 10,
        MessageBody: message,
    });
     
    try {
        const response = await client.send(command);
        return response;
    } catch (error) {
        throw error;
    }
}

async function retrieveMessage() {
    const command = new SQS.ReceiveMessageCommand({
        MaxNumberOfMessages: 1,
        QueueUrl: sqsQueueUrl,
        WaitTimeSeconds: 20, // how long to wait for a message before returning if none.
        VisibilityTimeout: 20, // overrides the default for the queue?
    });

    try {
        const response = await client.send(command);
        return response
    } catch (error) {
        throw error;
    }
}

async function deleteMessage(ReceiptHandle) {
    const command = new SQS.DeleteMessageCommand({
        QueueUrl: sqsQueueUrl,
        ReceiptHandle: ReceiptHandle,
    });

    try {
        const response = await client.send(command);
        console.log("Successful delete")
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    sendMessage,
    retrieveMessage,
    deleteMessage
}