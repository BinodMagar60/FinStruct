  import { createContext, useContext, useState } from "react"

// Create the context
const TaskContext = createContext(null)

// Initial dummy data
const initialColumns = [
  {
    id: "todo",
    title: "TO DO",
    color: "blue",
    tasks: [
      {
        id: "task-1",
        title: "Research competitors",
        priority: "high",
        startingDate: "2025-03-20",
        dueDate: "2025-04-15",
        assignees: [1, 2],
        createdAt: "2025-03-20",
        dependencies: [],
        subtasks: [
          {
            id: "subtask-1-1",
            title: "Identify top 5 competitors",
            completed: true,
          },
          {
            id: "subtask-1-2",
            title: "Analyze pricing strategies",
            completed: false,
          },
        ],
        assets: [
          { id: 1, name: "Competitor Analysis", url: "/placeholder.svg?height=200&width=400" },
          { id: 2, name: "Market Research", url: "/placeholder.svg?height=200&width=400" },
        ],
        activities: [
          {
            type: "TaskCreated",
            user: "System",
            timestamp: "2025-03-20T10:00:00Z",
            message: "Task created!",
          },
          {
            type: "Commented",
            user: "John Doe",
            timestamp: "2025-03-21T14:30:00Z",
            message: "Started researching top competitors in the market.",
          },
        ],
        team: [
          { id: 1, name: "John Doe", role: "Marketing Specialist", initials: "JD" },
          { id: 2, name: "Jane Smith", role: "Market Analyst", initials: "JS" },
        ],
        status: "IN PROGRESS",
      },
      {
        id: "task-2",
        title: "User interviews",
        priority: "normal",
        startingDate: "2025-03-20",
        dueDate: "2025-04-10",
        assignees: [3],
        createdAt: "2025-03-22",
        dependencies: ["task-1"],
        subtasks: [],
        assets: [],
        activities: [
          {
            type: "TaskCreated",
            user: "System",
            timestamp: "2025-03-22T10:00:00Z",
            message: "Task created!",
          },
        ],
        team: [{ id: 3, name: "Alex Johnson", role: "UX Researcher", initials: "AJ" }],
        status: "TO DO",
      },
    ],
  },
  {
    id: "inprogress",
    title: "IN PROGRESS",
    color: "orange",
    tasks: [
      {
        id: "task-3",
        title: "Create wireframes",
        priority: "high",
        startingDate: "2025-03-20",
        dueDate: "2025-04-05",
        assignees: [2, 4],
        createdAt: "2025-03-18",
        dependencies: [],
        subtasks: [
          {
            id: "subtask-3-1",
            title: "Homepage design",
            completed: true,
          },
          {
            id: "subtask-3-2",
            title: "Product page layout",
            completed: true,
          },
          {
            id: "subtask-3-3",
            title: "Checkout flow",
            completed: false,
          },
        ],
        assets: [
          { id: 1, name: "Homepage Wireframe", url: "/placeholder.svg?height=200&width=400" },
          { id: 2, name: "Product Page Wireframe", url: "/placeholder.svg?height=200&width=400" },
        ],
        activities: [
          {
            type: "TaskCreated",
            user: "System",
            timestamp: "2025-03-18T10:00:00Z",
            message: "Task created!",
          },
          {
            type: "Commented",
            user: "Jane Smith",
            timestamp: "2025-03-19T14:30:00Z",
            message: "Started working on homepage wireframes.",
          },
          {
            type: "Commented",
            user: "New User",
            timestamp: "2025-03-20T09:15:00Z",
            message: "Product page wireframes completed for review.",
          },
        ],
        team: [
          { id: 2, name: "Jane Smith", role: "UI Designer", initials: "JS" },
          { id: 4, name: "New User", role: "UX Designer", initials: "NU" },
        ],
        status: "IN PROGRESS",
      },
    ],
  },
  {
    id: "completed",
    title: "COMPLETED",
    color: "green",
    tasks: [
      {
        id: "task-4",
        title: "Project kickoff meeting",
        priority: "normal",
        startingDate: "2025-03-20",
        dueDate: "2025-03-15",
        assignees: [1, 2, 3, 4],
        createdAt: "2025-03-10",
        dependencies: [],
        subtasks: [
          {
            id: "subtask-4-1",
            title: "Prepare agenda",
            completed: true,
          },
          {
            id: "subtask-4-2",
            title: "Send invites",
            completed: true,
          },
        ],
        assets: [
          { id: 1, name: "Meeting Agenda", url: "/placeholder.svg?height=200&width=400" },
          { id: 2, name: "Project Timeline", url: "/placeholder.svg?height=200&width=400" },
        ],
        activities: [
          {
            type: "TaskCreated",
            user: "System",
            timestamp: "2025-03-10T10:00:00Z",
            message: "Task created!",
          },
          {
            type: "Commented",
            user: "Alex Johnson",
            timestamp: "2025-03-12T14:30:00Z",
            message: "Agenda has been prepared for the kickoff meeting.",
          },
          {
            type: "Commented",
            user: "Emily Wilson",
            timestamp: "2025-03-14T09:15:00Z",
            message: "Meeting invites have been sent to all stakeholders.",
          },
          {
            type: "Completed",
            user: "John Doe",
            timestamp: "2025-03-15T16:00:00Z",
            message: "Meeting completed successfully.",
          },
        ],
        team: [
          { id: 1, name: "John Doe", role: "Project Manager", initials: "JD" },
          { id: 2, name: "Jane Smith", role: "Business Analyst", initials: "JS" },
          { id: 3, name: "Alex Johnson", role: "Developer", initials: "AJ" },
          { id: 4, name: "New User", role: "Designer", initials: "NU" },
        ],
        status: "COMPLETED",
      },
    ],
  },
  {
    id: "onhold",
    title: "ON HOLD",
    color: "red",
    tasks: [],
  },
]

