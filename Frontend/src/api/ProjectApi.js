import axios from "axios"


const BackendURI="http://localhost:5000/";




//======================== Projects ========================

//add new projects
export const addProject = async(route, data) => {
    try{
        const response = await axios.post(BackendURI+route,data)
        return response
    }
    catch(err){
        return err.response.data
    }
}



//get all projects from backend
export const getAllProjects = async(route) => {
    try{
        const response = await axios.get(BackendURI+route)
        // console.log(response.data)
        return response.data
    }
    catch(err){
        return err.response.data
    }
}



//************************ END ************************




//======================== Tasks ========================

//get assignable users in tasks
export const getAllAssignableUsers = async(route) => {
    try{
        const response = await axios.get(BackendURI+route)
        // console.log(response.data)
        return response.data
    }
    catch(err){
        return err.response.data
    }
}




//************************ END ************************

