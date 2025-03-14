import React from 'react'
import ProfileNavbar from '../../Components/ProfileNavbar'
import AdminProfileSidebar from './AdminProfileSidebar'

const Profile = () => {
  return (
    <div className='bg-[#efefef] h-screen'>
      <ProfileNavbar/>
      <AdminProfileSidebar/>
    </div>
  )
}

export default Profile