const initialUsers = [
  { id: 1, name: "John Doe", initials: "JD", color: "bg-green-500" },
  { id: 2, name: "Jane Smith", initials: "JS", color: "bg-blue-500" },
  { id: 3, name: "Alex Johnson", initials: "AJ", color: "bg-purple-500" },
  { id: 4, name: "New User", initials: "NU", color: "bg-red-500" },
]

// Utility functions
export const getTaskById = (taskData, taskId) => {
  for (const column of taskData) {
    const task = column.tasks.find((task) => task.id === taskId)
    if (task) return task
  }
  return null
}

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

// Add a new function to check if all subtasks are completed
const areAllSubtasksCompleted = (task) => {
  if (!task.subtasks || task.subtasks.length === 0) return false
  return task.subtasks.every((subtask) => subtask.completed)
}

// Create the provider component
export function TaskProvider({ children }) {
  const [columns, setColumns] = useState(initialColumns)
  const [users, setUsers] = useState(initialUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [modalMode, setModalMode] = useState("add") // 'add', 'edit'
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)

  // Initial data loading - Replace the useState initializations with API calls
  // Example:
  // useEffect(() => {
  //   const fetchInitialData = async () => {
  //     try {
  //       const response = await fetch('/api/tasks');
  //       const data = await response.json();
  //       setColumns(data.columns);
  //       setUsers(data.users);
  //     } catch (error) {
  //       console.error('Error fetching initial data:', error);
  //     }
  //   };
  //   fetchInitialData();
  // }, []);

  // Task manipulation functions
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
    // API call to delete a task
    // Example:
    // const deleteTaskFromServer = async (taskId) => {
    //   try {
    //     await fetch(`/api/tasks/${taskId}`, {
    //       method: 'DELETE'
    //     });
    //     // Continue with state update after successful API call
    //   } catch (error) {
    //     console.error('Error deleting task:', error);
    //   }
    // };
    // deleteTaskFromServer(taskId);
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          }
        }
        return column
      }),
    )
  }

  // Modify the handleAddTask function to automatically add a subtask with the same title
  const handleAddTask = (task) => {
    // Create a special subtask with the same title as the task
    const specialSubtask = {
      id: `subtask-main-${Date.now()}`,
      title: task.title,
      completed: false,
      isMainSubtask: true, // Flag to identify this as the special subtask
    }

    const newTask = {
      id: `task-${Date.now()}`,
      ...task,
      createdAt: new Date().toISOString(),
      subtasks: [specialSubtask], // Initialize with the special subtask
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
      status: "TO DO",
    }

    // API call to create a new task
    // Example:
    // const createTask = async (newTask) => {
    //   try {
    //     const response = await fetch('/api/tasks', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(newTask)
    //     });
    //     const data = await response.json();
    //     // Update local state with the returned task (which might include server-generated IDs)
    //     setColumns(/* update with returned data */);
    //   } catch (error) {
    //     console.error('Error creating task:', error);
    //   }
    // };
    // createTask(newTask);
    setColumns(
      columns.map((column) => {
        if (column.id === task.stage) {
          return {
            ...column,
            tasks: [...column.tasks, newTask],
          }
        }
        return column
      }),
    )

    setIsModalOpen(false)
  }

  const handleUpdateTask = (updatedTask) => {
    // If the column changed, we need to move the task
    if (updatedTask.stage !== updatedTask.columnId) {
      // Remove from old column
      const newColumns = columns.map((column) => {
        if (column.id === updatedTask.columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== updatedTask.id),
          }
        }
        return column
      })

      // Add to new column
      setColumns(
        newColumns.map((column) => {
          if (column.id === updatedTask.stage) {
            const { columnId, ...taskWithoutColumnId } = updatedTask
            return {
              ...column,
              tasks: [...column.tasks, taskWithoutColumnId],
            }
          }
          return column
        }),
      )
    } else {
      // Just update the task in the same column
      setColumns(
        columns.map((column) => {
          if (column.id === updatedTask.columnId) {
            return {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === updatedTask.id
                  ? {
                      ...task,
                      title: updatedTask.title,
                      assignees: updatedTask.assignees,
                      priority: updatedTask.priority,
                      dueDate: updatedTask.dueDate,
                      startingDate: updatedTask.startingDate,
                      subtasks: updatedTask.subtasks || task.subtasks, // Preserve existing subtasks
                      // Update team members based on assignees
                      team: updatedTask.assignees
                        ? updatedTask.assignees.map((id) => {
                            const user = users.find((u) => u.id === id)
                            return {
                              id: user.id,
                              name: user.name,
                              initials: user.initials,
                              role: task.team?.find((t) => t.id === user.id)?.role || "Team Member",
                            }
                          })
                        : task.team,
                      // Add activity for task update
                      activities: [
                        {
                          type: "Updated",
                          user: "Current User",
                          timestamp: new Date().toISOString(),
                          message: "Task details updated",
                        },
                        ...(task.activities || []),
                      ],
                    }
                  : task,
              ),
            }
          }
          return column
        }),
      )
    }

    // API call to update a task
    // Example:
    // const updateTaskOnServer = async (updatedTask) => {
    //   try {
    //     const response = await fetch(`/api/tasks/${updatedTask.id}`, {
    //       method: 'PUT',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(updatedTask)
    //     });
    //     const data = await response.json();
    //     // Continue with state update after successful API call
    //   } catch (error) {
    //     console.error('Error updating task:', error);
    //   }
    // };
    // updateTaskOnServer(updatedTask);
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

    // API call to move a task between columns
    // Example:
    // const moveTaskOnServer = async (taskId, sourceColumnId, targetColumnId) => {
    //   try {
    //     await fetch(`/api/tasks/${taskId}/move`, {
    //       method: 'PUT',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ sourceColumnId, targetColumnId })
    //     });
    //     // Continue with state update after successful API call
    //   } catch (error) {
    //     console.error('Error moving task:', error);
    //   }
    // };
    // moveTaskOnServer(taskId, sourceColumnId, targetColumnId);
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

  // Modify the addSubtask function to ensure it moves a completed task to TO DO when a new subtask is added
  // This function already has most of the logic, but we need to ensure it works correctly for all cases

  const addSubtask = (parentTaskId, columnId, subtaskData = null) => {
    let taskToMove = null
    let isTaskCompleted = false

    // First check if the task is in the completed column
    columns.forEach((column) => {
      if (column.id === "completed") {
        const completedTask = column.tasks.find((task) => task.id === parentTaskId)
        if (completedTask) {
          taskToMove = completedTask
          isTaskCompleted = true
        }
      }
    })

    // If subtaskData is provided, use it; otherwise, create a default subtask
    const newSubtask = subtaskData || {
      id: `subtask-${Date.now()}`,
      title: "New Subtask",
      completed: false,
    }

    // If the new subtask is not completed and the task is in completed column,
    // we need to move it to TO DO
    const shouldMoveToTodo = isTaskCompleted && !newSubtask.completed

    // API call to add a subtask
    // Example:
    // const addSubtaskOnServer = async (parentTaskId, subtaskData) => {
    //   try {
    //     const response = await fetch(`/api/tasks/${parentTaskId}/subtasks`, {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(subtaskData)
    //     });
    //     const data = await response.json();
    //     // Continue with state update after successful API call
    //   } catch (error) {
    //     console.error('Error adding subtask:', error);
    //   }
    // };
    // addSubtaskOnServer(parentTaskId, newSubtask);
    setColumns(
      columns.map((column) => {
        // If task is completed and we're adding an incomplete subtask, move it to TO DO
        if (isTaskCompleted && column.id === "completed") {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== parentTaskId),
          }
        }

        // If we need to move the task to TO DO
        if (shouldMoveToTodo && column.id === "todo" && taskToMove) {
          // Initialize subtasks array if it doesn't exist
          const subtasks = taskToMove.subtasks || []

          // Add activity for subtask addition and task movement
          const activities = [
            {
              type: "Commented",
              user: "Current User",
              timestamp: new Date().toISOString(),
              message: `Task moved from COMPLETED to TO DO because a new subtask was added: ${newSubtask.title}`,
            },
            ...(taskToMove.activities || []),
          ]

          const updatedTask = {
            ...taskToMove,
            subtasks: [...subtasks, newSubtask],
            activities,
            status: "TO DO",
          }

          return {
            ...column,
            tasks: [...column.tasks, updatedTask],
          }
        }

        // Normal case - add subtask to task in current column
        if (column.id === columnId && !shouldMoveToTodo) {
          return {
            ...column,
            tasks: column.tasks.map((task) => {
              if (task.id === parentTaskId) {
                // Initialize subtasks array if it doesn't exist
                const subtasks = task.subtasks || []

                // Add activity for subtask addition
                const activities = [
                  {
                    type: "Commented",
                    user: "Current User",
                    timestamp: new Date().toISOString(),
                    message: `Added subtask: ${newSubtask.title}`,
                  },
                  ...(task.activities || []),
                ]

                return {
                  ...task,
                  subtasks: [...subtasks, newSubtask],
                  activities,
                }
              }
              return task
            }),
          }
        }
        return column
      }),
    )
  }

  // Modify the updateSubtask function to check if all subtasks are completed
  // and to move a task back to TO DO if a subtask is unchecked in the completed column
  const updateSubtask = (parentTaskId, columnId, subtaskId, updates) => {
    let taskToMove = null
    let allCompleted = false
    let moveToTodo = false
    let taskToMoveToTodo = null

    // Check if we're in the completed column and unchecking a subtask
    if (columnId === "completed" && updates.completed === false) {
      // Find the task in the completed column
      const completedColumn = columns.find((col) => col.id === "completed")
      const task = completedColumn.tasks.find((t) => t.id === parentTaskId)

      if (task) {
        moveToTodo = true
        taskToMoveToTodo = task
      }
    }

    // First pass to update the subtask and check completion status
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map((task) => {
            if (task.id === parentTaskId && task.subtasks) {
              const updatedSubtasks = task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, ...updates } : subtask,
              )

              // Check if all subtasks are now completed
              const allSubtasksCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed)

              // If all subtasks are completed and task is not in completed column, mark for moving
              if (allSubtasksCompleted && columnId !== "completed") {
                taskToMove = {
                  ...task,
                  subtasks: updatedSubtasks,
                  status: "COMPLETED",
                }
                allCompleted = true
              }

              // Add activity for subtask update
              const subtask = task.subtasks.find((s) => s.id === subtaskId)
              const activities = [
                {
                  type: "Commented",
                  user: "Current User",
                  timestamp: new Date().toISOString(),
                  message: `Updated subtask: ${subtask.title} - ${updates.completed ? "Completed" : "Reopened"}`,
                },
                ...(task.activities || []),
              ]

              return {
                ...task,
                subtasks: updatedSubtasks,
                activities,
              }
            }
            return task
          }),
        }
      }
      return column
    })

    // If we need to move a task from completed to todo because a subtask was unchecked
    if (moveToTodo && taskToMoveToTodo) {
      // Update the subtask in the task
      const updatedSubtasks = taskToMoveToTodo.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, ...updates } : subtask,
      )

      // Add activity for task movement
      const activities = [
        {
          type: "Commented",
          user: "Current User",
          timestamp: new Date().toISOString(),
          message: "Task moved from COMPLETED to TO DO because a subtask was marked as incomplete",
        },
        ...(taskToMoveToTodo.activities || []),
      ]

      // Create the updated task
      const updatedTask = {
        ...taskToMoveToTodo,
        subtasks: updatedSubtasks,
        activities,
        status: "TO DO",
      }

      // Remove from completed and add to todo
      const finalColumns = updatedColumns.map((column) => {
        if (column.id === "completed") {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== parentTaskId),
          }
        }
        if (column.id === "todo") {
          return {
            ...column,
            tasks: [...column.tasks, updatedTask],
          }
        }
        return column
      })

      setColumns(finalColumns)
    }
    // If all subtasks are completed, move the task to the completed column
    else if (allCompleted && taskToMove) {
      // Add activity for task completion
      const completionActivity = {
        type: "Completed",
        user: "Current User",
        timestamp: new Date().toISOString(),
        message: "All subtasks completed. Task marked as completed.",
      }

      taskToMove = {
        ...taskToMove,
        activities: [completionActivity, ...taskToMove.activities],
      }

      // Remove task from original column and add to completed column
      const finalColumns = updatedColumns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== parentTaskId),
          }
        }
        if (column.id === "completed") {
          return {
            ...column,
            tasks: [...column.tasks, taskToMove],
          }
        }
        return column
      })

      setColumns(finalColumns)
    } else {
      // No need to move, just update the columns
      setColumns(updatedColumns)
    }

    // API call to update a subtask
    // Example:
    // const updateSubtaskOnServer = async (parentTaskId, subtaskId, updates) => {
    //   try {
    //     await fetch(`/api/tasks/${parentTaskId}/subtasks/${subtaskId}`, {
    //       method: 'PUT',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(updates)
    //     });
    //     // Continue with state update after successful API call
    //   } catch (error) {
    //     console.error('Error updating subtask:', error);
    //   }
    // };
    // updateSubtaskOnServer(parentTaskId, subtaskId, updates);
  }

  // Modify the deleteSubtask function to prevent deletion of the special subtask
  const deleteSubtask = (parentTaskId, columnId, subtaskId) => {
    // First check if this is the special subtask that cannot be deleted
    const column = columns.find((col) => col.id === columnId)
    if (column) {
      const task = column.tasks.find((t) => t.id === parentTaskId)
      if (task && task.subtasks) {
        const subtask = task.subtasks.find((s) => s.id === subtaskId)
        if (subtask && subtask.isMainSubtask) {
          // This is the special subtask, don't allow deletion
          return
        }
      }
    }

    // API call to delete a subtask
    // Example:
    // const deleteSubtaskFromServer = async (parentTaskId, subtaskId) => {
    //   try {
    //     await fetch(`/api/tasks/${parentTaskId}/subtasks/${subtaskId}`, {
    //       method: 'DELETE'
    //     });
    //     // Continue with state update after successful API call
    //   } catch (error) {
    //     console.error('Error deleting subtask:', error);
    //   }
    // };
    // deleteSubtaskFromServer(parentTaskId, subtaskId);
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) => {
              if (task.id === parentTaskId && task.subtasks) {
                // Get subtask before removal
                const subtask = task.subtasks.find((s) => s.id === subtaskId)

                // Add activity for subtask deletion
                const activities = [
                  {
                    type: "Commented",
                    user: "Current User",
                    timestamp: new Date().toISOString(),
                    message: `Removed subtask: ${subtask.title}`,
                  },
                  ...(task.activities || []),
                ]

                return {
                  ...task,
                  subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
                  activities,
                }
              }
              return task
            }),
          }
        }
        return column
      }),
    )
  }

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
    updateTask, // Add this line
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
