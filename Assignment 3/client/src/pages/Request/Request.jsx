import React, { useEffect, useState } from 'react'
import axios from '../../api/axios';
import RequestCard from '../../components/RequestCard/RequestCard'
import Navbar from '../../components/Navbar/Navbar';
import './Request.css'

function Request() {
    const [myRequest, setMyRequest] = useState([])

    const fetchUserRequest = () => {
        axios.get("/myRequest", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            console.log(response)
            console.log(response.data)
            setMyRequest(response.data)
        })
        .catch((error) => {
            console.error("Error fetching data:", error)
        })
    }

    useEffect(() => {
        fetchUserRequest()
    }, [])

    useEffect(() => {
        console.log("Enter check")
        console.log("My Request:", myRequest);
    }, 10000);

    return (
        <div className='request-bg'>
            <Navbar />
            <h1 className='request-title'>My Requests</h1>
            <div className='request-content'>
                {myRequest.length > 0 ? (
                    myRequest.map((video, index) => (
                        <RequestCard 
                            key = {index}
                            props = {video}
                            fetchUserRequest = {fetchUserRequest}
                        />
                    ))
                ) : (
                    <div className='request-no-content'>
                        <p className='no-request'>No Requests</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Request