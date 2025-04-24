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

