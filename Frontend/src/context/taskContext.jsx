  import { createContext, useContext, useEffect, useState } from "react"
import { addNewSubTask, addNewTask, deleteSubtaskBackend, deleteTaskFromBackend, getAllAssignableUsers, getAllTasksBackend, updateSubTaskBackend, updateTheTaskBackend, updateTheTaskBackendOnMoved } from "../api/ProjectApi"

// Create the context
const TaskContext = createContext(null)



// Create the provider component
export function TaskProvider({ children }) {
  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));
  const locallySavedProject = localStorage.getItem("projectId")
  const [columns, setColumns] = useState([])
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [modalMode, setModalMode] = useState("add") 
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [change, setChange] = useState(false)


// get all the assignable users data from the backend
  useEffect(()=> {
    const fetchAssignableUsers = async() => {
      try{
        const response = await getAllAssignableUsers(`projects/tasks/users/${locallySavedUser.companyId}`)
        // console.log(response)
        setUsers(response)
      }
      catch(error){
        console.log(error)
      }
    }
    fetchAssignableUsers()
  },[change])


  // get all the task data from the backend
  useEffect(() => {
    const fetchInitialData = async() => {
      try {
        const response = await getAllTasksBackend(`projects/tasks/task/${locallySavedProject}`)
        // console.log(response)
        setColumns(response)
      } catch (error) {
        console.log(error)
      }
    };
    fetchInitialData();
  }, [change]);

  
  const handleCreateTask = () => {
    setCurrentTask(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEditTask = (task, columnId) => {
    setCurrentTask({ ...task, columnId })
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleDeleteTask = (taskId, columnId) => {
    // console.log(taskId)
    const deleteTheTask = async(taskId) => {
      try{
        await deleteTaskFromBackend(`projects/tasks/task/${taskId}`)
        setChange(prev => !prev)
      }
      catch(error){
        console.log(error)
      }
    }
    deleteTheTask(taskId)
 
  }


//add new task here
  const handleAddTask = async(task) => {
    const specialSubtask = {
      id: `subtask-main-${Date.now()}`,
      title: task.title,
      completed: false,
      isMainSubtask: true, 
    }

    const newTask = {
      id: `task-${Date.now()}`,
      ...task,
      createdAt: new Date().toISOString(),
      subtasks: [specialSubtask], 
      assets: [],
      activities: [
        {
          type: "TaskCreated",
          user: "System",
          timestamp: new Date().toISOString(),
          message: "Task created!",
        },
      ],
      team: task.assignees
        ? task.assignees.map((id) => {
            const user = users.find((u) => u.id === id)
            return {
              id: user.id,
              name: user.name,
              initials: user.initials,
              role: "Team Member",
            }
          })
        : [],
      status: task.stage === "todo"? "TO DO": task.stage === "inprogress"? "IN PROGRESS": task.stage === "completed"? "COMPLETED": "ON HOLD",
    }

    try{
      await addNewTask(`projects/tasks/task/${locallySavedProject}`,newTask)
      setChange(prev => !prev)
      }
    catch(error){
      console.log(error)
    }
    setIsModalOpen(false)
  }


  //update the task in task modal
  const handleUpdateTask = (updatedTask) => {
    const updateTheTask = async(updatedTask) => {
      try{
        const response = await updateTheTaskBackend(`projects/tasks/task/${updatedTask.id}`,updatedTask)
        setChange(prev => !prev)
      }
      catch(error){
        console.log(error)
      }
    }
    updateTheTask(updatedTask)
    setIsModalOpen(false)
  }

  // Modify the moveTask function to prevent moving completed tasks
  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return

    const sourceColumn = columns.find((col) => col.id === sourceColumnId)
    const task = sourceColumn.tasks.find((t) => t.id === taskId)

    // Prevent moving tasks from the completed column
    if (sourceColumnId === "completed") {
      return
    }

    // Add activity for task movement
    const updatedTask = {
      ...task,
      activities: [
        {
          type: "Moved",
          user: "Current User",
          timestamp: new Date().toISOString(),
          message: `Task moved from ${sourceColumn.title} to ${columns.find((col) => col.id === targetColumnId).title}`,
        },
        ...(task.activities || []),
      ],
      status: columns.find((col) => col.id === targetColumnId).title,
    }

    // console.log(targetColumnId, taskId)

    const newData = {targetColumnId, taskId}

    const moveTaskOnServer = async (data) => {
      try {
        const response  = await updateTheTaskBackendOnMoved(`projects/tasks/movetask`,data)
        
      } catch (error) {
        console.error(error);
      }
    };
    moveTaskOnServer(newData);
    setColumns(
      columns.map((column) => {
        // Remove from source column
        if (column.id === sourceColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter((t) => t.id !== taskId),
          }
        }
        // Add to target column
        if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, updatedTask],
          }
        }
        return column
      }),
    )
  }

  
  const addSubtask = (parentTaskId, columnId, subtaskData = null) => {
  
    const addSubtaskOnServer = async(parentTaskId, subtaskData) => {
      try{
        const activities = {
          type: "Commented",
          user: locallySavedUser.username,
          timestamp: new Date().toISOString(),
          message: `Added subtask: ${subtaskData.title}`,
        };

        await addNewSubTask(`projects/tasks/subtask/${parentTaskId}`, subtaskData, activities);
        setChange(prev => !prev)
      }
      catch(error){
        console.log(error)
      }
    }
    addSubtaskOnServer(parentTaskId, subtaskData)

  }

