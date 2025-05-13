import { useState, useEffect, useCallback, useRef } from "react"
import { Gantt, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import WarningModal from "./WarningModal"
import { useTaskContext } from "../../context/taskContext"
import { updateTheTaskBackendOnMovedGanttChart, updateTheTaskBackendOnMovedGanttChartDependencies } from "../../api/ProjectApi"

const ChartView = () => {
  const { columns, updateColumns } = useTaskContext()
  const [view, setView] = useState(ViewMode.Day)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")
  const [tasks, setTasks] = useState([])
  const [changeHistory, setChangeHistory] = useState([])
  const [previousValidState, setPreviousValidState] = useState([])
  const shouldRevertRef = useRef(false)
  const prevColumnsRef = useRef(null)

  const sortBoardByCreationDate = useCallback((board) => {
    return board.map((category) => {
      const sortedTasks = [...category.tasks].sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return dateA - dateB
      })

      return {
        ...category,
        tasks: sortedTasks,
      }
    })
  }, [])

  const extractTasks = useCallback((board) => {
    const allTasks = board.flatMap((category) =>
      category.tasks.map((task) => ({
        task,
        categoryId: category.id,
      })),
    )

    const sortedTasks = allTasks.sort((a, b) => {
      const dateA = new Date(a.task.createdAt)
      const dateB = new Date(b.task.createdAt)
      return dateA - dateB
    })

    return sortedTasks.map(({ task, categoryId }) => {
      let startDate
      let endDate

      try {
        startDate = new Date(task.startingDate)
        if (isNaN(startDate.getTime())) {
          startDate = new Date()
        }
      } catch (e) {
        startDate = new Date()
      }

      try {
        endDate = new Date(task.dueDate)
        if (isNaN(endDate.getTime())) {
          endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + 1)
        }
      } catch (e) {
        endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 1)
      }

      if (endDate <= startDate) {
        endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 1)
      }

      const progress = categoryId === "completed" ? 100 : calculateProgress(task)

      return {
        id: task.id,
        name: task.title,
        start: startDate,
        end: endDate,
        type: "task",
        progress: progress,
        dependencies: task.dependencies || [],
        styles: {
          progressColor: getProgressColor(categoryId),
          progressSelectedColor: getProgressSelectedColor(categoryId),
        },
        categoryId,
        isCompleted: categoryId === "completed",
      }
    })
  }, [])

  const calculateProgress = useCallback((task) => {
    if (!task.subtasks || task.subtasks.length === 0) return 0
    const completed = task.subtasks.filter((subtask) => subtask.completed).length
    return Math.round((completed / task.subtasks.length) * 100)
  }, [])

  const getProgressColor = useCallback((categoryId) => {
    const colors = {
      todo: "#4A90E2",
      inprogress: "#ffbb54",
      completed: "#4CAF50",
      onhold: "#F44336",
    }
    return colors[categoryId] || "#000000"
  }, [])

  const getProgressSelectedColor = useCallback((categoryId) => {
    const colors = {
      todo: "#2F73B7",
      inprogress: "#ff9e0d",
      completed: "#388E3C",
      onhold: "#D32F2F",
    }
    return colors[categoryId] || "#000000"
  }, [])

  const validateDependencies = useCallback((updatedTask, allTasks) => {
    const invalidDeps = []

    // Check if this task has dependencies
    if (updatedTask.dependencies && updatedTask.dependencies.length > 0) {
      updatedTask.dependencies.forEach((depId) => {
        const parentTask = allTasks.find((t) => t.id === depId)
        if (parentTask) {
          if (updatedTask.start < parentTask.start) {
            invalidDeps.push(
              `Task "${updatedTask.name}" cannot start before its dependency "${parentTask.name}" has started.`,
            )
          }
        } else {
          invalidDeps.push(`Dependency "${depId}" not found for task "${updatedTask.name}".`)
        }
      })
    }

    // Check if this task is a dependency for other tasks
    allTasks.forEach((task) => {
      if (task.dependencies && task.dependencies.includes(updatedTask.id)) {
        // Check if dependent tasks start before this task STARTS (not ends)
        if (task.start < updatedTask.start) {
          invalidDeps.push(`Task "${task.name}" depends on "${updatedTask.name}" but starts before it has started.`)
        }
      }
    })

    if (invalidDeps.length > 0) {
      shouldRevertRef.current = true
      setWarningMessage(invalidDeps.join("\n"))
      setShowWarning(true)
      return false
    }

    return true
  }, [])

  // Function to validate all dependencies in the task list
  const validateAllDependencies = useCallback((taskList) => {
    const allErrors = []
    taskList.forEach((task) => {
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach((depId) => {
          const parentTask = taskList.find((t) => t.id === depId)
          if (parentTask) {
            if (task.start < parentTask.start) {
              allErrors.push(`Task "${task.name}" cannot start before its dependency "${parentTask.name}" has started.`)
            }
          } else {
            allErrors.push(`Dependency "${depId}" not found for task "${task.name}".`)
          }
        })
      }
    })

    if (allErrors.length > 0) {
      shouldRevertRef.current = true
      setWarningMessage(allErrors.join("\n"))
      setShowWarning(true)
      return false
    }

    return true
  }, [])

  const syncTasksWithContext = useCallback(
    (updatedTasks) => {
      const updatedColumns = JSON.parse(JSON.stringify(columns))
      let hasChanges = false
      updatedTasks.forEach((chartTask) => {
        for (const column of updatedColumns) {
          const taskIndex = column.tasks.findIndex((task) => task.id === chartTask.id)
          if (taskIndex !== -1) {
            const currentTask = column.tasks[taskIndex]
            if (
              chartTask.start &&
              chartTask.end &&
              !isNaN(chartTask.start.getTime()) &&
              !isNaN(chartTask.end.getTime())
            ) {
              column.tasks[taskIndex].startingDate = chartTask.start.toISOString()
              column.tasks[taskIndex].dueDate = chartTask.end.toISOString()
              hasChanges = true
            }
            if (chartTask.dependencies !== undefined) {
              column.tasks[taskIndex].dependencies = chartTask.dependencies
              hasChanges = true
            }
            if (
              chartTask.progress !== undefined &&
              calculateProgress(currentTask) !== chartTask.progress &&
              chartTask.progress !== 100
            ) {
              hasChanges = true
            }

            break
          }
        }
      })
      if (hasChanges) {
        const updateTasksOnServer = async (updatedTasks) => {
          try {
            const startingDate = updatedTasks.start
            const dueDate = updatedTasks.end
            const newData = {
              startingDate,
              dueDate
            }
            const response = await updateTheTaskBackendOnMovedGanttChart(`projects/tasks/ganttchart/dates/${updatedTasks.id}`,newData)
          } catch (error) {
            console.error('Error updating tasks from chart:', error);
          }
        };
        updateTasksOnServer(updatedTasks[0]);
        updateColumns(updatedColumns)
      }
    },
    [columns, updateColumns, calculateProgress],
  )

  // Define updateDependency before onDblClick to fix the reference error
  const updateDependency = useCallback(
    (fromTaskId, toTaskId) => {
      const fromTask = tasks.find((t) => t.id === fromTaskId)
      const taskToUpdate = tasks.find((t) => t.id === toTaskId)

      if (!taskToUpdate || !fromTask) {
        return
      }

      if (taskToUpdate.isCompleted || fromTask.isCompleted) {
        setPreviousValidState([...tasks])
        shouldRevertRef.current = true
        setWarningMessage("Completed tasks cannot be modified. Your changes will be reverted.")
        setShowWarning(true)
        return
      }
      setPreviousValidState([...tasks])

      const dependencies = taskToUpdate.dependencies || []
      const isAdding = !dependencies.includes(fromTaskId)
      const newDependencies = isAdding
        ? [...dependencies, fromTaskId]
        : dependencies.filter((dep) => dep !== fromTaskId)

      const updatedTask = {
        ...taskToUpdate,
        dependencies: newDependencies,
      }

      const updatedTasks = tasks.map((task) => (task.id === toTaskId ? updatedTask : task))
      const isValid = validateDependencies(updatedTask, updatedTasks)
      setTasks(updatedTasks)
      if (isValid) {
        shouldRevertRef.current = false
        setPreviousValidState(updatedTasks)
        const updateDependencyOnServer = async (taskId, dependencies) => {
          try {
            const response = await updateTheTaskBackendOnMovedGanttChartDependencies(taskId, dependencies)
          } catch (error) {
            console.error('Error updating task dependencies:', error);
          }
        };
        updateDependencyOnServer(toTaskId, newDependencies);
        syncTasksWithContext([updatedTask])
      }
      const changeRecord = {
        timestamp: new Date().toISOString(),
        action: isAdding ? "ADD_DEPENDENCY" : "REMOVE_DEPENDENCY",
        fromTaskId,
        toTaskId,
        isValid,
      }
      setChangeHistory((prev) => [...prev, changeRecord])
    },
    [tasks, validateDependencies, syncTasksWithContext],
  )

  // Now define onDblClick after updateDependency
  const onDblClick = useCallback(
    (task) => {
      if (task.isCompleted) {
        // Store the current state before showing the warning
        setPreviousValidState([...tasks])
        shouldRevertRef.current = true
        setWarningMessage("Completed tasks cannot be modified. Your changes will be reverted.")
        setShowWarning(true)
        return
      }

      if (!selectedTask) {
        setSelectedTask(task)
      } else {
        if (selectedTask.id !== task.id) {
          updateDependency(selectedTask.id, task.id)
        }
        setSelectedTask(null)
      }
    },
    [selectedTask, tasks, updateDependency],
  )

  const onTaskChange = useCallback(
    (updatedTask) => {
      if (!updatedTask || !updatedTask.id) {
        return
      }

      const originalTask = tasks.find((t) => t.id === updatedTask.id)
      if (!originalTask) {
        return
      }

      if (originalTask.isCompleted) {
        // Store the current state before showing the warning
        setPreviousValidState([...tasks])
        shouldRevertRef.current = true
        setWarningMessage("Completed tasks cannot be modified. Your changes will be reverted.")
        setShowWarning(true)
        return
      }

      if (!updatedTask.start || isNaN(updatedTask.start.getTime())) {
        updatedTask.start = new Date()
      }

      if (!updatedTask.end || isNaN(updatedTask.end.getTime())) {
        updatedTask.end = new Date(updatedTask.start)
        updatedTask.end.setDate(updatedTask.end.getDate() + 1)
      }
      setPreviousValidState([...tasks])
      const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      const isValid = validateDependencies(updatedTask, updatedTasks)
      setTasks(updatedTasks)
      if (isValid) {
        shouldRevertRef.current = false
        setPreviousValidState(updatedTasks)
        syncTasksWithContext([updatedTask])
      }
      setChangeHistory((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          action: "UPDATE_TASK",
          taskId: updatedTask.id,
          before: originalTask,
          after: updatedTask,
          isValid,
        },
      ])
    },
    [tasks, validateDependencies, syncTasksWithContext],
  )

  // Main effect to initialize tasks and handle columns changes
  useEffect(() => {
    const columnsJson = JSON.stringify(columns)
    if (prevColumnsRef.current === columnsJson) {
      return 
    }
    prevColumnsRef.current = columnsJson

    const sortedTaskBoard = sortBoardByCreationDate(columns)
    const extractedTasks = extractTasks(sortedTaskBoard)
    setTasks(extractedTasks)
    setPreviousValidState(extractedTasks)
    if (changeHistory.length === 0) {
      setChangeHistory([
        {
          timestamp: new Date().toISOString(),
          action: "INITIALIZE",
          data: extractedTasks,
        },
      ])
    }
    setTimeout(() => {
      validateAllDependencies(extractedTasks)
    }, 500)
  }, [columns, sortBoardByCreationDate, extractTasks, validateAllDependencies, changeHistory.length])

  const closeWarning = () => {
    setShowWarning(false)
    setWarningMessage("")
    if (shouldRevertRef.current) {
      setTasks(previousValidState)
      shouldRevertRef.current = false
      const tasksToSync = previousValidState.map((task) => ({
        id: task.id,
        start: task.start,
        end: task.end,
        dependencies: task.dependencies,
      }))

      syncTasksWithContext(tasksToSync)
    }
  }

  const handleViewChange = (newView) => {
    setView(newView)
  }

  return (
    <div className="p-6 bg-white">
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => handleViewChange(ViewMode.Day)}
          className={`px-3 py-1 rounded ${view === ViewMode.Day ? "bg-black text-white" : "bg-gray-200"}`}
        >
          Day
        </button>
        <button
          onClick={() => handleViewChange(ViewMode.Week)}
          className={`px-3 py-1 rounded ${view === ViewMode.Week ? "bg-black text-white" : "bg-gray-200"}`}
        >
          Week
        </button>
        <button
          onClick={() => handleViewChange(ViewMode.Month)}
          className={`px-3 py-1 rounded ${view === ViewMode.Month ? "bg-black text-white" : "bg-gray-200"}`}
        >
          Month
        </button>
      </div>

      {tasks.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Gantt
            tasks={tasks}
            viewMode={view}
            onDateChange={onTaskChange}
            onDoubleClick={onDblClick}
            columnWidth={view === ViewMode.Day ? 60 : view === ViewMode.Week ? 250 : 300}
            listCellWidth=""
            TooltipContent={({ task }) => (
              <div className="p-2 bg-white shadow-lg rounded border border-gray-200">
                <div className="font-bold">{task.name}</div>
                <div>Start: {task.start.toLocaleDateString()}</div>
                <div>End: {task.end.toLocaleDateString()}</div>
                {task.dependencies && task.dependencies.length > 0 && (
                  <div className="mt-1 text-xs text-gray-600">
                    <strong>Dependencies:</strong> This task depends on {task.dependencies.length} other task(s).
                    <br />
                    Double-click to manage dependencies.
                  </div>
                )}
                {task.isCompleted && (
                  <div className="mt-1 text-xs text-green-600">
                    <strong>Status:</strong> Completed (cannot be modified)
                  </div>
                )}
              </div>
            )}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 text-sm mt-2">Add a new task to get started</p>
        </div>
      )}

      {showWarning && (
        <WarningModal
          message={warningMessage}
          onClose={closeWarning}
          actionText={shouldRevertRef.current ? "Revert Changes" : "Close"}
        />
      )}
    </div>
  )
}

export default ChartView
