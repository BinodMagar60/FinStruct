import axios from "axios"

const BackendURI="http://localhost:5000/";




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



