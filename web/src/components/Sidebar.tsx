import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import * as FaIcons from 'react-icons/fa' 
import { SidebarData } from './SidebarData'
import styled from 'styled-components'
import Logo from "../assets/logo.webp";
import { motion } from "framer-motion"
import { slideUp, slideBottom  } from "../utility/animation"
import DefaultImage from "../assets/upload.png"
import Profile1 from "../assets/profile/profile1.webp"
import Profile2 from "../assets/profile/profile2.webp"
import Profile3 from "../assets/profile/profile3.webp"
import Profile4 from "../assets/profile/profile4.webp"
import Profile5 from "../assets/profile/profile5.webp"
import Profile6 from "../assets/profile/profile6.webp"
import Profile7 from "../assets/profile/profile7.webp"
import Profile8 from "../assets/profile/profile8.webp"
import Profile9 from "../assets/profile/profile9.webp"


const Navbar = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    height: 3.5rem;
`

const MenuIconOpen = styled(Link)`
    display: flex;
    justify-content: start;
    font-size: 2rem;
    margin-left: 2rem;
    color: black;
`

const MenuIconClose = styled(Link)`
    display: flex;
    justify-content: end;
    font-size: 1.5rem;
    margin-top: 0.75rem;
    margin-right: 1rem;
    color: #ffffff;
    &:hover {
        color: black;
    }

`

const SidebarMenu = styled.div<{close: boolean}>`
    width: 250px;
    height: 100vh;
    background-color: #268094 ;
    position: fixed;
    top: 0;
    left: ${({ close}) => close ? '0' : '-100%'};
    transition: .6s;
`

const MenuItems = styled.li`
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 90px;
    padding: 1rem 0 1.25rem;
`

const MenuItemLinks = styled(Link)`
    display: flex;
    align-items: center;
    padding: 0 2rem;
    font-size: 20px;
    text-decoration: none;
    color: #ffffff;

    &:hover {
        background-color: #ffffff;
        color: black;
        width: 100%;
        height: 45px;
        text-align: center;
        border-radius: 5px;
        margin: 0 2rem;
    }
`

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  avatar: number;
}

const Sidebar: React.FunctionComponent = () => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)

    const _ud = localStorage.getItem('user_data');
    if (!_ud) {
      // Handle case where user data isn't found (optional)
      return null; // or redirect to login
    }
    const ud = JSON.parse(_ud) as UserData;
    let { firstName, lastName, avatar } = ud;

    const data = localStorage.getItem('persisted');
    if (data != null) {
      const user: UserData = JSON.parse(data);
      firstName = user.firstName;
      lastName = user.lastName;
      avatar = user.avatar;
    }

    let imageSrc = DefaultImage;
    switch (avatar) {
        case 1: imageSrc = Profile1; break;
        case 2: imageSrc = Profile2; break;
        case 3: imageSrc = Profile3; break;
        case 4: imageSrc = Profile4; break;
        case 5: imageSrc = Profile5; break;
        case 6: imageSrc = Profile6; break;
        case 7: imageSrc = Profile7; break;
        case 8: imageSrc = Profile8; break;
        case 9: imageSrc = Profile9; break;
    }

    const doLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");
      window.location.href = '/';
    };    
    return (
        <> 
            {/* Logout button*/}
            <button 
            type="button"
            id="logoutButton"
            aria-label="logout"
            onClick={doLogout}            
            style={{ float: 'right' }} 
            className="text-3xl border-0 bg-transparent p-0 hover:border-0 hover:text-cyan-700 focus:outline-none cursor-pointer">
            <FaIcons.FaSignOutAlt/>
            </button>
            <Navbar>
                <MenuIconOpen to="#" aria-label="MenuOpen" onClick={showSidebar}>
                <FaIcons.FaBars />
                </MenuIconOpen>
                {/* Logo section */}
            <motion.div
                variants={slideBottom({delay:0.2})}
                initial="initial"
                animate="animate"
                >
                <img src={Logo} alt="Logo" className="w-[100px] mt-5" />
            </motion.div>
            </Navbar>
                {/* Welcome section */}
            <motion.div
            variants={slideUp({delay:0.2})}
            initial="initial"
            animate="animate"
            className="bg-white rounded-lg font-bold text-2xl text-right"
            >
            <p className="italic flex gap-x-2 float-right" >
            Welcome, {firstName} {lastName} !
            <img 
            src={imageSrc}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-2 border-black"/> 
            </p>           
            </motion.div>

            {/* sideMenu section */}
            <SidebarMenu close={close}>
                <MenuIconClose to="#" aria-label="menuClose" onClick={showSidebar}>
                <FaIcons.FaTimes />
                </MenuIconClose>
                {SidebarData.map((item, index) => {
                    return (
                        <MenuItems key={index}>
                            <MenuItemLinks to={item.path}>
                                {item.icon}
                                <span style={{marginLeft: '16px'}}>{item.title}</span>
                            </MenuItemLinks>
                        </MenuItems>
                    )
                })}
            </SidebarMenu>
        </>
    )
}

export default Sidebar;



