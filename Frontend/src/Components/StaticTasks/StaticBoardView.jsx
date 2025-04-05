// import { useDrop } from "react-dnd"
// import StaticTaskCard from "./StaticTaskCard"

// const StaticBoardView = ({ columns, onMoveTask, onEditTask, onDeleteTask, onAddSubtask, users, setIsModalOpen }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
//       {columns.map((column) => (
//         <Column
//           key={column.id}
//           column={column}
//           onMoveTask={onMoveTask}
//           onEditTask={onEditTask}
//           onDeleteTask={onDeleteTask}
//           onAddSubtask={onAddSubtask}
//           users={users}
//           setIsModalOpen={setIsModalOpen}
//         />
//       ))}
//     </div>
//   )
// }

// const Column = ({ column, onMoveTask, onEditTask, onDeleteTask, onAddSubtask, users, setIsModalOpen }) => {
//   const [{ isOver }, drop] = useDrop({
//     accept: "TASK",
//     drop: (item) => {
//       onMoveTask(item.id, item.columnId, column.id)
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   })

//   const getColumnHeaderColor = (color) => {
//     switch (color) {
//       case "blue":
//         return "text-blue-600"
//       case "orange":
//         return "text-orange-500"
//       case "green":
//         return "text-green-500"
//       case "red":
//         return "text-red-500"
//       default:
//         return "text-gray-700"
//     }
//   }

//   const getColumnHeaderIcon = (color) => {
//     switch (color) {
//       case "blue":
//         return "▲"
//       case "orange":
//         return "▶"
//       case "green":
//         return "▼"
//       case "red":
//         return "◆"
//       default:
//         return "■"
//     }
//   }

//   return (
//     <div
//       ref={drop}
//       className={`bg-white rounded-lg border ${isOver ? "border-dashed border-blue-400" : "border-gray-200"}`}
//     >
//       <div className="flex justify-between items-center p-4">
//         <h3 className={`font-medium flex items-center gap-2 ${getColumnHeaderColor(column.color)}`}>
//           <span>{getColumnHeaderIcon(column.color)}</span>
//           {column.title}
//         </h3>
//         {/* <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-full">
//           <MoreHorizontal size={18} />
//         </button> */}
//       </div>

//       <div className="p-2 min-h-[200px]">
//         {column.tasks.length > 0 ? (
//           column.tasks.map((task) => (
//             <StaticTaskCard
//               key={task.id}
//               task={task}
//               columnId={column.id}
//               onEditTask={onEditTask}
//               onDeleteTask={onDeleteTask}
//               onAddSubtask={onAddSubtask}
//               users={users}
//               setIsModalOpen={setIsModalOpen}
//             />
//           ))
//         ) : (
//           <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-400">No tasks</div>
//         )}

//         {/* <button className="w-full mt-2 py-2 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1">
//           Add Task
//         </button> */}
//       </div>
//     </div>
//   )
// }

// export default StaticBoardView







// import React from 'react'

// const StaticBoardView = (columns, onMoveTask, onEditTask, onDeleteTask, onAddSubtask, onUpdateSubtask, onDeleteSubtask, users, setIsMenuOpen) => {
//   return (
//     <div>
//       {
        
//       }
//     </div>
//   )
// }

// export default StaticBoardView




import React from 'react';
import StaticTaskCard from './StaticTaskCard';

const StaticBoardView = ({
  taskType,
  columns,
  onMoveTask,
  onEditTask,
  onDeleteTask,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  users,
  setIsModalOpen,
}) => {
  let selectedTasks = [];
  let selectedColumnId = null;

  if (taskType === "todo") {
    const selectedColumns = columns.filter(column =>
      ["todo", "onhold"].includes(column.id)
    );
    selectedTasks = selectedColumns.flatMap(column => {
      // Use column.id to track which column each task came from
      return column.tasks.map(task => ({ ...task, columnId: column.id }));
    });
  } else {
    const selectedColumn = columns.find(column => column.id === taskType);
    selectedTasks = selectedColumn ? selectedColumn.tasks.map(task => ({ ...task, columnId: selectedColumn.id })) : [];
  }

  const noTasksToShow = selectedTasks.length === 0;

  return (
    <div className="w-full p-4">
      {noTasksToShow ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 text-lg">No tasks found in this category</p>
          <p className="text-gray-400 text-sm mt-2">Add a new task to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedTasks.map((task) => (
            <StaticTaskCard
              key={task.id}
              task={task}
              columnId={task.columnId}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onAddSubtask={onAddSubtask}
              users={users}
              setIsModalOpen={setIsModalOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaticBoardView;
