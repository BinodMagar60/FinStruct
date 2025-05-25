import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  MessageSquare,
  ThumbsUp,
  ChevronUp,
  List,
  Clock,
  CheckSquare,
  TruckIcon,
  ShieldAlert,
  Plus,
  X,
  Upload,
  Trash2,
} from "lucide-react";
import { useTaskContext } from "../../context/taskContext";
import {
  addComments,
  addImgAsAssets,
  deleteAssetsBackend,
  getTaskDetailsForDetailsSection,
} from "../../api/ProjectApi";
import Loading from "../sidebar/Loading";
import { formatDateToReadable } from "../../utils/formateDates";

const TaskDetail = ({ tasks, columnId }) => {
  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));
  const { updateTaskDetails, updateSubtask, deleteSubtask } = useTaskContext();
  const [task, setTask] = useState();
  const [change, setChange] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("detail");
  const [commentText, setCommentText] = useState("");
  const [activityStatus, setActivityStatus] = useState({
    Commented: false,
    Inspection: false,
    MaterialDelivery: false,
    SafetyConcern: false,
  });
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({ name: "", url: "" });
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [team, setTeam] = useState([]);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [activities, setActivities] = useState([]);
  const [taskStatus, setTaskStatus] = useState({
    isStarted: task?.status === "IN PROGRESS",
    isCompleted: task?.status === "COMPLETED",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTaskDetailsForDetailsSection(
          `projects/tasks/taskdetails/${tasks.id}`
        );
        
        setTask(response);
        setAssets(response.assets);
        setTeam(response.team);
        setActivities(response.activities);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tasks.id, change]);

  // Add a ref to track if we need to update
  const isInitialMount = useRef(true);
  const prevAssetsRef = useRef(assets);
  const prevTeamRef = useRef(team);
  const prevActivitiesRef = useRef(activities);
  const prevStatusRef = useRef(taskStatus);

  useEffect(() => {
    // Skip the first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevAssetsRef.current = assets;
      prevTeamRef.current = team;
      prevActivitiesRef.current = activities;
      prevStatusRef.current = taskStatus;
      return;
    }

    // Only update if something actually changed
    const assetsChanged =
      JSON.stringify(prevAssetsRef.current) !== JSON.stringify(assets);
    const teamChanged =
      JSON.stringify(prevTeamRef.current) !== JSON.stringify(team);
    const activitiesChanged =
      JSON.stringify(prevActivitiesRef.current) !== JSON.stringify(activities);
    const statusChanged =
      prevStatusRef.current.isCompleted !== taskStatus.isCompleted ||
      prevStatusRef.current.isStarted !== taskStatus.isStarted;

    if (assetsChanged || teamChanged || activitiesChanged || statusChanged) {
      // Update the refs
      prevAssetsRef.current = JSON.parse(JSON.stringify(assets));
      prevTeamRef.current = JSON.parse(JSON.stringify(team));
      prevActivitiesRef.current = JSON.parse(JSON.stringify(activities));
      prevStatusRef.current = { ...taskStatus };

      // Check if the task is in the completed column
      const isInCompletedColumn = columnId === "completed";

      // Create a new object for the updates to avoid reference issues
      const updates = {
        assets: JSON.parse(JSON.stringify(assets)),
        team: JSON.parse(JSON.stringify(team)),
        activities: JSON.parse(JSON.stringify(activities)),
        status: isInCompletedColumn
          ? "COMPLETED"
          : taskStatus.isCompleted
          ? "COMPLETED"
          : taskStatus.isStarted
          ? "IN PROGRESS"
          : "TO DO",
      };

      // Now update the task details
      updateTaskDetails(task.id, updates);
    }
  }, [assets, team, activities, taskStatus, change, columnId]);

  // Check if task is started or completed based on activities
  useEffect(() => {
    const isStarted =
      activities.some((activity) => activity.type === "Started") ||
      activities.length > 0;
    const isCompleted = activities.some(
      (activity) => activity.type === "Completed"
    );
    setTaskStatus({
      isStarted,
      isCompleted,
    });

    // Disable Started checkbox if task is already started
    if (isStarted) {
      setActivityStatus((prev) => ({
        ...prev,
      }));
    }
  }, [activities]);

  const handleStatusChange = (status) => {
    if (status === "Started" && taskStatus.isStarted) {
      return;
    }
    if (columnId === "completed") {
      return;
    }
    const newActivityStatus = {
      Commented: false,
      Inspection: false,
      MaterialDelivery: false,
      SafetyConcern: false,
    };
    newActivityStatus[status] = !activityStatus[status];

    setActivityStatus(newActivityStatus);
  };

  //adding comment
  const handleSubmitComment = (e) => {
    e.preventDefault();

    if (columnId === "completed") {
      return;
    }

    if (
      commentText.trim() ||
      Object.values(activityStatus).some((status) => status)
    ) {
      let activityType = "Commented";
      if (activityStatus.Commented) activityType = "Commented";
      else if (activityStatus.Inspection) activityType = "Inspection";
      else if (activityStatus.MaterialDelivery)
        activityType = "MaterialDelivery";
      else if (activityStatus.SafetyConcern) activityType = "SafetyConcern";

      // Create new activity
      const newActivity = {
        type: activityType,
        user: locallySavedUser.username,
        timestamp: new Date().toISOString(),
        message: commentText.trim(),
      };

      const addActivityOnServer = async (taskId, activityData) => {
        try {
          const response = await addComments(
            `projects/tasks/activity/${taskId}`,
            activityData
          );
          setChange((prev) => !prev);
        } catch (error) {
          console.error("Error adding activity:", error);
        }
      };

      addActivityOnServer(task.id, newActivity);

      setCommentText("");
      setActivityStatus({
        Commented: false,
        Inspection: false,
        MaterialDelivery: false,
        SafetyConcern: false,
      });
    }
  };

  // Handle subtask status change
  const handleSubtaskStatusChange = (subtaskId, isCompleted) => {
    // Call the updateSubtask function from context
    updateSubtask(task.id, columnId, subtaskId, { completed: isCompleted });
    setLoading(true);
    setTimeout(() => {
      setChange((prev) => !prev);
    }, 300);
  };

  //delete subtask
  const handleDeleteSubtask = (subtaskId) => {
    const subtask = task.subtasks.find((s) => s.id === subtaskId);
    if (subtask && subtask.isMainSubtask) {
      return;
    }
    deleteSubtask(task.id, columnId, subtaskId);
    setLoading(true);
    setTimeout(() => {
      setChange((prev) => !prev);
    }, 300);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        alert("Please select an image file");
        return;
      }
      if (!newAsset.name) {
        const fileName = file.name.split(".")[0];
        setNewAsset((prev) => ({ ...prev, name: fileName }));
      }

      processFile(file);
    }
  };

  // Process the file (convert to base64 or use URL)
  const processFile = (file) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const content = readerEvent.target.result;
      setUploadPreview(content);
      setNewAsset((prev) => ({ ...prev, url: content }));
    };
    reader.onerror = () => {
      alert("Error reading file");
      setUploadPreview(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle adding a new asset
  const handleAddAsset = (e) => {
    e.preventDefault();

    if (newAsset.name.trim() && newAsset.url) {
      const asset = {
        name: newAsset.name.trim(),
        url: newAsset.url,
      };

      const newActivity = {
        type: "Commented",
        user: locallySavedUser.username,
        timestamp: new Date().toISOString(),
        message: `Added new asset: ${newAsset.name}`,
      };
      const data = { asset, newActivity };

      const saveData = async (data) => {
        try {
          const response = await addImgAsAssets(
            `projects/tasks/addasset/${tasks.id}`,
            data
          );
          setChange((prev) => !prev);
        } catch (error) {
          console.log(error);
        }
      };
      saveData(data);
      setActivities((prevActivities) => [newActivity, ...prevActivities]);
      setChange((prev) => !prev);

      setNewAsset({ name: "", url: "" });
      setUploadPreview(null);
      setShowAssetForm(false);
    }
  };

  // Handle removing an asset
  const handleRemoveAsset = async (assetId) => {
    try {
      const response = await deleteAssetsBackend(
        `projects/tasks/${tasks.id}/delete-asset/${assetId}`
      );
      setChange((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "started":
        return <ThumbsUp className="w-5 h-5 text-white" />;
      case "commented":
        return <MessageSquare className="w-5 h-5 text-white" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "inspection":
        return <CheckSquare className="w-5 h-5 text-white" />;
      case "materialdelivery":
        return <TruckIcon className="w-5 h-5 text-white" />;
      case "safetyconcern":
        return <ShieldAlert className="w-5 h-5 text-white" />;
      case "taskcreated":
        return <List className="w-5 h-5 text-white" />;
      default:
        return <MessageSquare className="w-5 h-5 text-white" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type?.toLowerCase()) {
      case "started":
        return "bg-blue-500";
      case "commented":
        return "bg-gray-500";
      case "completed":
        return "bg-green-500";
      case "inspection":
        return "bg-purple-500";
      case "materialdelivery":
        return "bg-indigo-500";
      case "safetyconcern":
        return "bg-red-500";
      case "taskcreated":
        return "bg-teal-500";
      default:
        return "bg-blue-500";
    }
  };

  const getActivityLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "started":
        return "Started";
      case "commented":
        return "Commented";
      case "completed":
        return "Completed";
      case "inspection":
        return "Inspection";
      case "materialdelivery":
        return "Material Delivery";
      case "safetyconcern":
        return "Safety Concern";
      case "taskcreated":
        return "Task Created";
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "unknown date";

    try {
      const date = new Date(dateString);
      if (isNaN(date)) return "invalid date";

      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      return `${day} ${month}, ${year} (${hours}:${minutes} ${ampm})`;
    } catch (e) {
      return "invalid date";
    }
  };

  // Sort activities by timestamp (newest first)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        alert("Please select an image file");
        return;
      }
      if (!newAsset.name) {
        const fileName = file.name.split(".")[0];
        setNewAsset((prev) => ({ ...prev, name: fileName }));
      }

      processFile(file);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="container mx-auto p-4 bg-white rounded">
            <div className="flex border-b mb-6 border-gray-200">
              <button
                className={`flex items-center px-4 py-2 ${
                  activeTab === "detail"
                    ? "border-b-2 border-black text-black shadow-inner"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("detail")}
              >
                <List className="w-5 h-5 mr-2" />
                Task Detail
              </button>
              <button
                className={`flex items-center px-4 py-2 ${
                  activeTab === "timeline"
                    ? "border-b-2 border-black text-black shadow-inner"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("timeline")}
              >
                <Clock className="w-5 h-5 mr-2" />
                Activities/Timeline
              </button>
            </div>

            {/* Task Detail Tab */}
            {activeTab === "detail" && (
              <div className="bg-white rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center">
                      <ChevronUp className="w-4 h-4 mr-1" />
                      {task.priority.toUpperCase()} PRIORITY
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 ${
                          taskStatus.isCompleted
                            ? "bg-green-500"
                            : taskStatus.isStarted
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        } rounded-full mr-2`}
                      ></div>
                      <span className="text-gray-700 font-medium">
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-600 mb-6">
                  Created At: {formatDateToReadable(task.createdAt)}
                </div>
                <div className="flex items-center border-t border-b border-gray-200 py-4 mb-6">
                  <div className="flex items-center mr-8">
                    <span className="text-gray-700">
                      Assets : {assets.length}
                    </span>
                  </div>
                  <div className="border-l h-6 mx-4"></div>
                  <div className="flex items-center">
                    <span className="text-gray-700">
                      Sub-Task : {task.subtasks ? task.subtasks.length : 0}
                    </span>
                  </div>
                </div>
                {/* Team Members Section with Add/Remove */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-500 font-medium">TASK TEAM</h3>
                  </div>

                  {/* Team Members List */}
                  <div className="space-y-4">
                    {team.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                            {member.initials}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {member.name}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {member.role}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {team.length === 0 && (
                      <div className="text-gray-500 text-sm italic">
                        No team members assigned to this task.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-gray-500 font-medium mb-4">SUB-TASKS</h3>
                  <div className="space-y-4">
                    {task.subtasks &&
                      task.subtasks.map((subTask) => (
                        <div
                          key={subTask.id}
                          className="flex items-start justify-between border-b border-gray-100 pb-3"
                        >
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              <input
                                type="checkbox"
                                id={`subtask-${subTask.id}`}
                                checked={subTask.completed}
                                onChange={() =>
                                  handleSubtaskStatusChange(
                                    subTask.id,
                                    !subTask.completed
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <div className="flex ">
                                <div
                                  className={`text-gray-700 text-md font-medium capitalize ${
                                    subTask.completed
                                      ? "line-through text-gray-400"
                                      : ""
                                  }`}
                                >
                                  {subTask.title}
                                </div>
                                {subTask.isMainSubtask && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 pt-1 rounded-full decoration-none">
                                    Main
                                  </span>
                                )}
                              </div>
                              {subTask.description && (
                                <div className="text-gray-600">
                                  {subTask.description}
                                </div>
                              )}
                              <div className="text-gray-500 text-sm">
                                {formatDateToReadable(task.createdAt)}
                              </div>
                            </div>
                          </div>
                          {!subTask.isMainSubtask ? (
                            <button
                              onClick={() => handleDeleteSubtask(subTask.id)}
                              className="text-red-500 hover:text-red-700 mt-1"
                              title="Delete subtask"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}

                    {(!task.subtasks || task.subtasks.length === 0) && (
                      <div className="text-gray-500 text-sm italic">
                        No subtasks for this task.
                      </div>
                    )}
                  </div>
                </div>
                {/* Assets Section with Add/Remove */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-700 font-medium">ASSETS</h3>

                    <button
                      onClick={() => setShowAssetForm(!showAssetForm)}
                      className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                    >
                      {showAssetForm ? (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Asset
                        </>
                      )}
                    </button>
                  </div>

                  {/* Add Asset Form */}
                  {showAssetForm && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                      <form onSubmit={handleAddAsset} className="mb-4">
                        <div className="mb-4">
                          <label
                            htmlFor="assetName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Asset Name
                          </label>
                          <input
                            type="text"
                            id="assetName"
                            value={newAsset.name}
                            onChange={(e) =>
                              setNewAsset({ ...newAsset, name: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                            disabled
                            placeholder="Document Name"
                            required
                          />
                        </div>

                        {/* File Upload Area */}
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            isDragging
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          {uploadPreview ? (
                            <div className="mb-4">
                              <img
                                src={uploadPreview || "/placeholder.svg"}
                                alt="Upload preview"
                                className="max-h-40 mx-auto border rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadPreview(null);
                                  setNewAsset((prev) => ({ ...prev, url: "" }));
                                }}
                                className="mt-2 text-red-500 text-sm hover:text-red-700"
                              >
                                Remove image
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                              <p className="text-gray-600 mb-2">
                                Drag and drop an image here, or
                              </p>
                            </>
                          )}

                          <div className="flex justify-center">
                            <label
                              htmlFor="fileUpload"
                              className="bg-black text-white px-4 py-2 rounded-md hover:bg-grya-800 cursor-pointer"
                            >
                              Browse Files
                            </label>
                            <input
                              type="file"
                              id="fileUpload"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileSelect}
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAssetForm(false);
                              setUploadPreview(null);
                              setNewAsset({ name: "", url: "" });
                            }}
                            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className={`px-4 py-2 rounded-md ${
                              newAsset.name && uploadPreview
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={!newAsset.name || !uploadPreview}
                          >
                            Add Asset
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Assets Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="relative rounded-lg overflow-hidden border border-gray-200 group"
                      >
                        <a href={asset.url} download={asset.name}>
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-48 object-cover cursor-pointer"
                          />
                        </a>

                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                          <div className="flex justify-between items-center">
                            <span>{asset.name}</span>

                            <button
                              onClick={() => handleRemoveAsset(asset.id)}
                              className="text-red-400 hover:text-red-300"
                              title="Remove asset"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {assets.length === 0 && (
                      <div className="col-span-2 text-center py-8 border border-dashed border-gray-300 rounded-lg">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">
                          No assets added to this task.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Tab - Side by side layout */}
            {activeTab === "timeline" && (
              <div className="bg-white rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-gray-700 font-medium">
                    Activities & Timeline
                  </h3>
                  {!taskStatus.isCompleted && (
                    <div
                      className={`px-3 py-1 rounded-full ${
                        taskStatus.isCompleted
                          ? "bg-green-100 text-green-800"
                          : taskStatus.isStarted
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Timeline - Left side */}
                  <div className="md:w-1/2 relative pb-8">
                    {/* Vertical line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    {/* Timeline items - */}
                    <div className="space-y-8">
                      {sortedActivities.map((activity, index) => (
                        <div key={index} className="relative flex items-start">
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-6 w-3 h-3 rounded-full ${getActivityColor(
                              activity.type
                            )} transform -translate-x-1.5 mt-1.5 z-10 ring-4 ring-white`}
                          ></div>

                          {/* Activity icon */}
                          <div
                            className={`ml-12 ${getActivityColor(
                              activity.type
                            )} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}
                          >
                            {getActivityIcon(activity.type)}
                          </div>

                          {/* Activity content */}
                          <div className="ml-4 flex-1">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-800">
                                {activity.user || "Unknown user"}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                            <div className="text-gray-700 mt-1">
                              {activity.message || ""}
                            </div>

                            {/* Activity card */}
                            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                              <div className="text-sm text-gray-600">
                                {getActivityLabel(activity.type)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Comment Form - Right side */}
                  <div className="md:w-1/2">
                    {columnId === "completed" ? (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-center text-gray-500">
                          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
                          <h3 className="text-lg font-medium text-gray-700 mb-1">
                            Task Completed
                          </h3>
                          <p>
                            This task has been marked as completed. Add a
                            subtask to reopen it.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-gray-700 font-medium mb-4">
                          Add Update or Change Status
                        </h3>

                        {/* Radio-style activity selection for construction */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="commented"
                              name="activityType"
                              checked={activityStatus.Commented}
                              onChange={() => handleStatusChange("Commented")}
                              className="mr-2 h-4 w-4"
                            />
                            <label
                              htmlFor="commented"
                              className="text-gray-700"
                            >
                              Comment
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="inspection"
                              name="activityType"
                              checked={activityStatus.Inspection}
                              onChange={() => handleStatusChange("Inspection")}
                              className="mr-2 h-4 w-4"
                            />
                            <label
                              htmlFor="inspection"
                              className="text-gray-700"
                            >
                              Inspection
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="materialdelivery"
                              name="activityType"
                              checked={activityStatus.MaterialDelivery}
                              onChange={() =>
                                handleStatusChange("MaterialDelivery")
                              }
                              className="mr-2 h-4 w-4"
                            />
                            <label
                              htmlFor="materialdelivery"
                              className="text-gray-700"
                            >
                              Material Delivery
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="safetyconcern"
                              name="activityType"
                              checked={activityStatus.SafetyConcern}
                              onChange={() =>
                                handleStatusChange("SafetyConcern")
                              }
                              className="mr-2 h-4 w-4"
                            />
                            <label
                              htmlFor="safetyconcern"
                              className="text-gray-700"
                            >
                              Safety Concern
                            </label>
                          </div>
                        </div>

                        <form
                          onSubmit={handleSubmitComment}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <textarea
                            className="w-full border border-gray-300 rounded-md p-3 mb-4 h-32 focus:outline-none"
                            placeholder="Add details about the meeting update..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                          ></textarea>

                          <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                          >
                            Add Comment
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDetail;
