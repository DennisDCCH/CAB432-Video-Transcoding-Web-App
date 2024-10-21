import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);
console.log(ffmpegPath.path)

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

export { captureThumbnail };
