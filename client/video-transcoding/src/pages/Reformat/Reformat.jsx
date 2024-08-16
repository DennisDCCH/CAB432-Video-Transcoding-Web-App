import React, { useEffect, useState } from 'react'
import ReformatForm from '../../components/ReformatForm/ReformatForm'
import './Reformat.css'
import { useParams } from 'react-router-dom'
import axios from '../../api/axios'

function Reformat() {

    const { id }= useParams()
    const [videoData, setVideoData] = useState([])
    const [thumbnailURL, setThumbnailURL] = useState('')

    const BASE_URL = 'http://localhost:5000';

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
        const URL = `/video/${id}`
        axios.get(URL)
        .then((response) => {
            setVideoData(response.data[0]);
        })
        .catch((error) => {
            console.error("Error fetching video data:", error);
        });
    }, [id])

    useEffect(() => {
        console.log(videoData)
        setThumbnailURL(encodeURI(BASE_URL + videoData.thumbnail))
    }, [videoData])

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
            />
        </div>
    )
}

export default Reformat