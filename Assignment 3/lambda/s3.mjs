import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: 'ap-southeast-2' });
const bucketName = 'n12150801-assessment';

async function uploadThumbnail(videoID, thumbnailFile) {
    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: bucketName,
            Key: `thumbnail/${videoID}`,
            Body: thumbnailFile,
        },
    });

    try {
        const response = await upload.done();
        return response;
    } catch (error) {
        throw error;
    }
}

async function getVideo(videoID) {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: `video/${videoID}`,
    });

    try {
        const presignedURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return presignedURL;
    } catch (error) {
        throw error;
    }
}

export { uploadThumbnail, getVideo };
