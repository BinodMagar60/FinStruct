// Utility functions to work with the task data

// Get a specific task by ID
export const getTaskById = (taskData, taskId) => {
    for (const column of taskData) {
      const task = column.tasks.find((task) => task.id === taskId)
      if (task) return task
    }
    return null
  }
  
  // Get all team members assigned to tasks
  export const getAllTeamMembers = (taskData) => {
    const teamMembers = new Map()
  
    for (const column of taskData) {
      for (const task of column.tasks) {
        for (const assigneeId of task.assignees) {
          if (!teamMembers.has(assigneeId)) {
            // In a real app, you would fetch user details from your user database
            // This is just a placeholder
            teamMembers.set(assigneeId, {
              id: assigneeId,
              name: `Team Member ${assigneeId}`,
              initials: `TM${assigneeId}`,
              role: "Team Member",
            })
          }
        }
      }
    }
  
    return Array.from(teamMembers.values())
  }
  
  // Add a comment to a task
  export const addCommentToTask = (taskData, taskId, comment) => {
    const newTaskData = JSON.parse(JSON.stringify(taskData)) // Deep clone
  
    for (const column of newTaskData) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        // If the task doesn't have a comments array, create one
        if (!column.tasks[taskIndex].comments) {
          column.tasks[taskIndex].comments = []
        }
  
        column.tasks[taskIndex].comments.push({
          id: `comment-${Date.now()}`,
          text: comment.text,
          userId: comment.userId,
          createdAt: new Date().toISOString(),
          status: comment.status,
        })
  
        return newTaskData
      }
    }
  
    return taskData // Return original if task not found
  }
  
  