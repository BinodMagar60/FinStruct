import { useEffect, useState } from "react"
import TeamMembers from "./users/team-members"
import UserDetail from "./users/user-detail"
import AddUserForm from "./users/add-user-form"
import { addUserFromCompany, getAllUsersDetailFromCompany } from "../../api/AdminApi"

export default function User() {
  const userSave = JSON.parse(localStorage.getItem("userDetails"));

 

  const [view, setView] = useState("list") // 'list', 'detail', 'add', 'edit'
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [allUsersDetails, setUsersDetails] = useState([]);

  const [users, setUsers] = useState([])

  const [workers, setWorkers] = useState([])



  useEffect(()=> {
    const getAllDetailsUsers = async() => {
      try{
        const response = await getAllUsersDetailFromCompany(`admin/user/users/${userSave.companyId}`)
        // console.log(response)
        setUsersDetails(response.sanitizedUsers)
      }
      catch(err){
        console.log(err)
      }
    }
    getAllDetailsUsers()
  },[allUsersDetails])

  useEffect(() => {
    if (!allUsersDetails || allUsersDetails.length === 0) return;
  
    const adminanduserDetails = allUsersDetails.filter(user => user.role !== "worker");
    const workersDetails = allUsersDetails.filter(user => user.role === "worker");

    setUsers(adminanduserDetails)
    setWorkers(workersDetails)

  }, [allUsersDetails]);
  





  const handleViewUser = (userId) => {
    setSelectedUserId(userId)
    setView("detail")
  }

  const handleAddUser = () => {
    setView("add")
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setView("edit")
  }

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user._id !== userId))
    setWorkers(workers.filter((worker) => worker._id !== userId))
  }

  const handleBackToList = () => {
    setView("list")
    setEditingUser(null)
  }

  const handleSubmitUser = async(userData) => {
    if (userData._id) {
      // Editing existing user
      if (userData.role === "worker") {
        setWorkers(workers.map((worker) => (worker._id === userData._id ? { ...worker, ...userData } : worker)))
      } else {
        setUsers(users.map((user) => (user._id === userData._id ? { ...user, ...userData } : user)))
      }
    } else {
      // Add new user
      const newUser = {
        ...userData,
        _id: Math.random().toString(36).substr(2, 9),
      }

      console.log(newUser)
      try{
        const response = await addUserFromCompany(`admin/user/users/${userSave.companyId}`, newUser)
        console.log(response)

        if (userData.role === "worker") {
          setWorkers([...workers, newUser])
        } else {
          setUsers([...users, newUser])
        }
      }catch(err){
        console.log(err)
      }

      
    }

    setEditingUser(null)
    setView("list")
  }

  return (
    <div className="p-6">
      <div className="container mx-auto p-4 bg-white pb-8 rounded">
      <TeamMembers
        users={users}
        workers={workers}
        onViewUser={handleViewUser}
        onAddUser={handleAddUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      {view === "detail" && selectedUserId && (
        <UserDetail userId={selectedUserId} users={[...users, ...workers]} onBack={handleBackToList} />
      )}

      {(view === "add" || view === "edit") && (
        <AddUserForm
          onClose={handleBackToList}
          onSubmit={handleSubmitUser}
          userData={view === "edit" ? editingUser : null}
        />
      )}
    </div>
    </div>
  )
}
