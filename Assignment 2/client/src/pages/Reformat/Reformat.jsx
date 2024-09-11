import React, { useEffect, useState } from 'react'
import ReformatForm from '../../components/ReformatForm/ReformatForm'
import './Reformat.css'
import { useLocation } from 'react-router-dom'
import axios from '../../api/axios'
const { baseURL } = require('../../Baseurl')

function Reformat() {

    const location = useLocation()
    const idtoken_videoid = location.state.videoID
    const [videoData, setVideoData] = useState([])
    const [thumbnailURL, setThumbnailURL] = useState('')

    const BASE_URL = baseURL;

    // Convert size from bytes to a more readable format
    const formatSize = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    // Convert duration from seconds to a more readable format (mm:ss)
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        axios.get("/video", {
            params: { idtoken_videoid: idtoken_videoid }
        })
        .then((response) => {
            setVideoData(response.data.Item.metadata)
        })
        .catch((error) => {
            console.error("Error fetching video data:", error);
        });
    }, [idtoken_videoid])

    useEffect(() => {
        axios.get("/thumbnail", {
            params: { idtoken_videoid: idtoken_videoid }
        })
        .then((response) => {
            setThumbnailURL(response.data.url); 
        })
        .catch((error) => {
            console.error("Error fetching thumbnail:", error);
        })
    }, [idtoken_videoid])

    if (!videoData) {
        return <div>Loading...</div>; // or some other placeholder
    }

    return (
        <div className='reformat-bg'>
            <div className="video-wrapper">
                {thumbnailURL && <img className="video-thumbnail" src={thumbnailURL} alt="Video Thumbnail" />}
                <h1 className="video-name">{videoData.filename}</h1>
                <div className="video-details">
                    <span><strong>Size: </strong>{formatSize(videoData.size)}</span>
                    <span><strong>Duration: </strong>{formatDuration(videoData.duration)} mins</span>
                    <span><strong>File Type: </strong>{videoData.mimetype}</span>
                    <span><strong>Codec Type: </strong>{videoData.codec}</span>
                    <span><strong>Upload Date: </strong>{videoData.uploadDate}</span>
                </div>
            </div>
            <ReformatForm 
                videoData = {videoData}
                idtoken_videoid = {idtoken_videoid}
            />
        </div>
    )
}

export default Reformat