// update subtask tasks
  const updateSubtask = async (parentTaskId, columnId, subtaskId, updates) => {
  try {
    const user = locallySavedUser.username
    const response = await updateSubTaskBackend(`projects/tasks/subtask/${parentTaskId}/${subtaskId}`, updates, user);
    // console.log(response)
    setChange(prev => !prev)
    
  } catch (error) {
    console.error('Error updating subtask:', error);
  }
};



  // Modify the deleteSubtask function to prevent deletion of the special subtask
  const deleteSubtask = (parentTaskId, columnId, subtaskId) => {
  const deleteSubtaskFromServer = async () => {
    try {
      const user = locallySavedUser.username;
      const response = await deleteSubtaskBackend(parentTaskId, subtaskId, user);
      setChange(prev=> !prev)
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  deleteSubtaskFromServer();
};



  // Get all tasks across all columns
  const getAllTasks = () => {
    return columns.flatMap((column) =>
      column.tasks.map((task) => ({
        ...task,
        columnId: column.id,
        columnTitle: column.title,
      })),
    )
  }

  // Open task detail view
  const openTaskDetail = (taskId) => {
    setSelectedTaskId(taskId)
    setShowTaskDetail(true)
  }

  // Close task detail view
  const closeTaskDetail = () => {
    setSelectedTaskId(null)
    setShowTaskDetail(false)
  }

  // Modify the updateTaskDetails function to prevent unnecessary updates
  // Replace the current updateTaskDetails function with this implementation:

  // Update task details from task detail view
  const updateTaskDetails = (taskId, updates) => {
    // First check if there's actually a change to avoid unnecessary updates
    let needsUpdate = false
    const updatedColumns = [...columns]

    // Check if we need to update
    columns.forEach((column, columnIndex) => {
      column.tasks.forEach((task, taskIndex) => {
        if (task.id === taskId) {
          // Deep compare to check if anything actually changed
          const assetsChanged = JSON.stringify(task.assets) !== JSON.stringify(updates.assets)
          const teamChanged = JSON.stringify(task.team) !== JSON.stringify(updates.team)
          const activitiesChanged = JSON.stringify(task.activities) !== JSON.stringify(updates.activities)
          const statusChanged = task.status !== updates.status

          if (assetsChanged || teamChanged || activitiesChanged || statusChanged) {
            needsUpdate = true

            // Create a new task object with the updates
            const updatedTask = {
              ...task,
              assets: updates.assets || task.assets,
              team: updates.team || task.team,
              activities: updates.activities || task.activities,
              status: updates.status || task.status,
            }

            // Update the task in our copy of columns
            updatedColumns[columnIndex].tasks[taskIndex] = updatedTask
          }
        }
      })
    })

    // Only update state if something changed
    if (needsUpdate) {
      // API call to update task details
      // Example:
      // const updateTaskDetailsOnServer = async (taskId, updates) => {
      //   try {
      //     await fetch(`/api/tasks/${taskId}/details`, {
      //       method: 'PUT',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(updates)
      //     });
      //     // Continue with state update after successful API call
      //   } catch (error) {
      //     console.error('Error updating task details:', error);
      //   }
      // };
      // updateTaskDetailsOnServer(taskId, updates);
      setColumns(updatedColumns)
    }
  }

  // Add this function before the context value
  const updateColumns = (newColumns) => {
    setColumns(newColumns)
  }

  // Add this function to the TaskProvider component, before the context value
  const updateTask = (taskId, updates) => {
    let taskFound = false

    // Create a deep copy of columns to avoid direct state mutation
    const updatedColumns = JSON.parse(JSON.stringify(columns))

    // Find and update the task in the appropriate column
    for (const column of updatedColumns) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        // Found the task, update it with the provided updates
        updatedColumns[column.id].tasks[taskIndex] = {
          ...updatedColumns[column.id].tasks[taskIndex],
          ...updates,
        }
        taskFound = true
        break
      }
    }

    // Only update state if we found and updated the task
    if (taskFound) {
      setColumns(updatedColumns)
    }

    return taskFound
  }

  // Update the context value to include the new updateTask function
  const value = {
    columns,
    users,
    isModalOpen,
    currentTask,
    modalMode,
    selectedTaskId,
    showTaskDetail,
    change,
    setChange,
    setIsModalOpen,
    setCurrentTask,
    setModalMode,
    handleCreateTask,
    handleEditTask,
    handleDeleteTask,
    handleAddTask,
    handleUpdateTask,
    moveTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    getAllTasks,
    openTaskDetail,
    closeTaskDetail,
    updateTaskDetails,
    updateColumns,
    updateTask,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

// Custom hook to use the task context
export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
