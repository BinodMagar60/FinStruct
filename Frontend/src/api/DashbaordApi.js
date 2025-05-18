import axios from "axios";

const BackendURI = "http://localhost:5000/";

//top part
export const getTopPartData = async(id) => {
    try{
        const response = await axios.get(`${BackendURI}dashbaord/first/${id}`)
        return response.data
    }
    catch(error){
        return error.response.data
    }
}

//get financial part
export const getFinancialPart = async(id) => {
    try{
        const response = await axios.get(`${BackendURI}dashbaord/financialsummary/${id}`)
        return response.data
    }
    catch(error){
        return error.response.data
    }
}




//get projects part
export const getProjectParts = async(id) => {
    try{
        const response = await axios.get(`${BackendURI}dashbaord/projectstatus/${id}`)
        return response.data
    }
    catch(error){
        return error.response.data
    }
}




//get Users
export const getUserParts = async(id) => {
    try{
        const response = await axios.get(`${BackendURI}dashbaord/teammembers/${id}`)
        return response.data
    }
    catch(error){
        return error.response.data
    }
}