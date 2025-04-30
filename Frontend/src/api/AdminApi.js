import axios from "axios"


const BackendURI="http://localhost:5000/";

//get the details of logged in user
export const profileDetails = async (route) => {
    try {
      const response = await axios.get(BackendURI + route);
      console.log(response)
      return response.data; 
    } catch (error) {
      console.error("Error fetching profile:", error);
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






//Get roles in User Section
export const getAllRoles = async(route) => {
  try{
    const response = await axios.get(BackendURI+route)
    return response.data.allRoles
  }
  catch(err){
    console.log(err)
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
    console.log(err)
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
    console.log(err)
    throw err.response.data
  }
}






