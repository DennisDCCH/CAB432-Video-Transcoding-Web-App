import React from 'react'
import { TbLogout2 } from "react-icons/tb";
import { MdOutlineVideoLibrary, MdOutlineDriveFolderUpload, MdOutlineRequestPage } from "react-icons/md";

export const NavbarData = [
    {
        title: 'Videos',
        path: '/videos',
        icon: <MdOutlineVideoLibrary />,
        cName: 'nav-text'
    },
    {
        title: 'Upload',
        path: '/upload',
        icon: <MdOutlineDriveFolderUpload />,
        cName: 'nav-text'
    },
    {
        title: 'Requests',
        path: '/request',
        icon: <MdOutlineRequestPage />,
        cName: 'nav-text'
    },
    {
        title: 'Logout',
        path: '/',
        icon: <TbLogout2 />,
        cName: 'nav-text'
    },
]
