import 'dotenv/config'; // Load environment variables from .env file
import * as s3 from './s3.mjs'; // Correctly import all exports from s3.mjs
import { captureThumbnail } from './ffmpeg.mjs'; // Use named import
import axios from 'axios';
import fs from 'fs'; // Required to handle file operations

export const handler = async (event) => {
    console.log("S3 Event:", JSON.stringify(event, null, 2));

    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    const videoID = key.split('/').pop();
    const filePath = `/tmp/${videoID}`;

    try {
        const s3url = await s3.getVideo(videoID); // Get signed URL
        const response = await axios({
            method: 'get',
            url: s3url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Capture the thumbnail from the downloaded video file
        const thumbnail = await captureThumbnail(filePath);
        const thumbnailUploadResponse = await s3.uploadThumbnail(videoID, thumbnail);

        return {
            statusCode: 200,
            body: JSON.stringify({
                bucket,
                key,
                thumbnailUploadResponse,
            })
        };
    } catch (err) {
        console.error("Error processing file:", err); // Log the complete error
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error processing file',
                error: err.message
            })
        };
    } finally {
        // Cleanup: remove temporary file
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (cleanupErr) {
            console.error("Error during cleanup:", cleanupErr);
        }
    }
};