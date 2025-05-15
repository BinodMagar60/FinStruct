import axios from "axios"


const BackendURI="http://localhost:5000/useractivity";




//======================== get Activity ========================
//get activity
export const getAllActivities = async(id)=> {
    try{
        const response = await axios.get(`${BackendURI}/getactivity/${id}`)
        return response.data
    }
    catch(err){
        return err.response.data
    }
}

//************************ END ************************




//======================== loggout ========================

export const loggoutActivity = async(id)=> {
    try{
        const response = await axios.post(`${BackendURI}/logout/${id}`)
        return response.data
    }
    catch(err){
        return err.response.data
    }
}

//************************ END ************************



//======================== Account created/updates ========================




//************************ END ************************
