import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import StaticBoardView from "../StaticTasks/StaticBoardView"
import StaticListView from "../StaticTasks/StaticListView"
import StaticTaskModal from "../StaticTasks/StaticTaskModal"






const TodoList = () => {
    const taskType = "todo"
    const [viewMode, setViewMode] = useState("board")
  const [columns, setColumns] = useState([
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
              completed: true
            },
            {
              id: "subtask-1-2",
              title: "Analyze pricing strategies",
              completed: false
            }
          ]
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
          subtasks: []
        },{
            id: "task-10",
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
                completed: true
              },
              {
                id: "subtask-1-2",
                title: "Analyze pricing strategies",
                completed: false
              }
            ]
          },
          {
            id: "task-11",
            title: "User interviews",
            priority: "normal",
            startingDate: "2025-03-20",
            dueDate: "2025-04-10",
            assignees: [3],
            createdAt: "2025-03-22",
            dependencies: ["task-1"],
            subtasks: []
          },{
            id: "task-12",
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
                completed: true
              },
              {
                id: "subtask-1-2",
                title: "Analyze pricing strategies",
                completed: false
              }
            ]
          },
          {
            id: "task-13",
            title: "User interviews",
            priority: "normal",
            startingDate: "2025-03-20",
            dueDate: "2025-04-10",
            assignees: [3],
            createdAt: "2025-03-22",
            dependencies: ["task-1"],
            subtasks: []
          },{
            id: "task-14",
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
                completed: true
              },
              {
                id: "subtask-1-2",
                title: "Analyze pricing strategies",
                completed: false
              }
            ]
          },
          {
            id: "task-15",
            title: "User interviews",
            priority: "normal",
            startingDate: "2025-03-20",
            dueDate: "2025-04-10",
            assignees: [3],
            createdAt: "2025-03-22",
            dependencies: ["task-1"],
            subtasks: []
          }
      ]
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
              completed: true
            },
            {
              id: "subtask-3-2",
              title: "Product page layout",
              completed: true
            },
            {
              id: "subtask-3-3",
              title: "Checkout flow",
              completed: false
            }
          ]
        }
      ]
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
              completed: true
            },
            {
              id: "subtask-4-2",
              title: "Send invites",
              completed: true
            }
          ]
        }
      ]
    },
    { 
      id: "onhold", 
      title: "ON HOLD", 
      color: "red", 
      tasks: [{
        id: "abc-3",
        title: "hold task",
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
            completed: true
          },
          {
            id: "subtask-3-2",
            title: "Product page layout",
            completed: true
          },
          {
            id: "subtask-3-3",
            title: "Checkout flow",
            completed: false
          }
        ]
      }] 
    }
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [modalMode, setModalMode] = useState("edit")
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", initials: "JD", color: "bg-green-500" },
    { id: 2, name: "Jane Smith", initials: "JS", color: "bg-blue-500" },
    { id: 3, name: "Alex Johnson", initials: "AJ", color: "bg-purple-500" },
    { id: 4, name: "New User", initials: "NU", color: "bg-red-500" },
  ])

  const handleCreateTask = () => {
    setCurrentTask(null)
    // setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEditTask = (task, columnId) => {
    setCurrentTask({ ...task, columnId })
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleDeleteTask = (taskId, columnId) => {
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

  const handleAddTask = (task) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...task,
      createdAt: new Date().toISOString(),
      subtasks: [], // Initialize subtasks array for new tasks
    }

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
                      subtasks: updatedTask.subtasks || task.subtasks, // Preserve existing subtasks
                    }
                  : task,
              ),
            }
          }
          return column
        }),
      )
    }

    setIsModalOpen(false)
  }

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return

    const sourceColumn = columns.find((col) => col.id === sourceColumnId)
    const task = sourceColumn.tasks.find((t) => t.id === taskId)

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
            tasks: [...column.tasks, task],
          }
        }
        return column
      }),
    )
    // consoling the columns for checking
    // console.log(columns)

  }

  const addSubtask = (parentTaskId, columnId, subtaskData = null) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) => {
              if (task.id === parentTaskId) {
                // Initialize subtasks array if it doesn't exist
                const subtasks = task.subtasks || [];
                
                // If subtaskData is provided, use it; otherwise, create a default subtask
                const newSubtask = subtaskData || {
                  id: `subtask-${Date.now()}`,
                  title: "New Subtask",
                  completed: false,
                };
                
                return {
                  ...task,
                  subtasks: [...subtasks, newSubtask],
                };
              }
              return task;
            }),
          };
        }
        return column;
      })
    );
  }

  const updateSubtask = (parentTaskId, columnId, subtaskId, updates) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) => {
              if (task.id === parentTaskId && task.subtasks) {
                return {
                  ...task,
                  subtasks: task.subtasks.map((subtask) => 
                    subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
                  ),
                };
              }
              return task;
            }),
          };
        }
        return column;
      })
    );
  }

  const deleteSubtask = (parentTaskId, columnId, subtaskId) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) => {
              if (task.id === parentTaskId && task.subtasks) {
                return {
                  ...task,
                  subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
                };
              }
              return task;
            }),
          };
        }
        return column;
      })
    );
  }

  // Get all tasks across all columns
  const getAllTasks = () => {
    return columns.flatMap(column => 
      column.tasks.map(task => ({
        ...task,
        columnId: column.id,
        columnTitle: column.title
      }))
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        <div className="container mx-auto p-4 bg-white pb-8 rounded">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Todo Task</h1>
            {/* <button
              onClick={handleCreateTask}
              className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Create Task
            </button> */}
          </div>

          <div className="bg-white rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`py-2 px-6 font-medium  ${viewMode === "board" ? "border-b-2 border-black shadow-inner" : ""}`}
                  onClick={() => setViewMode("board")}
                >
                  Board View
                </button>
                <button
                  className={`py-2 px-6 font-medium ${viewMode === "list" ? "border-b-2 border-black shadow-inner" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  List View
                </button>
              </div>
            </div>

            {viewMode === "board" ? (
              <StaticBoardView
                taskType={taskType}
                columns={columns}
                onMoveTask={moveTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onAddSubtask={addSubtask}
                onUpdateSubtask={updateSubtask}
                onDeleteSubtask={deleteSubtask}
                users={users}
                setIsModalOpen={setIsModalOpen}
              />
            ) : (
              <StaticListView 
                taskType={taskType}
                columns={columns} 
                onEditTask={handleEditTask} 
                onDeleteTask={handleDeleteTask} 
                onAddSubtask={addSubtask}
                onUpdateSubtask={updateSubtask}
                onDeleteSubtask={deleteSubtask}
                users={users} 
              />
            )}
          </div>
        </div>

        {isModalOpen && (
          <StaticTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={modalMode === "add" ? handleAddTask : handleUpdateTask}
            task={currentTask}
            mode={modalMode}
            columns={columns}
            users={users}
          />
        )}
      </div>
     </DndProvider>
  )
}

export default TodoList