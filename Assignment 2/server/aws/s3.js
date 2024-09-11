require("dotenv").config();
const S3 = require("@aws-sdk/client-s3");
const S3Upload = require("@aws-sdk/lib-storage")
const S3Presigner = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3.S3Client({ region: 'ap-southeast-2' });


const bucketName = 'n12150801-assessment'

async function uploadVideo(videoID, videoFile, mimetype) {
    const upload = new S3Upload.Upload({
        client: s3Client,
        params: {
            Bucket: bucketName,
            Key: `video/${videoID}`,
            Body: videoFile,
            ContentType: mimetype,
        },
    });

    try {
        const response = await upload.done();
        return response;
    } catch (error) {
        throw error;
    }
}

async function uploadThumbnail(videoID, thumbnailFile) {
    const upload = new S3Upload.Upload({
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
    const command = new S3.GetObjectCommand({
        Bucket: bucketName,
        Key: `video/${videoID}`
    })

    try {
        const presignedURL = await S3Presigner.getSignedUrl(s3Client, command, {expiresIn: 3600} );
        return presignedURL
    } catch (error) {
        throw error
    }
}

async function getThumbnail(videoID) {
    const command = new S3.GetObjectCommand({
        Bucket: bucketName,
        Key: `thumbnail/${videoID}`
    })

    try {
        const presignedURL = await S3Presigner.getSignedUrl(s3Client, command, {expiresIn: 3600} );
        return presignedURL
    } catch (error) {
        throw error
    }
}

async function deleteVideo(videoID) {
    const command = new S3.DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
            Objects: [
                { Key: `video/${videoID}` },
                { Key: `thumbnail/${videoID}` }
            ]
        }
    });

    try {
        const response = await s3Client.send(command);
        return response;
    } catch (error) {
        throw error;
    }
}

async function deleteVideoOnly(videoID) {
    const command = new S3.DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
            Objects: [
                { Key: `video/${videoID}` }
            ]
        }
    });

    try {
        const response = await s3Client.send(command);
        return response;
    } catch (error) {
        throw error;
    }
}

async function deleteThumbnailOnly(videoID) {
    const command = new S3.DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
            Objects: [
                { Key: `thumbnail/${videoID}` },
            ]
        }
    });

    try {
        const response = await s3Client.send(command);
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    uploadThumbnail,
    uploadVideo,
    deleteVideo,
    getVideo,
    getThumbnail,
    deleteVideoOnly,
    deleteThumbnailOnly,
}