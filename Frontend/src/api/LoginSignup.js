import axios from "axios"

const BackendURI = import.meta.env.VITE_BACKEND_URL + "/";





export const signupUser = async(route, data) => {
    const URL = BackendURI + route
    try{
      const response = await axios.post(URL, data);
        // console.log(response)
        return response.data
    }
    catch (err){
      // console.log(err)
      throw err
    }
}




export const loginUser = async (route, data) => {
  const URL = BackendURI + route
  try{
    const response = await axios.post(URL, data, {
      withCredentials: true
    })
    // console.log(response)
    return response
  }
  catch (err){
    // console.log(err)
    throw err
  }
}



