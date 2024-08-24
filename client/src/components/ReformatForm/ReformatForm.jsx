import React, { useEffect, useState } from 'react';
import { FaArrowsRotate, FaDownload } from "react-icons/fa6";
import './ReformatForm.css'; // Make sure you have a CSS file for the styles
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
function ReformatForm(props) {

    const [format, setFormat]  = useState("mp4");
    const [codec, setCodec] = useState ("libx264");
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [showText, setShowText] = useState(false);

    const navigate = useNavigate();

    // Handler for format select change
    const handleFormatChange = (e) => {
        setFormat(e.target.value);
    };

    // Handler for codec select change
    // const handleCodecChange = (e) => {
    //     setCodec(e.target.value);
    // };

    const testClick = () => {
        setShowDownloadButton(!showDownloadButton)
    }

    const testClick2 = () => {
        setShowText(!showText)
    }

    const handleReformat = async (e) => {
        e.preventDefault();

        try {
            setShowText(!showText)
            const response = await axios.post('/reformat', {
                format: format,
                codec: codec,
                videoData: props.videoData
            })

            if (response.status === 200){
                setShowText(prev => !prev);
                setShowDownloadButton(!showDownloadButton)
                alert("successful")
            }else{
                alert("Status code not 200")
            }
        } catch (err) {
            setShowText(!showText)
            if (err.response && err.response.data && err.response.data.message) {
                const errorMessage = `Error ${err.response.status}: ${err.response.data.message}`;
                alert(errorMessage);
            } else {
                console.error(err);
            }
        }
    } 

    const handleDownload = async (e) => {
        e.preventDefault();
    
        const baseFilename = props.videoData.filename.replace(/\.[^/.]+$/, "");
        const newFilename = `${baseFilename}.${format}`;

        try {
            const response = await axios.post('/download', {}, { responseType: 'blob' });
    
            if (response.status === 200) {

                // Create a link element
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
    
                // Set the download attribute with a filename
                link.setAttribute('download', newFilename); // Set the appropriate filename and extension
    
                // Append the link to the body
                document.body.appendChild(link);
    
                // Programmatically click the link to trigger the download
                link.click();
    
                // Clean up and remove the link
                link.parentNode.removeChild(link);
    
                alert("Download successful");
                navigate('/videos');
            } else {
                alert("Status code not 200");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                const errorMessage = `Error ${err.response.status}: ${err.response.data.message}`;
                alert(errorMessage);
            } else {
                console.error(err);
            }
        }
    };
    

    return (
        <div className="reformat-form-container">
            <form className="reformat-form">
                <label htmlFor="format" className="reformat-label">Select video format:</label>
                <select id="format" name="format" className="reformat-select" onChange={handleFormatChange}>
                    <option value="mp4" defaultValue>MP4</option>
                    <option value="avi">AVI</option>
                    <option value="mov">MOV</option>
                    <option value="flv">FLV</option>
                    <option value="webm">WebM</option>
                    <option value="mpeg">MPEG</option>
                    <option value="3gp">3GP</option>
                    <option value="ogg">Ogg</option>
                </select>                
                {/* <label htmlFor="codec" className="reformat-label">Select video codec: </label>
                <select id="codec" name="codec" className="reformat-select" onChange={handleCodecChange}>
                    <option value="libx264" selected>H.264 (libx264)</option>
                    <option value="libx265">H.265/HEVC (libx265)</option>
                    <option value="libvpx">VP8 (libvpx)</option>
                    <option value="libvpx-vp9">VP9 (libvpx-vp9)</option>
                    <option value="mpeg4">MPEG-4 Part 2 (mpeg4)</option>
                    <option value="libtheora">Theora (libtheora)</option>
                </select> */}
            </form>
            <div className='reformat-form-buttons'>
                <button type="submit" className="reformat-button" onClick={handleReformat}>
                    <span>Reformat</span> 
                    <FaArrowsRotate />
                </button>
                {showDownloadButton && (
                    <button type="button" className="reformat-button" onClick={handleDownload}>
                        <span>Download</span> 
                        <FaDownload />
                    </button>
                )}
            </div>
            {showText && (
                <span className='loading-text'>Reformating...</span>
            )}
        </div>
    );
}

export default ReformatForm;
