import React from 'react'
import ProfileNavbar from '../../Components/ProfileNavbar'
import AdminProfileSidebar from './AdminProfileSidebar'
import { Outlet } from 'react-router-dom'

const Profile = () => {
  return (
    <div className='bg-[#efefef] h-screen'>
      <ProfileNavbar/>
      <div className='flex'>
      <AdminProfileSidebar/>
      <span className='pt-24 w-full h-screen mx-15 overflow-x-auto p-5' style={{
        scrollbarWidth: "none"
      }}><Outlet/></span>
      </div>
    </div>
  )
}

export default Profile