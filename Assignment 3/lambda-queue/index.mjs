import { sendMessage } from './sqs.mjs';

export const handler = async (event) => {
  const { format, videoData, idtoken_videoid } = JSON.parse(event.body);

  const messagePayload = {
      format,
      videoData,
      idtoken_videoid,
  };
  
  try {
    const sqsResponse = await sendMessage(JSON.stringify(messagePayload));
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Reformat request have been successfully queued.',
        sqsResponse
      })
    }
  } catch (error) {
    console.error('Error', error)
    
    return {
      statusCode: 500,
      message: 'Error Proccessing Request',
      error
    }
  }
};
