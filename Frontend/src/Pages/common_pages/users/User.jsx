import { useEffect, useState } from "react"
import TeamMembers from "./team-members"
import UserDetail from "./user-detail"
import AddUserForm from "./add-user-form"
import { addUserFromCompany, deleteUserDetails, getAllUsersDetailFromCompany, updateUserDetails } from "../../../api/AdminApi"
import { ChevronsRightLeft } from "lucide-react"
import Loading from "../../../Components/Loading"

export default function User() {
  const userSave = JSON.parse(localStorage.getItem("userDetails"));

  

  const [view, setView] = useState("list") 
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [isLoading, setLoading] = useState(true)
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
      finally{
        setLoading(false)
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

  const handleDeleteUser = async(userId) => {
    // console.log(userId)
    try{
      const response = await deleteUserDetails(`admin/user/users/${userId}/${userSave.id}`)
      // console.log(response)
    }catch(err){
      console.log(err)
    }
  }

  const handleBackToList = () => {
    setView("list")
    setEditingUser(null)
  }

  const handleSubmitUser = async(userData) => {
    if (userData._id) {
      // console.log(userData)

      try{
        const response = await updateUserDetails(`admin/user/users/${userData._id}`, userData)
      // console.log(response)
      }
      catch(err){
        console.log(err)
      }

    } else {
      
      try{
        const response = await addUserFromCompany(`admin/user/users/${userSave.companyId}/${userSave.id}`, userData)
        // console.log(response)
      }catch(err){
        console.log(err)
      }
    }

    setEditingUser(null)
    setView("list")
  }

  return (
    <div className="">
      <div className="container mx-auto p-4 bg-white pb-8 rounded">
      {
        isLoading? <Loading/> : <>
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
        </>
      }
    </div>
    </div>
  )
}
