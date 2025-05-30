import axios from "axios";

const BackendURI = "http://localhost:5000/";

//======================== Projects ========================

//add new projects
export const addProject = async (route, data) => {
  try {
    const response = await axios.post(BackendURI + route, data);
    return response;
  } catch (err) {
    return err.response.data;
  }
};

//get all projects from backend
export const getAllProjects = async (route) => {
  try {
    const response = await axios.get(BackendURI + route);
    // console.log(response.data)
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//************************ END ************************





//======================== Tasks ========================

//get assignable users in tasks
export const getAllAssignableUsers = async (route) => {
  try {
    const response = await axios.get(BackendURI + route);
    // console.log(response.data)
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//add new task
export const addNewTask = async (route, data) => {
  try {
    const response = await axios.post(BackendURI + route, data);
    // console.log(response.data)
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//get all the tasks from backend
export const getAllTasksBackend = async (route) => {
  try {
    const response = await axios.get(BackendURI + route);
    // console.log(response)
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//Update Task
export const updateTheTaskBackend = async (route, data) => {
  try {
    const response = await axios.put(BackendURI + route, data);
    // console.log(response.data)
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//updating task when moved to another column
export const updateTheTaskBackendOnMoved = async (route, data) => {
  try {
    const response = await axios.put(BackendURI + route, data);
    // console.log(response.data)
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//updating task when moved on ganttchart
export const updateTheTaskBackendOnMovedGanttChart = async (route, data) => {
  try {
    const response = await axios.put(BackendURI + route, data);
    // console.log(response.data)
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//updating task when moved on ganttchart dependencies
export const updateTheTaskBackendOnMovedGanttChartDependencies = async (
  id,
  dependencies
) => {
  try {
    const response = await axios.put(
      `${BackendURI}projects/tasks/ganttchart/dependencies/${id}`,
      { dependencies }
    );
    // console.log(response.data)
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//delete tasks
export const deleteTaskFromBackend = async (route) => {
  try {
    const response = await axios.delete(BackendURI + route);
    // console.log(response.data)
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//adding Subtask
export const addNewSubTask = async (route, data, activity) => {
  try {
    const response = await axios.post(BackendURI + route, {
      ...data,
      activity,
    });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//deleting subtask
export const deleteSubtaskBackend = async (taskId, subtaskId, user) => {
  try {
    const response = await axios.delete(
      `${BackendURI}projects/tasks/subtask/${taskId}/${subtaskId}`,
      {
        data: { user },
      }
    );
    return response.data;
  } catch (err) {
    return err.response?.data || { message: "Unknown error" };
  }
};

//updating subtask
export const updateSubTaskBackend = async (route, updates, user) => {
  try {
    const response = await axios.put(BackendURI + route, {
      ...updates,
      user,
    });
    return response;
  } catch (error) {
    return error.response?.data || { message: "Unknown error" };
  }
};

//add comments
export const addComments = async (route, data) => {
  try {
    const response = await axios.post(BackendURI + route, data);
    // console.log(response)
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

//get task details for taskDetails section
export const getTaskDetailsForDetailsSection = async (route) => {
  try {
    const response = await axios.get(BackendURI + route);
    // console.log(response)
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

//add image as assets
export const addImgAsAssets = async (route, data) => {
  try {
    const response = await axios.post(BackendURI + route, data);
    // console.log(response)
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

//delete Assets
export const deleteAssetsBackend = async (route) => {
  try {
    const response = await axios.delete(BackendURI + route);
    return response.data;
  } catch (err) {
    return err.response?.data || { message: "Unknown error" };
  }
};

//************************ END ************************






//======================== Transaction ========================

//add new transaction
export const addNewTransaction = async (data) => {
  try {
    const response = await axios.post(
      `${BackendURI}projects/transactions/new`,
      data
    );
  } catch (err) {
    return err.response.data;
  }
};

//get transaction
export const getAllTransactions = async (route) => {
  try {
    const response = await axios.get(
      `${BackendURI}projects/transactions/get/${route}`
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//approve the transaction
export const approveTheTransaction = async (route, data) => {
  try {
    const response = await axios.put(
      `${BackendURI}projects/transactions/approve/${route}`,
      data
    );
    // console.log(response)
    return response;
  } catch (err) {
    return err.response.data;
  }
};

//approve the transaction
export const rejectTheTransaction = async (route, data) => {
  try {
    const response = await axios.put(
      `${BackendURI}projects/transactions/reject/${route}`,
      data
    );
    // console.log(response)
    return response;
  } catch (err) {
    return err.response.data;
  }
};

//************************ END ************************






//======================== Task Schudeling ========================

//sorting algorithm task
export const sortedTasksByWeight = async (id) => {
  try {
    const response = await axios.get(
      `${BackendURI}projects/project/${id}/sorted-tasks`
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

//************************ END ************************





//======================== Overview ========================

//get details about overview details
export const getOverViewData = async(id) => {
  try {
    const response = await axios.get(
      `${BackendURI}projects/overview/${id}`
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}


//update project in overview
export const updateProjectDetailInOverview = async(id, data) => {
  try {
    const response = await axios.put(
      `${BackendURI}projects/overview/projectdetail/${id}`, data
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}


//get project details in overview
export const getProjectDetailInOverview = async(id) => {
  try {
    const response = await axios.get(
      `${BackendURI}projects/overview/projectdetail/${id}`
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}



//delete the project
export const deleteProjectDetailInOverview = async(id) => {
  try {
    const response = await axios.delete(
      `${BackendURI}projects/overview/projectdetail/${id}`
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
}

//************************ END ************************
