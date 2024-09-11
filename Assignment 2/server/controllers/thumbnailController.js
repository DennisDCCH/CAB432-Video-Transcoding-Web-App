const s3 = require("../aws/s3")

const getThumbnail = async (req, res) => {
    const videoID = req.query.idtoken_videoid.split('#')[1];

    try {
        const s3Response = await s3.getThumbnail(videoID)
        res.status(200).json({ url: s3Response })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getThumbnail
}