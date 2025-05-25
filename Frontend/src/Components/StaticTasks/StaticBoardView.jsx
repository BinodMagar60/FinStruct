// import { useDrop } from "react-dnd"
import StaticTaskCard from "./StaticTaskCard";
import { useTaskContext } from "../../context/taskContext";

const StaticBoardView = ({ taskType }) => {
  const { columns, moveTask } = useTaskContext();
  let selectedTasks = [];
  let selectedColumnId = null;


  // console.log(columns)

const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));


if (taskType === "userAssigned") {
  const allTask = columns.flatMap((column) =>
    column.tasks.map((task) => ({ ...task, columnId: column.id }))
  );

  selectedTasks = allTask.filter((task) =>
    task.assignees.includes(locallySavedUser.id)
  );
} else if (taskType === "todo") {
  const selectedColumns = columns.filter((column) =>
    ["todo", "onhold"].includes(column.id)
  );

  selectedTasks = selectedColumns.flatMap((column) =>
    column.tasks.map((task) => ({ ...task, columnId: column.id }))
  );
} else {
  const selectedColumn = columns.find((column) => column.id === taskType);

  selectedTasks = selectedColumn
    ? selectedColumn.tasks.map((task) => ({
        ...task,
        columnId: selectedColumn.id,
      }))
    : [];
}


  const noTasksToShow = selectedTasks.length === 0;

  return (
    <div className="w-full py-4">
      {noTasksToShow ? (
        <>
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 text-lg">No tasks found</p>
            <p className="text-gray-400 text-sm mt-2">
              Add a new task to get started
            </p>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedTasks.map((task) => (
            <StaticTaskCard
              key={task.id}
              task={task}
              columnId={task.columnId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaticBoardView;
