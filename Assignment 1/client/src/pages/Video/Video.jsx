import React, { useEffect, useState } from 'react'
import axios from '../../api/axios'
import Navbar from '../../components/Navbar/Navbar'
import VideoCard from '../../components/VideoCard/VideoCard'
import "./Video.css"
import { Link } from 'react-router-dom'
import { FiVideoOff } from "react-icons/fi";

function Video() {

    const [myVideos, setMyVideos] = useState([])

    const fetchUserVideos = () => {
        axios.get("/myVideos", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            setMyVideos(response.data)
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        })
    }

    useEffect(() => {
        fetchUserVideos()
    }, [])



    return (
        <div className='section'>
            <Navbar />
            <h1 className='video-title'>My Videos</h1>
            <div className = 'content'>
                {myVideos.length > 0 ? (
                    myVideos.map((video, index) => (
                        <VideoCard 
                            key={index}
                            props = {video}
                            fetchUserVideos = {fetchUserVideos}
                        />
                    ))
                ) : (
                    <div className='no-content'>
                        <FiVideoOff size={100}/>
                        <p className = "no-vid">No videos found.<Link to="/upload"><span>Upload Videos?</span></Link></p>
                        
                    </div>
                )}
            </div>
        </div>
    )
}

export default Video