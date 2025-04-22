import axios from "axios"

const BackendURI="http://localhost:5000/";




export const signupUser = async(route, data) => {
    const URL = BackendURI + route

   
        const response = await axios.post(URL, data, {
            withCredentials: true
        });

        // console.log(response.data)
        return response.data
        
    
}


export const loginUser = async (route, data) => {
    const URL = BackendURI + route;
    const response = await axios.post(URL, data, {
      withCredentials: true
    });
    // console.log(response.data)
    return response;
  };
  
