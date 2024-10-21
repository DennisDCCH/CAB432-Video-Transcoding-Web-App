import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsQueueUrl = "https://sqs.ap-southeast-2.amazonaws.com/901444280953/n12150801-assessment";
const client = new SQSClient({
    region: "ap-southeast-2",
});

export async function sendMessage(json) {
    const message = json;
    const command = new SendMessageCommand({
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
