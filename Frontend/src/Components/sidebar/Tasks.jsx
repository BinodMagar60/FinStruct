"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { PlusCircle } from "lucide-react"
import BoardView from "../Tasks/BoardView"
import ListView from "../Tasks/ListView"
import TaskModal from "../Tasks/TaskModal"
import ChartView from "../Tasks/ChartView"
import TaskDetail from "../TaskDetails/TaskDetail"
import { TaskProvider, useTaskContext } from "../../context/taskContext"

// Main component
const TasksContent = () => {
  const [viewMode, setViewMode] = useState("board")
  const { handleCreateTask, isModalOpen, showTaskDetail, selectedTaskId, closeTaskDetail, columns } = useTaskContext()

  // Find the selected task for task detail view
  const findSelectedTask = () => {
    if (!selectedTaskId) return null

    for (const column of columns) {
      const task = column.tasks.find((task) => task.id === selectedTaskId)
      if (task) {
        return {
          task,
          columnId: column.id,
        }
      }
    }
    return null
  }

  const selectedTaskData = findSelectedTask()

  return (
    <div className="p-6">
      <div className="container mx-auto p-4 bg-white pb-8 rounded">
        {showTaskDetail && selectedTaskData ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{selectedTaskData.task.title}</h1>
              <button
                onClick={closeTaskDetail}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
              >
                ← Back to Tasks
              </button>
            </div>
            <TaskDetail task={selectedTaskData.task} columnId={selectedTaskData.columnId} />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Task Board</h1>
              <button
                onClick={handleCreateTask}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <PlusCircle size={20} />
                Create Task
              </button>
            </div>

            <div className="bg-white rounded-lg mb-6">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    className={`py-2 px-6 font-medium ${viewMode === "board" ? "border-b-2 border-black shadow-inner" : ""}`}
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
                  <button
                    className={`py-2 px-6 font-medium ${viewMode === "chart" ? "border-b-2 border-black shadow-inner" : ""}`}
                    onClick={() => setViewMode("chart")}
                  >
                    Gantt Chart View
                  </button>
                </div>
              </div>

              {viewMode === "board" ? <BoardView /> : viewMode === "list" ? <ListView /> : <ChartView />}
            </div>
          </>
        )}
      </div>

      {isModalOpen && <TaskModal />}
    </div>
  )
}

const Tasks = () => {
  return (
    <TaskProvider>
      <DndProvider backend={HTML5Backend}>
        <TasksContent />
      </DndProvider>
    </TaskProvider>
  )
}

export default Tasks
