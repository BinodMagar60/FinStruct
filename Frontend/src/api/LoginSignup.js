import axios from "axios"

export const apiCall=async(route,data)=>{
if(!route&&!data) return {message:"error parameter"};
const BackendURI="http://localhost:5000/";
const URL=BackendURI+route;
console.log(URL);
const response=await axios.post(URL,data,{
    withCredentials:true
});
console.log(response);
// return {messge:"successfull"}
return response
}

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
  
