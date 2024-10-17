const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const dynamodb = require('../aws/dynamodb');
const s3 = require('../aws/s3');
const cognito = require('../aws/cognito');
const ffmpeg = require('../ffmpeg');
const sqs = require('../aws/sqs')

const { Readable, PassThrough } = require('stream');

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); 
    return stream;
}

const streamToBuffer = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};

const uploadVideo = async (req, res) => {
    const successful = []
    const tempDir = path.join(__dirname, 'temp');

    try {
        if(!req.files || !req.files.files){
            return res.status(400).json({ message: 'No files were uploaded' });
        }

        const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
        const idToken = await cognito.userDetails(req.cookies.token);
        const userID = idToken.sub

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                const videoID = uuidv4()
                
                const tempFilePath = path.join(tempDir, videoID + path.extname(file.name));
                await fs.promises.writeFile(tempFilePath, file.data);
                
                const metadata = await ffmpeg.getVideoMetadata(bufferToStream(file.data))
                console.log("1")
                // const thumbnail = await ffmpeg.captureThumbnail(tempFilePath)
                console.log("2")
                // const thumbnailUploadResponse = await s3.uploadThumbnail(videoID, thumbnail)  
                console.log("3")

                // if (thumbnailUploadResponse) {
                //     successful.push({ videoID, service: 'thumbnail' });
                // }
                // if thumbnail successful, do successful.push(videoID, thumbnail)
                const videoUploadResponse = await s3.uploadVideo(videoID, bufferToStream(file.data), file.mimetype)
                console.log("4")

                if (videoUploadResponse) {
                    successful.push({ videoID, service: 'video' });
                }

                // if video successful, do successful.push(videoID, video)
                const videoMetadata = {
                    title: file.name,
                    filename: file.name,
                    mimetype: file.mimetype,
                    size: file.size,
                    duration: metadata.duration || 0,
                    codec: metadata.codec,
                };
                const dbResponse = await dynamodb.addMetadata(userID, videoID, videoMetadata);
                if (dbResponse) {
                    successful.push({ videoID, service: 'database' });
                }
                console.log("5")

                return {
                    videoUploadResponse, 
                    dbResponse,
                }
            })
        )

        fs.rm(tempDir, { recursive: true }, (err) => {
            if (err) console.error('Error cleaning up temp directory:', err);
        });

        res.json({message: 'Videos uploaded successfully', data: uploadResults})
    } catch (error) {
        console.log("Video Controller - Upload Video - Error Block")
        console.log(error)

        await Promise.all(successful.map(async ({ videoID, service }) => {
            try {
                const idToken = await cognito.userDetails(req.cookies.token);
                const userID = idToken.sub
                
                if (service === 'video') {
                    await s3.deleteVideoOnly(videoID);
                } else if (service === 'thumbnail') {
                    await s3.deleteThumbnailOnly(videoID);
                } else if (service === 'database') {
                    await dynamodb.deleteVideo(userID, videoID);
                }
            } catch (deleteError) {
                console.error(`Error deleting ${service} with ID ${videoID}:`, deleteError);
            }
        }));    

        if (fs.existsSync(tempDir)){
            fs.rm(tempDir, { recursive: true }, (err) => {
                if (err) console.error('Error cleaning up temp directory:', err);
            });
        }
    
        res.status(500).json({ message: 'Error during upload', error });
    }
}

const authorVideo = async (req, res) => {
    const idToken = await cognito.userDetails(req.cookies.token);
    const userID = idToken.sub

    try {
        const dbResponse = await dynamodb.queryUser(userID)
        res.status(dbResponse.$metadata.httpStatusCode).json(dbResponse.Items)
    } catch (error) {
        res.status(500).json({ message: 'Error getting author videos', error });
    }
}

const authorRequest = async(req, res) => {
    const idToken = await cognito.userDetails(req.cookies.token);
    const userID = idToken.sub

    try {
        const dbResponse = await dynamodb.queryReformatUser(userID)
        res.status(dbResponse.$metadata.httpStatusCode).json(dbResponse.Items)
    } catch (error) {
        res.status(500).json({ message: 'Error getting author videos', error });
    }
}

