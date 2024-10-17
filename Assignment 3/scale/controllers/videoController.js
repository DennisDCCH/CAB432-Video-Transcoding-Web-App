const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const dynamodb = require('../aws/dynamodb');
const s3 = require('../aws/s3');
const ffmpeg = require('../ffmpeg');
const sqs = require('../aws/sqs');

const pollQueue = async() => {
    console.log("Run")
    try {
        const response = await sqs.retrieveMessage()
        if (response.Messages){
            const data = JSON.parse(response.Messages[0].Body)
            const { format: newFormat, videoData, idtoken_videoid } = data;
            const format = getFormatFromMimeType(videoData.mimetype);
            const videoID = idtoken_videoid.split('#')[1];
            const newVideoid = uuidv4()
            const s3url = await s3.getVideo(videoID)
            const ffmpegResponse = await ffmpeg.reformatVideo(s3url, videoID, format, newFormat, newVideoid)
            await s3.uploadReformat(newVideoid, fs.readFileSync(ffmpegResponse.filePath), getMimeTypeFromFormat(newFormat), newFormat)
            fs.unlinkSync(ffmpegResponse.filePath);
            await dynamodb.addReformatMetadata(idtoken_videoid.split('#')[0], newVideoid, data)
            await sqs.deleteMessage(response.Messages[0].ReceiptHandle)
        } else {
            console.log("No messages")
        }
    } catch (error) {
        console.log(error)
    }

    setTimeout(pollQueue, 5000);
}

pollQueue()

// Define a mapping of MIME types to file formats
const mimeTypeToFormat = {
    'video/mp4': 'mp4',
    'video/avi': 'avi',
    'video/mkv': 'mkv',
    'video/quicktime': 'mov',
    'video/x-ms-wmv': 'wmv',
    'video/x-flv': 'flv',
    'video/webm': 'webm',
    'video/mpeg': 'mpeg',
    'video/3gpp': '3gp',
    'video/ogg': 'ogg'
};

const formatToMimeType = {
    'mp4': 'video/mp4',
    'avi': 'video/avi',
    'mkv': 'video/mkv',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'webm': 'video/webm',
    'mpeg': 'video/mpeg',
    '3gp': 'video/3gpp',
    'ogg': 'video/ogg'
};

// Function to get the format from MIME type
const getFormatFromMimeType = (mimeType) => {
    return mimeTypeToFormat[mimeType] || null; // Default to 'unknown' if MIME type is not found
};

function getMimeTypeFromFormat(format) {
    return formatToMimeType[format.toLowerCase()] || 'application/octet-stream'; // Default MIME type
}
