import axios from "axios"
export const apiCall=async(route,data)=>{
if(!route&&!data) return {message:"error parameter"};
const BackendURI=import.meta.env.VITE_BackendURI;
const URL=BackendURI+route;
console.log(URL);
const response=await axios.post(URL,data);
console.log(response);
return {messge:"successfull"}
}