const getVideo = async (req, res) => {
    const idtoken_videoid = req.query.idtoken_videoid

    try {
        const dbResponse = await dynamodb.getVideo(idtoken_videoid)
        res.status(200).json(dbResponse)
    } catch (error) {
        res.status(500).json({ message: 'Error getting specific videos', error });
    }
}

const deleteVideo = async (req, res) => {
    const videoID = req.query.idtoken_videoid.split('#')[1];
    const idToken = await cognito.userDetails(req.cookies.token);
    const userID = idToken.sub

    try {
        const dbResponse = await dynamodb.deleteVideo(userID, videoID)
        const s3Response = await s3.deleteVideo(videoID)
        res.status(200).json({dbResponse, s3Response})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error getting specific videos', error });
    }
}

const deleteRequest = async (req, res) => {
    const videoID = req.query.idtoken_videoid.split('#')[1];
    const idToken = await cognito.userDetails(req.cookies.token);
    const userID = idToken.sub
    const format = req.query.format

    try {
        const dbResponse = await dynamodb.deleteReformatVideo(userID, videoID)
        const s3Response = await s3.deleteRequest(videoID, format)
        res.status(200).json({dbResponse, s3Response})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error getting specific videos', error });
    }
}

const reformatVideo = async (req, res) => {
    const { format: newFormat, videoData, idtoken_videoid } = req.body;
    const format = getFormatFromMimeType(videoData.mimetype);
    const videoID = idtoken_videoid.split('#')[1];

    if (!newFormat || !videoID || !format ) {
        return res.status(400).json({ message: 'Missing required parameters.' });
    }

    try {
        const s3url = await s3.getVideo(videoID)
        const response = await ffmpeg.reformatVideo(s3url, videoID, format, newFormat)

        if (response.same) {
            res.status(200).json({ message: 'Format is already the same', same: response.same });
        } else {
            const contentType = getMimeTypeFromFormat(newFormat);

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="reformatted-video.${newFormat.toLowerCase()}"`);
            res.status(200);
            response.videoStream.pipe(res);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error reformating', error });
    }
};

const pollQueue = async() => {
    console.log("Run")
    try {
        const response = await sqs.retrieveMessage()
        if (response.Messages){
            console.log("got messages")
            console.log(response.Messages)
            // const data = JSON.parse(response.Messages[0].Body)
            // const { format: newFormat, videoData, idtoken_videoid } = data;
            // const format = getFormatFromMimeType(videoData.mimetype);
            // const videoID = idtoken_videoid.split('#')[1];
            // const newVideoid = uuidv4()
            // const s3url = await s3.getVideo(videoID)
            // const ffmpegResponse = await ffmpeg.reformatVideo(s3url, videoID, format, newFormat, newVideoid)
            // await s3.uploadReformat(newVideoid, fs.readFileSync(ffmpegResponse.filePath), getMimeTypeFromFormat(newFormat), newFormat)
            // fs.unlinkSync(ffmpegResponse.filePath);
            // await dynamodb.addReformatMetadata(idtoken_videoid.split('#')[0], newVideoid, data)
            // await sqs.deleteMessage(response.Messages[0].ReceiptHandle)
        } else {
            console.log("No messages")
        }
    } catch (error) {
        console.log(error)
    }

    setTimeout(pollQueue, 10000);
}

// pollQueue()

const reformatQueue = async (req, res) => {
    const { format, videoData, idtoken_videoid } = req.body;

    const messagePayload = {
        format,
        videoData,
        idtoken_videoid,
    };

    try {
        const response = await sqs.sendMessage(JSON.stringify(messagePayload))

        res.status(200).json({ message: "Reformat request have been successfully queued."})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error', error });
    }
}

const downloadVideo = async (req, res) => {
    const videoID = req.query.idtoken_videoid.split('#')[1];
    const format = req.query.format
    try {
        s3url = await s3.getRequest(videoID, format)
        res.status(200).json({message: 'Successful', s3url})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error", error })
    }
}

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

module.exports = {
    uploadVideo,
    authorVideo,
    authorRequest,
    getVideo,
    deleteVideo,
    reformatVideo,
    reformatQueue,
    deleteRequest,
    downloadVideo,
}