import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"
import axios from "../../api/axios"
import { useToken } from '../../TokenContext';

import './LoginForm.css'


function LoginForm() {

    const [action, setAction] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const { token, setToken } = useToken();

    const navigate = useNavigate();

    const LOGIN__URL = '/login'
    const REGISTER_URL = '/register'

    useEffect(() => {
        if(document.cookie){
            console.log(document.cookie)
        } else {
            console.log("no cookie")
        }
    }, [])

    const clearInfo = () => {
        setUsername('');
        setPassword('');
        setEmail('');
    };

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN__URL, {
                username: username,
                password: password,
            })

            if (response.status === 200){
                console.log(response.data)
                localStorage.setItem('token', response.data.token)
                navigate("/videos")
            }else{
                alert("Status code not 200")
            }
        }catch(err){
            if (err.response && err.response.data && err.response.data.message) {
                const errorMessage = `Error ${err.response.status}: ${err.response.data.message}`;
                alert(errorMessage);
            } else {
                console.error(err);
            }
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

            if (response.status === 201){
                loginLink()
                alert("Registration Successful")
            }else{
                alert("status not 201")
            }
        }catch(err){
            if (err.response && err.response.data && err.response.data.message) {
                const errorMessage = `Error ${err.response.status}: ${err.response.data.message}`;
                alert(errorMessage);
            } else {
                console.error(err);
            }
        }
    }

    const registerLink = () => {
        clearInfo()
        setAction(' active')
    }

    const loginLink = () => {
        clearInfo()
        setAction('')
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
        </div>
    )
}

export default LoginForm