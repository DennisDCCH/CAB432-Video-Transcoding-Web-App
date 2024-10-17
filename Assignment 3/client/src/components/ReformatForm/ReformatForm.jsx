import React, { useEffect, useState } from 'react';
import { FaArrowsRotate, FaDownload } from "react-icons/fa6";
import './ReformatForm.css'; // Make sure you have a CSS file for the styles
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
function ReformatForm(props) {

    const [format, setFormat]  = useState("mp4");

    const navigate = useNavigate();

    // Handler for format select change
    const handleFormatChange = (e) => {
        setFormat(e.target.value);
    };

    const handleReformat = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/reformat-queue', {
                format: format,
                videoData: props.videoData,
                idtoken_videoid: props.idtoken_videoid
            })

            console.log(response)
            alert(response.data.message)

            navigate('/videos');
        } catch (err) {
            console.log(err)

            const errorData = err.response?.data;
            const statusCode = errorData?.statusCode || "Unknown Status Code";
            const errorMessage = errorData?.errorMessage || "Unknown Error Message";
            
            alert(`Error: ${statusCode}\nMessage: ${errorMessage}`);
        }
    } 

    return (
        <div className="reformat-form-container">
            <form className="reformat-form">
                <label htmlFor="format" className="reformat-label">Select video format:</label>
                <select id="format" name="format" className="reformat-select" onChange={handleFormatChange}>
                    <option value="mp4" defaultValue>MP4</option>
                    <option value="avi">AVI</option>
                    <option value="flv">FLV</option>
                    <option value="webm">WebM</option>
                    <option value="ogg">Ogg</option>
                </select>                
            </form>
            <div className='reformat-form-buttons'>
                <button type="submit" className="reformat-button" onClick={handleReformat}>
                    <span>Reformat</span> 
                    <FaArrowsRotate />
                </button>
            </div>
        </div>
    );
}

export default ReformatForm;
