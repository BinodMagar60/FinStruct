import { useDrop } from "react-dnd"
import TaskCard from "./TaskCard"
import { useTaskContext } from "../../context/taskContext"

const BoardView = () => {
  const { columns, moveTask } = useTaskContext()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
      {columns.map((column) => (
        <Column key={column.id} column={column} onMoveTask={moveTask} />
      ))}
    </div>
  )
}

const Column = ({ column, onMoveTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      // Prevent dropping into the completed column directly
      if (column.id === "completed") {
        return
      }
      onMoveTask(item.id, item.columnId, column.id)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    // Disable dropping for completed tasks
    canDrop: (item) => {
      return item.columnId !== "completed"
    },
  })

  const getColumnHeaderColor = (color) => {
    switch (color) {
      case "blue":
        return "text-blue-600"
      case "orange":
        return "text-orange-500"
      case "green":
        return "text-green-500"
      case "red":
        return "text-red-500"
      default:
        return "text-gray-700"
    }
  }

  const getColumnHeaderIcon = (color) => {
    switch (color) {
      case "blue":
        return "▲"
      case "orange":
        return "▶"
      case "green":
        return "▼"
      case "red":
        return "◆"
      default:
        return "■"
    }
  }

  return (
    <div
      ref={drop}
      className={`bg-white rounded-lg border ${isOver ? "border-dashed border-blue-400" : "border-gray-200"}`}
    >
      <div className="flex justify-between items-center p-4">
        <h3 className={`font-medium flex items-center gap-2 ${getColumnHeaderColor(column.color)}`}>
          <span>{getColumnHeaderIcon(column.color)}</span>
          {column.title}
        </h3>
      </div>

      <div className="p-2 min-h-[200px]">
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => <TaskCard key={task.id} task={task} columnId={column.id} />)
        ) : (
          <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-400">No tasks</div>
        )}
      </div>
    </div>
  )
}

export default BoardView
