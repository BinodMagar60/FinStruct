import { useState, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import WarningModal from "./WarningModal";

// Main GanttChart Component with tasks sorted by creation date
const ChartView = ({columns}) => {
  const [view, setView] = useState(ViewMode.Day);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [taskBoard, setTaskBoard] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [changeHistory, setChangeHistory] = useState([]);

  useEffect(() => {
    const initialTaskBoard = columns;
    
    // Sort all tasks by creation date (oldest first)
    const sortedTaskBoard = sortBoardByCreationDate(initialTaskBoard);
    setTaskBoard(sortedTaskBoard);
    
    const extractedTasks = extractTasks(sortedTaskBoard);
    setTasks(extractedTasks);

    // Initialize change history
    setChangeHistory([
      {
        timestamp: new Date().toISOString(),
        action: "INITIALIZE",
        data: extractedTasks,
      },
    ]);
  }, [columns]);

  // Function to sort the task board by creation date
  function sortBoardByCreationDate(board) {
    return board.map(category => {
      // Sort tasks within each category by creation date
      const sortedTasks = [...category.tasks].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA - dateB; // Ascending order (oldest first)
      });
      
      return {
        ...category,
        tasks: sortedTasks
      };
    });
  }

  function getProgressColor(categoryId) {
    const colors = {
      todo: "#4A90E2",
      inprogress: "#ffbb54",
      completed: "#4CAF50",
      onhold: "#F44336",
    };
    return colors[categoryId] || "#000000";
  }

  function getProgressSelectedColor(categoryId) {
    const colors = {
      todo: "#2F73B7",
      inprogress: "#ff9e0d",
      completed: "#388E3C",
      onhold: "#D32F2F",
    };
    return colors[categoryId] || "#000000";
  }

  function extractTasks(board) {
    // Flatten all tasks from all categories into a single array
    const allTasks = board.flatMap((category) => 
      category.tasks.map((task) => ({
        task,
        categoryId: category.id
      }))
    );
    
    // Sort the flattened array by creation date
    const sortedTasks = allTasks.sort((a, b) => {
      const dateA = new Date(a.task.createdAt);
      const dateB = new Date(b.task.createdAt);
      return dateA - dateB; // Ascending order (oldest first)
    });
    
    // Convert the sorted tasks to Gantt format
    return sortedTasks.map(({task, categoryId}) => {
      // Create proper Date objects with fallbacks
      let startDate;
      let endDate;

      try {
        startDate = new Date(task.startingDate);
        // Check if the date is valid
        if (isNaN(startDate.getTime())) {
          startDate = new Date();
        }
      } catch (e) {
        startDate = new Date();
      }

      try {
        endDate = new Date(task.dueDate);
        // Check if the date is valid
        if (isNaN(endDate.getTime())) {
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
        }
      } catch (e) {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }

      // Ensure end date is after start date
      if (endDate <= startDate) {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }

      return {
        id: task.id,
        name: task.title,
        start: startDate,
        end: endDate,
        type: "task",
        progress: calculateProgress(task),
        dependencies: task.dependencies || [],
        styles: {
          progressColor: getProgressColor(categoryId),
          progressSelectedColor: getProgressSelectedColor(categoryId),
        },
        categoryId, // Keep track of which category this task belongs to
      };
    });
  }

  function calculateProgress(task) {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(
      (subtask) => subtask.completed
    ).length;
    return Math.round((completed / task.subtasks.length) * 100);
  }

  const validateDependencies = (updatedTask, allTasks) => {
    const invalidDeps = [];

    // Check if this task has dependencies
    if (updatedTask.dependencies && updatedTask.dependencies.length > 0) {
      updatedTask.dependencies.forEach((depId) => {
        const parentTask = allTasks.find((t) => t.id === depId);
        if (parentTask) {
          // Check if the task starts before its dependency STARTS (not ends)
          if (updatedTask.start < parentTask.start) {
            invalidDeps.push(
              `Task "${updatedTask.name}" cannot start before its dependency "${parentTask.name}" has started.`
            );
          }
        } else {
          invalidDeps.push(
            `Dependency "${depId}" not found for task "${updatedTask.name}".`
          );
        }
      });
    }

    // Check if this task is a dependency for other tasks
    allTasks.forEach((task) => {
      if (task.dependencies && task.dependencies.includes(updatedTask.id)) {
        // Check if dependent tasks start before this task STARTS (not ends)
        if (task.start < updatedTask.start) {
          invalidDeps.push(
            `Task "${task.name}" depends on "${updatedTask.name}" but starts before it has started.`
          );
        }
      }
    });

    if (invalidDeps.length > 0) {
      setWarningMessage(invalidDeps.join("\n"));
      setShowWarning(true);
      return false;
    }

    return true;
  };

  const onTaskChange = (updatedTask) => {
    // Guard against invalid task data
    if (!updatedTask || !updatedTask.id) {
      return;
    }

    // Ensure dates are valid Date objects
    if (!updatedTask.start || isNaN(updatedTask.start.getTime())) {
      updatedTask.start = new Date();
    }

    if (!updatedTask.end || isNaN(updatedTask.end.getTime())) {
      updatedTask.end = new Date(updatedTask.start);
      updatedTask.end.setDate(updatedTask.end.getDate() + 1);
    }

    const updatedTasks = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );

    // Validate Dependencies
    const isValid = validateDependencies(updatedTask, updatedTasks);

    // Update tasks regardless of validation result (we show warnings but allow the change)
    setTasks(updatedTasks);

    // Record the change in history
    const changeRecord = {
      timestamp: new Date().toISOString(),
      action: "UPDATE_TASK",
      taskId: updatedTask.id,
      before: tasks.find((t) => t.id === updatedTask.id),
      after: updatedTask,
      isValid,
    };

    const newHistory = [...changeHistory, changeRecord];
    setChangeHistory(newHistory);

    // Find which category this task belongs to
    const categoryId = updatedTask.categoryId;

    // Sync back to taskBoard
    const updatedTaskBoard = taskBoard.map((category) => ({
      ...category,
      tasks: category.tasks.map((task) =>
        task.id === updatedTask.id
          ? {
              ...task,
              startingDate: updatedTask.start.toISOString().split("T")[0],
              dueDate: updatedTask.end.toISOString().split("T")[0],
            }
          : task
      ),
    }));
    setTaskBoard(updatedTaskBoard);
  };

  const onDblClick = (task) => {
    if (!selectedTask) {
      setSelectedTask(task);
    } else {
      if (selectedTask.id !== task.id) {
        updateDependency(selectedTask.id, task.id);
      }
      setSelectedTask(null);
    }
  };

  const updateDependency = (fromTaskId, toTaskId) => {
    // Find the task to update
    const taskToUpdate = tasks.find((t) => t.id === toTaskId);
    if (!taskToUpdate) {
      return;
    }

    // Ensure dependencies array exists
    const dependencies = taskToUpdate.dependencies || [];

    // Check if we're adding or removing a dependency
    const isAdding = !dependencies.includes(fromTaskId);

    // Update dependencies
    const newDependencies = isAdding
      ? [...dependencies, fromTaskId]
      : dependencies.filter((dep) => dep !== fromTaskId);

    // Create updated task
    const updatedTask = {
      ...taskToUpdate,
      dependencies: newDependencies,
    };

    // Update tasks
    const updatedTasks = tasks.map((task) =>
      task.id === toTaskId ? updatedTask : task
    );

    // Validate the dependency change
    const isValid = validateDependencies(updatedTask, updatedTasks);

    // Update state
    setTasks(updatedTasks);

    // Record the change
    const changeRecord = {
      timestamp: new Date().toISOString(),
      action: isAdding ? "ADD_DEPENDENCY" : "REMOVE_DEPENDENCY",
      fromTaskId,
      toTaskId,
      isValid,
    };

    const newHistory = [...changeHistory, changeRecord];
    setChangeHistory(newHistory);

    // Update taskBoard
    const updatedTaskBoard = taskBoard.map((category) => ({
      ...category,
      tasks: category.tasks.map((task) =>
        task.id === toTaskId
          ? {
              ...task,
              dependencies: newDependencies,
            }
          : task
      ),
    }));

    setTaskBoard(updatedTaskBoard);
  };

  const closeWarning = () => {
    setShowWarning(false);
    setWarningMessage("");
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Modal component for warnings
  

  return (
    <div className="p-6 bg-white">
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => handleViewChange(ViewMode.Day)}
          className={`px-3 py-1 rounded ${
            view === ViewMode.Day ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => handleViewChange(ViewMode.Week)}
          className={`px-3 py-1 rounded ${
            view === ViewMode.Week ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => handleViewChange(ViewMode.Month)}
          className={`px-3 py-1 rounded ${
            view === ViewMode.Month ? "bg-black text-white" : "bg-gray-200"
          }`}
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
            columnWidth={
              view === ViewMode.Day ? 60 : view === ViewMode.Week ? 250 : 300
            }
            listCellWidth=""
          />
        </div>
      ) : (
        <p className="text-red-500">Loading tasks...</p>
      )}

      {showWarning && (
        <WarningModal message={warningMessage} onClose={closeWarning} />
      )}
    </div>
  );
};

export default ChartView;