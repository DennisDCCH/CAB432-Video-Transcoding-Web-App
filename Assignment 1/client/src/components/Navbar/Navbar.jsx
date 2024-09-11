import React, { useState }from 'react'
import axios from '../../api/axios'
import { FaBars } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import { NavbarData } from './NavbarData'
import './Navbar.css'

function Navbar() {
  const [sidebar, setSidebar] = useState(false)
  const navigate = useNavigate();

  const showSidebar = () => setSidebar(!sidebar)

  const handleLogout = async () => {
    try {
      // Make the POST request to the logout endpoint
      const response = await axios.post('/logout');

      if (response.status === 200) {
        // Successfully logged out
        navigate('/'); // Redirect to home or login page
      } else {
        // Handle errors or failed logout
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
        <div className='navbar'>
            <Link to = "#" className = 'menu-bars'>
                <FaBars onClick={showSidebar}/>
            </Link>
        </div>
        <nav className = {sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items'>
            <li className="navbar-toggle">
              <Link to = "#" className = 'close-bars'>
                <AiOutlineClose onClick={showSidebar} />
              </Link>
            </li>
            {NavbarData.map((item, index) => {
              return (
                <li key = {index} className={item.cName}>
                   <Link to = {item.path} onClick={item.title === 'Logout' ? handleLogout : undefined}>
                    {item.icon}
                    <span>{item.title}</span>
                   </Link>
                </li>
              )
            })}
          </ul>
        </nav>
    </>
  )
}

export default Navbar