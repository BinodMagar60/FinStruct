import axios from "axios"


const BackendURI="http://localhost:5000/";

//======================== User Profile ========================
//save notes in navbar
export const navbarNotesSave = async(route, data) => {
  try{
    const response = await axios.post(BackendURI+route,data)
    return response.data
  }
  catch(error){
    throw error.response.data
  }
}

//get data of saved notes in navbar
export const navbarNotesPull = async(route) => {
  try{
    const response = await axios.get(BackendURI+route)
    return response.data
  }
  catch(error){
    throw error.response.data
  }
}

//update data of saved notes in navbar
export const navbaNotesUpdate = async(route, data)=>{
  try{  
    const response = await axios.put(BackendURI+route, data)
    return response.data
  }
  catch(error){
    throw error.response.data
  }
}

//delete note in navbar
export const navbarNotesDelete = async(route) => {
  try{
    const response = await axios.delete(BackendURI+route)
    return response.data
  }
  catch(err){
    throw err.response.data
  }
}

//get notification about mails in top
export const getNotificationData = async(route) => {
  try{
    const response = await axios.get(BackendURI+route)
    return response.data.data
  }
  catch(err){
    throw err.response.data
  }
}

//************************ END ************************








//======================== User Profile ========================

//get the details of logged in user
export const profileDetails = async (route) => {
    try {
      const response = await axios.get(BackendURI + route);
      // console.log(response)
      return response.data; 
    } catch (error) {
      // console.error("Error fetching profile:", error);
      throw error; 
    }
  };

  //update the details of logged in user
export const profileDetailsUpdate = async(route, data) => {
  try{
    const response = await axios.put(BackendURI+route,data)
    // console.log(response)

    return response.data
  }
  catch(err){
    console.error("Error updating profile: ", err)
    throw err
  }
}


//update the password for logged in user
export const changePassword = async(route, data) => {
  try{
    const response = await axios.put(BackendURI+route, data)
    // console.log(response)
    return response.data
  }
  catch (err){
    console.error("Error changing the password: ",err)
    throw err.response.data
  }
}

//************************ END ************************










//======================== Salaries Section ========================

//get all the user data to salary section
export const getAllUserForSalary = async(route) => {
  try{
    const response = await axios.get(BackendURI+route)
    return response.data
  }
  catch(err){
    throw err.response.data
  }
}

//update users salary in salary section
export const updateUserSalary =  async(route, data) => {
  try{
    const response = await axios.put(BackendURI+route, data)
    return response.data
  }
  catch(err){
    throw err.response.data
  }
}




//Add roles and salaries
export const addRolesAndSalaries = async(route, data) => {
  try{
    const response = await axios.post(BackendURI+route, data)
    // console.log(response)
    return response.data
  }
  catch (err){
    // console.error(err)
    throw err.response.data
  }
}



//Show roles and salaries
export const getRolesAndSalaries = async(route) => {
  try{
    const response = await axios.get(BackendURI+route)
    // console.log(response)
    return response.data
  }
  catch (err){
    console.error(err)
    throw err.response.data
  }
}



//Update roles and salaries

export const updateRolesAndSalaries = async(route, data) => {
  try{
    const response = await axios.put(BackendURI+route, data)
    // console.log(response)
    return response.data.updatedValues
  }
  catch(err){
    // console.log(err)
    throw err.response.data
  }
}



//Delete roles and salaries
export const DeleteRolesAndSalaries = async(route)=> {
  try{
   const response = await axios.delete(BackendURI+route)
   return response
  }
  catch(err){
    // console.log(err)
    throw err.response.data
  }
}

//************************ END ************************











//======================== Users Section ========================



//Get roles in User Section
export const getAllRoles = async(route) => {
  try{
    const response = await axios.get(BackendURI+route)
    return response.data.allRoles
  }
  catch(err){
    // console.log(err)
    throw err.response.data
  }
}

//add users from the companies dashboard
export const addUserFromCompany = async(route,data) => {
  try{
    const response =  await axios.post(BackendURI+route, data)
    return response.data
  }
  catch (err){
    // console.log(err)
    throw err.response.data
  }
}

//get all the companies user details
export const getAllUsersDetailFromCompany = async(route) => {
  try{
    const response = await axios.get(BackendURI+route)
    return response.data
  }
  catch(err){
    // console.log(err)
    throw err.response.data
  }
}

//update the user details in User section
export const updateUserDetails = async(route, data) => {
  try{
    const response = await axios.put(BackendURI+route, data)
    return response.data
  }
  catch(err){
    // console.log(err)
    throw err.response.data
  }
}

//delete the user from User section
export const deleteUserDetails = async(route) => {
  try{
    const response = await axios.delete(BackendURI+route)
    return response.data
  }
  catch(err){
    // console.log(err)
    throw err.response.data
  }
}



//************************ END ************************









//======================== Mail Section ========================

//add mail for mail section
export const sendMailApi = async(route,data)=> {
  try{
    const response = await axios.post(BackendURI+route, data)
    console.log(response)
    return response.data
  }
  catch(err){
    throw err.response.data
  }
}


//get mail for mail section
export const receiveMailApi = async(route) => {
  try{
    const response = await axios.get(BackendURI+route)
    return response.data.data
  }
  catch(err){
    throw err.response.data
  }
}


//get Users data for showing recommend in compose mail
export const receiveMailUsersApi = async(route) => {
  try{
    const response = await axios.get(BackendURI+route)
    return response.data
  }
  catch(err){
    throw err.response.data
  }
}


//update the status of mail to read
export const updateMailApi = async(route) =>{
  try{
    const response = await axios.put(BackendURI+route)
    return response.data
  }
  catch(err){
    throw err.response.data
  }
}

export const deleteMailApi = async(route) => {
  try{
    const response = await axios.delete(BackendURI+route)
    return response.data
  }
  catch(err){
    throw err.response.data
  }
}


//************************ END ************************


