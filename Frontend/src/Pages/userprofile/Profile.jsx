import React from 'react'
import ProfileNavbar from './ProfileNavbar'
import AdminProfileSidebar from './ProfileSidebar'
import { Outlet } from 'react-router-dom'

const Profile = () => {
  return (
    <div className='bg-[#efefef] h-screen'>
      <ProfileNavbar/>
      <div className='flex'>
      <AdminProfileSidebar/>
      <span className='pt-24 w-full h-screen  overflow-x-auto p-4' style={{
        scrollbarWidth: "none"
      }}><Outlet/></span>
      </div>
    </div>
  )
}

export default Profile