import React, { useEffect, useState } from 'react';
import './VideoCard.css';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

const { baseURL } = require('../../Baseurl')

const VideoCard = (props) => {

    const [videoInfo, setVideoInfo] = useState(null)
    const [videoID, setVideoID] = useState("")
    const [thumbnailURL, setThumbnailURL] = useState('')

    const BASE_URL = baseURL

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
        if (props.props) {
            setVideoInfo(props.props.metadata);
            setVideoID(props.props.idtoken_videoid);
        }
    }, [props.props]);

    useEffect(() => {
        axios.get("/thumbnail", {
            params: { idtoken_videoid: props.props.idtoken_videoid }
        })
        .then((response) => {
            setThumbnailURL(response.data.url); 
        })
        .catch((error) => {
            console.error("Error fetching thumbnail:", error);
        })
    }, [props.props])

    if (!videoInfo) {
        return <div>Loading...</div>; // or some other placeholder
    }

    const handleDelete = async() => {
        try {
            await axios.delete("/delete", {
                params: { idtoken_videoid: props.props.idtoken_videoid }
            })

            props.fetchUserVideos()
        } catch(err) {
            if (err.response && err.response.data && err.response.data.message) {
                const errorMessage = `Error ${err.response.status}: ${err.response.data.message}`;
                alert(errorMessage);
            } else {
                console.error(err);
            }
        }
    }

    return (
        <div className="card">
            {thumbnailURL && <img className="card-video-img" src={thumbnailURL} alt="Video Thumbnail" />}
            <h1 className="card-video-name">{videoInfo.filename}</h1>
            <div className='card-details'>
                <span><strong>Size: </strong>{formatSize(videoInfo.size)}</span>
                <span><strong>Duration: </strong>{formatDuration(videoInfo.duration)} mins</span>
                <span><strong>File Type: </strong>{videoInfo.mimetype}</span>
                <span><strong>Codec Type: </strong>{videoInfo.codec}</span>
            </div>
            <div className='card-buttons'>
                <Link to={{ pathname: '/reformat' }} state={{ videoID: videoID }}>
                    <button><span className='reformat-text'>Reformat</span></button>
                </Link>
                <button onClick={handleDelete}><span className='delete-text'>Delete file</span></button>
            </div>
        </div>
    );
};

export default VideoCard;
