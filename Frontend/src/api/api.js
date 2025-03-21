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
return {messge:"successfull"}
}