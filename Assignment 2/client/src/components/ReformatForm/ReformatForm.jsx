import React, { useEffect, useState } from 'react';
import { FaArrowsRotate, FaDownload } from "react-icons/fa6";
import './ReformatForm.css'; // Make sure you have a CSS file for the styles
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
function ReformatForm(props) {

    const [format, setFormat]  = useState("mp4");
    const [showText, setShowText] = useState(false);

    const navigate = useNavigate();

    // Handler for format select change
    const handleFormatChange = (e) => {
        setFormat(e.target.value);
    };

    const handleReformat = async (e) => {
        e.preventDefault();

        try {
            setShowText(!showText)
            const response = await axios.post('/reformat', {
                format: format,
                videoData: props.videoData,
                idtoken_videoid: props.idtoken_videoid
            }, {
                responseType: 'blob'
            })

            const responseData = await response.data.text(); // Get the response text

            if (responseData.includes('Format is already the same')) {
                // Handle case where the format is the same
                alert("The video format is already in the requested format. No need to re-download.");
                navigate('/videos');
            } else {
                // Handle file download
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
                const a = document.createElement('a');
                a.href = url;
                a.download = `reformatted-video.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                alert("Download successful");
                navigate('/videos');
            }
        } catch (err) {
            setShowText(false)
            if (err.response && err.response.data) {
                const errorBlob = err.response.data;
                errorBlob.text().then((errorText) => {
                    try {
                        const errorJson = JSON.parse(errorText); // Parse the JSON string
                        alert(`Error: ${errorJson.message}`);
                    } catch (parseError) {
                        console.error('Error parsing JSON:', parseError);
                    }
                });
            } else {
                console.error(err);
            }
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
            {showText && (
                <span className='loading-text'>Reformating...</span>
            )}
        </div>
    );
}

export default ReformatForm;
