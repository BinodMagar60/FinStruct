import axios from "axios"

const BackendURI="http://localhost:5000/";

//get the details of logged in user
export const profileDetails = async (route) => {
    try {
      const response = await axios.get(BackendURI + route);
      return response.data; 
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error; 
    }
  };

export const profileDetailsUpdate = async(route, data) => {
  try{
    const response = await axios.put(BackendURI+route,data)
    console.log(response)

    return response.data
  }
  catch(err){
    console.error("Error updating profile: ", err)
    throw err
  }
}