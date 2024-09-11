import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"
import axios from "../../api/axios"
import AuthCode from 'react-auth-code-input';

import './LoginForm.css'


function LoginForm() {

    const [action, setAction] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [confirmation, setConfirmation] = useState(true)

    const navigate = useNavigate();

    const LOGIN__URL = '/login'
    const REGISTER_URL = '/register'
    const CONFIRMATION_URL = '/confirm'
    const RESEND_URL = '/resend'

    useEffect(() => {
        loginLink()
    }, [])

    const clearInfo = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setCode('')
    };

    const handleOnChange = (res) => {
        setCode(res);
    };

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN__URL, {
                username: username,
                password: password,
            })

            localStorage.setItem('token', response.data.token)
            navigate("/videos")
        }catch(err){
            console.log(err)

            const errorData = err.response?.data;
            const statusCode = errorData?.statusCode || "Unknown Status Code";
            const errorMessage = errorData?.errorMessage || "Unknown Error Message";
            
            alert(`Error: ${statusCode}\nMessage: ${errorMessage}`);
        }
    }

    const handleRegistration = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(REGISTER_URL, {
                username,
                email,
                password,
            })

            setConfirmation(false)
        }catch(err){
            console.log(err)

            const errorData = err.response?.data;
            const statusCode = errorData?.statusCode || "Unknown Status Code";
            const errorMessage = errorData?.errorMessage || "Unknown Error Message";
            
            alert(`Error: ${statusCode}\nMessage: ${errorMessage}`);
        }
    }

    const handleConfimration = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(CONFIRMATION_URL, {
                username, 
                code,
            })
            
            alert(response.data.message)
            loginLink()
        } catch(err) {
            console.log(err)

            const errorData = err.response?.data;
            const statusCode = errorData?.statusCode || "Unknown Status Code";
            const errorMessage = errorData?.errorMessage || "Unknown Error Message";

            alert(`Error: ${statusCode}\nMessage: ${errorMessage}`);
        }
    }

    const handleResend = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(RESEND_URL, {
                username, 
            })

            alert(response.data.message)
        } catch(err) {
            console.log(err)

            const errorData = err.response?.data;
            const statusCode = errorData?.statusCode || "Unknown Status Code";
            const errorMessage = errorData?.errorMessage || "Unknown Error Message";
            
            alert(`Error: ${statusCode}\nMessage: ${errorMessage}`);
        }
    }

    const registerLink = () => {
        clearInfo()
        setAction(' active')
    }

    const loginLink = () => {
        clearInfo()
        setAction('')
        setConfirmation(true)
    }


    return (
        <div className={`wrapper${action}`}>
            <div className="form-box login">
                <form action="form-box login" onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder='Username' 
                            required
                        />
                        <FaUser className='icon'/>
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder='Password' 
                            required
                        />
                        <FaLock className='icon'/>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember me</label>
                        <a href="#" >Forgot password?</a>
                    </div>

                    <button type="submit">Login</button> 

                    <div className="register-link">
                        <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div>
            

            {confirmation ? (
                <div className="form-box register">
                    <form action="form-box register" onSubmit={handleRegistration}>
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder='Username' 
                                required
                            />
                            <FaUser className='icon'/>
                        </div>
                        <div className="input-box">
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder='Email' 
                                required
                            />
                            <FaUser className='icon'/>
                        </div>
                        <div className="input-box">
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder='Password' 
                                required
                            />
                            <FaEnvelope className='icon'/>
                        </div>

                        <button type="submit">Register</button> 

                        <div className="register-link">
                            <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                        </div>
                    </form>
                </div>
            ) : (
                <div className='form-box otp'>
                    <h1>Enter OTP</h1>
                    <AuthCode 
                        inputClassName='otp'
                        onChange={handleOnChange}
                    />
                    <button onClick={handleConfimration}>Submit Code</button>
                    <div className='resend-link'>
                        <p>Need a new code? <a href="#" onClick={handleResend}>Resend</a></p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LoginForm