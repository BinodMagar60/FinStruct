import React from 'react'

const AdminProfileSidebar = () => {
    const sidebar = [
        {
            name: "profile",
            logo: ""
        },
        {
            name: "profile",
            logo: ""
        },
        {
            name: "profile",
            logo: ""
        }
    ]
  return (
    <>
    <div className="fixed top-0 left-0 h-screen w-64 bg-white pt-24">
      <ul>
        {
            sidebar.map((item, index)=>{
                return <li key={index}>{item.name}</li>
            })
        }
      </ul>
    </div>
    </>
  )
}

export default AdminProfileSidebar