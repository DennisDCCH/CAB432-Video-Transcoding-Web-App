const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { PassThrough } = require('stream');
const s3 = require('./aws/s3')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;


ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Function to get the duration of a video
async function getVideoMetadata(fileStream) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fileStream, (err, metadata) => {
            if (err) {
                return reject(err);
            }

            const duration = metadata?.format?.duration;
            const codec = metadata?.streams?.[0]?.codec_name;
            
            if (duration === undefined || codec === undefined) {
                return reject(new Error('Duration or codec not found in metadata'));
            }

            resolve({ duration, codec });
        });
    });
}

async function captureThumbnail(filePath) {
    return new Promise((resolve, reject) => {
        const thumbnailStream = new PassThrough();

        ffmpeg(filePath)
            .on('error', (err) => {
                reject(`Error generating thumbnail: ${err.message}`);
            })
            .on('end', () => {
                resolve(thumbnailStream);
            })
            .seekInput(3) // Seek to 3 seconds into the video
            .output(thumbnailStream)
            .outputOptions([
                '-vframes 1',           // Capture only one frame
                '-f image2',            // Force format to image
                '-s 1920x1080'          // Set the size of the thumbnail
            ])
            .run();
    });
}

async function reformatVideo(s3url, videoid, currentFormat, newFormat, newVideoid) {
    // Path to temporarily store the downloaded video
    const tempFilePath = path.join(__dirname, `${videoid}.${currentFormat}`);
    const outputDir = path.join(__dirname, 'reformat');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir); // Create the directory if it doesn't exist
    }
    console.log("Start reformat")

    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: s3url,
            responseType: 'stream'
        })
        .then(response => {
            const writeStream = fs.createWriteStream(tempFilePath);
            response.data.pipe(writeStream);

            writeStream.on('finish', async () => {
                console.log("Downloaded locally")
                const chunks = [];

                if (currentFormat.toLowerCase() === newFormat.toLowerCase()) {
                    const mimeType = formatToMimeType[currentFormat.toLowerCase()];
                    try {
                        // Upload the original file back to S3
                        await s3.uploadReformat(newVideoid, fs.createReadStream(tempFilePath), mimeType);
                        resolve({ same: true, message: "Uploaded original file back to S3" });
                    } catch (error) {
                        reject(error);
                    } finally {
                        // Clean up the temp file
                        fs.unlink(tempFilePath, (err) => {
                            if (err) {
                                console.error('Error deleting temp file:', err);
                            }
                        });
                    }
                    return; // Exit the function early if the formats are the same
                } 
                console.log("Start ffmpeg process")
                ffmpeg(tempFilePath)
                    .toFormat(newFormat) // Specify the new format
                    .on('end', () => {
                        console.log('Reformatting completed successfully.');
                        const outputFilePath = path.join(outputDir, `${newVideoid}.${newFormat.toLowerCase()}`);
                
                        // Return the directory name
                        resolve({ 
                            same: false, 
                            message: `Video reformatted and saved locally.`, 
                            filePath: outputFilePath 
                        });
                
                        // Clean up the temp file
                        fs.unlink(tempFilePath, (err) => {
                            if (err) {
                                console.error('Error deleting temp file:', err);
                            }
                        });
                    })
                    .on('error', (err) => {
                        console.error('FFmpeg error:', err);
                        reject(err); // Reject the promise on FFmpeg error
                    })
                    .save(path.join(__dirname, 'reformat', `${newVideoid}.${newFormat.toLowerCase()}`)); // Save the output   
            });

            writeStream.on('error', (err) => {
                console.error('Write stream error:', err);
                fs.unlink(tempFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting temp file:', unlinkErr);
                    }
                });
                reject(err);
            });
        })
        .catch(error => {
            console.error('Axios error:', error);
            reject(error);
        });
    });
}


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

module.exports = {
    getVideoMetadata,
    captureThumbnail,
    reformatVideo,
};