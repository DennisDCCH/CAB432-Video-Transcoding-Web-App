import React, { useEffect, useState } from 'react'
import './RequestCard.css';
import axios from '../../api/axios';

function RequestCard(props) {
    
    const [requestInfo, setRequestInfo] = useState(null)
    const [videoID, setVideoID] = useState("")

    useEffect(() => {
        if(props.props){
            setRequestInfo(props.props.metadata)
            setVideoID(props.props.idtoken_videoid)
        }
    }, [props.props])

    const handleDownload = async () => {
        try {
            const response = await axios.get("/download", {
                params: {
                    idtoken_videoid: props.props.idtoken_videoid,
                    format:  props.props.metadata.format,
                }
            }) 
            const s3url = response.data.s3url
            console.log(s3url)

            const videoTitle = requestInfo.videoData.title.split('.').slice(0, -1).join('.');
            const fileExtension = requestInfo.format;
            const fileName = `${videoTitle}.${fileExtension}`;
            console.log(fileName)

            //download
            const fileResponse = await axios.get(s3url, {
                responseType: 'blob'  
            });


    
            // Create a Blob from the response data
            const blob = new Blob([fileResponse.data], { type: fileResponse.headers['content-type'] });

            // Create a link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;  // Use the generated file name

            // Append to the body (required for Firefox)
            document.body.appendChild(link);

            // Programmatically trigger a click on the link to initiate the download
            link.click();

            // Cleanup - remove the link element
            document.body.removeChild(link);

            alert("successful")
        } catch (err) {
            console.log("error")
            if (err.response && err.response.data && err.response.data.message) {
                const errorMessage = `Error ${err.response.status}: ${err.response.data.message}`;
                alert(errorMessage);
            } else {
                console.error(err);
            }
        }
        
    }

    const handleDelete = async () => {
        try {
            await axios.delete("/request-delete", {
                params: { 
                    idtoken_videoid: props.props.idtoken_videoid,
                    format:  props.props.metadata.format
                }
            })

            props.fetchUserRequest()
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
        <div className = 'request-card'>
            <div className='request-word'>
                {requestInfo ? (
                    <>
                        <a>Video Title: {requestInfo.videoData.title.split('.').slice(0, -1).join('.')}</a>
                        <a>Requested Format: {requestInfo.format}</a>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div className='request-button'>
                <button onClick={handleDownload}>Download</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}

export default RequestCard