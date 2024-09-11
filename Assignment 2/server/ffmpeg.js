const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { PassThrough } = require('stream');
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

async function reformatVideo(s3url, videoid, currentFormat, newFormat) {
    // Path to temporarily store the downloaded video
    const tempFilePath = path.join(__dirname, `${videoid}.${currentFormat}`);

    return new Promise((resolve, reject) => {
        if (currentFormat.toLowerCase() === newFormat.toLowerCase()) {
            resolve({ same: true, s3url });
        } else {
            axios({
                method: 'get',
                url: s3url,
                responseType: 'stream'
            })
            .then(response => {
                const writeStream = fs.createWriteStream(tempFilePath);

                response.data.pipe(writeStream);

                writeStream.on('finish', () => {
                    console.log()
                    // Reformat the video to the newFormat
                    const outputStream = new PassThrough();

                    ffmpeg(tempFilePath)
                        .toFormat(newFormat)
                        .on('end', () => {
                            // Clean up the temp file
                            fs.unlink(tempFilePath, (err) => {
                                if (err) {
                                    console.error('Error deleting temp file:', err);
                                }
                            });
                        })
                        .on('error', (err) => {
                            console.error(newFormat)
                            console.error('FFmpeg error:', err);
                            fs.unlink(tempFilePath, (err) => {
                                if (err) {
                                    console.error('Error deleting temp file:', err);
                                }
                            });
                            reject(err);
                        })
                        .pipe(outputStream, { end: true });

                    resolve({ same: false, videoStream: outputStream });
                });

                writeStream.on('error', (err) => {
                    fs.unlink(tempFilePath, (err) => {
                        if (err) {
                            console.error('Error deleting temp file:', err);
                        }
                    });
                    reject(err);
                });
            })
            .catch(error => {
                reject(error);
            });
        }
    });
}

async function reformatVideo2(s3url, currentFormat, newFormat) {
    console.log("Enter ffmpeg")
    return new Promise(async (resolve, reject) => {
        if (currentFormat.toLowerCase() === newFormat.toLowerCase()) {
            console.log("Format same")
            resolve({ same: true, s3url });
        } else {
            console.log("Format not same")
            const transformStream = new PassThrough();

            const tempFilePath = tempy.file({ extension: currentFormat.toLowerCase() });

            try {
                const response = await axios ({
                    url: s3url,
                    method: 'GET',
                    responseType: 'stream'
                })

                if (!response.data || typeof response.data.pipe !== 'function') {
                    throw new Error('Invalid response stream from S3');
                }

                // Check if the stream contains data
                response.data.on('data', (chunk) => {
                    console.log('Received chunk of size:', chunk.length);
                });

                // Pass the S3 stream to FFmpeg
                ffmpeg(response.data)
                    .inputFormat(currentFormat.toLowerCase())
                    .format(newFormat.toLowerCase())
                    .on('start', (commandLine) => {
                        console.log('FFmpeg process started with command:', commandLine);
                    })
                    .on('progress', (progress) => {
                        console.log(`Processing: ${progress.percent ? progress.percent.toFixed(2) : 0}% done`);
                    })
                    .on('end', () => {
                        console.log('Processing finished successfully.');
                        resolve({ same: false, stream: transformStream });
                    })
                    .on('error', (err) => {
                        console.error('Error processing video with FFmpeg:', err);
                        reject(err);
                    })
                    .pipe(transformStream, { end: true });

            } catch (error) {
                console.log(error)
                reject(error)
            }
        }
    });
}

module.exports = {
    getVideoMetadata,
    captureThumbnail,
    reformatVideo,
};