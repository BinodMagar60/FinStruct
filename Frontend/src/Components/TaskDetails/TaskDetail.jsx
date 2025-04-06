import { useState, useEffect } from "react"
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
  UserPlus,
  Trash2,
} from "lucide-react"

const TaskDetail = () => {
  
    // Extract the first task from the data


    const taskData = [
        {
          id: "todo",
          title: "TO DO",
          color: "blue",
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
                  completed: false,
                },
              ],
              // Additional properties for UI
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
              ],
              team: [
                { id: 1, name: "Alex Johnson", role: "Project Manager", initials: "AJ" },
                { id: 2, name: "Emily Wilson", role: "Business Analyst", initials: "EW" },
                { id: 3, name: "Michael Brown", role: "Developer", initials: "MB" },
                { id: 4, name: "Sarah Davis", role: "Designer", initials: "SD" },
              ],
              status: "IN PROGRESS",
            },
          ],
        },
      ]






  const taskColumn = taskData[0]
  const initialTask = taskColumn?.tasks[0]

  const [activeTab, setActiveTab] = useState("detail")
  const [commentText, setCommentText] = useState("")
  const [activityStatus, setActivityStatus] = useState({
    Commented: false,
    Inspection: false,
    MaterialDelivery: false,
    SafetyConcern: false,
  })

  // State for assets - initialize from task data if available
  const [assets, setAssets] = useState(
    initialTask?.assets || [
      { id: 1, name: "Meeting Agenda", url: "/placeholder.svg?height=200&width=400" },
      { id: 2, name: "Project Timeline", url: "/placeholder.svg?height=200&width=400" },
    ],
  )

  // State for new asset
  const [newAsset, setNewAsset] = useState({ name: "", url: "" })

  // State for file upload
  const [uploadPreview, setUploadPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // State for team members - initialize from task data if available
  const [team, setTeam] = useState(
    initialTask?.team || [
      { id: 1, name: "Alex Johnson", role: "Project Manager", initials: "AJ" },
      { id: 2, name: "Emily Wilson", role: "Business Analyst", initials: "EW" },
      { id: 3, name: "Michael Brown", role: "Developer", initials: "MB" },
      { id: 4, name: "Sarah Davis", role: "Designer", initials: "SD" },
    ],
  )

  // State for new team member
  const [newTeamMember, setNewTeamMember] = useState({ name: "", role: "", initials: "" })

  // State for showing forms
  const [showAssetForm, setShowAssetForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)

  // State for activities - initialize from task data if available
  const [activities, setActivities] = useState(
    initialTask?.activities || [
      {
        type: "TaskCreated",
        user: "System",
        timestamp: new Date("2025-03-10").toISOString(),
        message: "Task created!",
      },
      {
        type: "Commented",
        user: "Alex Johnson",
        timestamp: new Date("2025-03-12").toISOString(),
        message: "Agenda has been prepared for the kickoff meeting.",
      },
      {
        type: "Commented",
        user: "Emily Wilson",
        timestamp: new Date("2025-03-14").toISOString(),
        message: "Meeting invites have been sent to all stakeholders.",
      },
    ],
  )

  // Task status tracking
  const [taskStatus, setTaskStatus] = useState({
    isStarted: true, // Assuming the task is already started based on activities
    isCompleted: false,
  })

  // Check if task is started or completed based on activities
  useEffect(() => {
    const isStarted = activities.some((activity) => activity.type === "Started") || activities.length > 0
    const isCompleted = activities.some((activity) => activity.type === "Completed")

    setTaskStatus({
      isStarted,
      isCompleted,
    })

    // Disable Started checkbox if task is already started
    if (isStarted) {
      setActivityStatus((prev) => ({
        ...prev,
      }))
    }
  }, [activities])

  // Task data from provided JSON
  const task = {
    id: initialTask?.id || "task-4",
    title: initialTask?.title || "Project kickoff meeting",
    priority: (initialTask?.priority || "normal").toUpperCase() + " PRIORITY",
    status: taskStatus.isCompleted ? "COMPLETED" : taskStatus.isStarted ? "IN PROGRESS" : "TO DO",
    createdAt: initialTask?.createdAt || "2025-03-10",
    startingDate: initialTask?.startingDate || "2025-03-20",
    dueDate: initialTask?.dueDate || "2025-03-15",
    subTasks: initialTask?.subtasks?.length || 2,
    subTasksList: initialTask?.subtasks || [
      { id: "subtask-4-1", title: "Prepare agenda", completed: true },
      { id: "subtask-4-2", title: "Send invites", completed: false },
    ],
  }

  const handleStatusChange = (status) => {
    // Prevent changing Started status if task is already started
    if (status === "Started" && taskStatus.isStarted) {
      return
    }

    // Prevent any status change if task is completed
    if (taskStatus.isCompleted) {
      return
    }

    // Create a new object with all statuses set to false
    const newActivityStatus = {
      Commented: false,
      Inspection: false,
      MaterialDelivery: false,
      SafetyConcern: false,
    }

    // Set only the selected status to true (radio button behavior)
    newActivityStatus[status] = !activityStatus[status]

    setActivityStatus(newActivityStatus)
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()

    // Don't allow new activities if task is completed
    if (taskStatus.isCompleted) {
      return
    }

    if (commentText.trim() || Object.values(activityStatus).some((status) => status)) {
      // Determine the activity type based on radio selection
      let activityType = "Commented"
      if (activityStatus.Commented) activityType = "Commented"
      else if (activityStatus.Inspection) activityType = "Inspection"
      else if (activityStatus.MaterialDelivery) activityType = "MaterialDelivery"
      else if (activityStatus.SafetyConcern) activityType = "SafetyConcern"

      // Create new activity
      const newActivity = {
        type: activityType,
        user: "Current User", // In a real app, this would be the logged-in user
        timestamp: new Date().toISOString(),
        message: commentText.trim() || getDefaultMessage(activityType),
      }

      // Add to activities at the beginning of the array
      setActivities((prev) => [newActivity, ...prev])

      // Reset form
      setCommentText("")
      setActivityStatus({
        Commented: false,
        Inspection: false,
        MaterialDelivery: false,
        SafetyConcern: false,
      })
    }
  }

  // Handle file selection from browse dialog
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.match("image.*")) {
        alert("Please select an image file")
        return
      }

      // Auto-fill the asset name from the file name if empty
      if (!newAsset.name) {
        const fileName = file.name.split(".")[0] // Remove extension
        setNewAsset((prev) => ({ ...prev, name: fileName }))
      }

      processFile(file)
    }
  }

  // Process the file (convert to base64 or use URL)
  const processFile = (file) => {
    // Create a FileReader to read the file
    const reader = new FileReader()

    // Set up the FileReader onload event
    reader.onload = (readerEvent) => {
      const content = readerEvent.target.result
      setUploadPreview(content)
      setNewAsset((prev) => ({ ...prev, url: content }))
    }

    // Set up error handling
    reader.onerror = () => {
      alert("Error reading file")
      setUploadPreview(null)
    }

    // Read the file as a data URL
    reader.readAsDataURL(file)
  }

  // Handle adding a new asset
  const handleAddAsset = (e) => {
    e.preventDefault()

    if (newAsset.name.trim() && newAsset.url) {
      // Generate a unique ID for the asset
      const newId = Date.now()

      // Add new asset
      const asset = {
        id: newId,
        name: newAsset.name.trim(),
        url: newAsset.url,
      }

      setAssets((prev) => [...prev, asset])

      // Add activity for asset addition
      const newActivity = {
        type: "Commented",
        user: "Current User",
        timestamp: new Date().toISOString(),
        message: `Added new asset: ${newAsset.name}`,
      }

      setActivities((prev) => [newActivity, ...prev])

      // Reset form
      setNewAsset({ name: "", url: "" })
      setUploadPreview(null)
      setShowAssetForm(false)
    }
  }

  // Handle removing an asset
  const handleRemoveAsset = (assetId) => {
    // Get asset name before removal
    const assetToRemove = assets.find((asset) => asset.id === assetId)

    // Remove asset
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId))

    // Add activity for asset removal
    if (assetToRemove) {
      const newActivity = {
        type: "Commented",
        user: "Current User",
        timestamp: new Date().toISOString(),
        message: `Removed asset: ${assetToRemove.name}`,
      }

      setActivities((prev) => [newActivity, ...prev])
    }
  }

  // Handle adding a new team member
  const handleAddTeamMember = (e) => {
    e.preventDefault()

    if (newTeamMember.name.trim() && newTeamMember.role.trim()) {
      // Generate initials if not provided
      const initials =
        newTeamMember.initials.trim() ||
        newTeamMember.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()

      // Add new team member
      const member = {
        id: team.length + 1,
        name: newTeamMember.name,
        role: newTeamMember.role,
        initials: initials,
      }

      setTeam((prev) => [...prev, member])

      // Add activity for team member addition
      const newActivity = {
        type: "Commented",
        user: "Current User",
        timestamp: new Date().toISOString(),
        message: `Added ${newTeamMember.name} (${newTeamMember.role}) to the team`,
      }

      setActivities((prev) => [newActivity, ...prev])

      // Reset form
      setNewTeamMember({ name: "", role: "", initials: "" })
      setShowTeamForm(false)
    }
  }

  // Handle removing a team member
  const handleRemoveTeamMember = (memberId) => {
    // Get member name before removal
    const memberToRemove = team.find((member) => member.id === memberId)

    // Remove team member
    setTeam((prev) => prev.filter((member) => member.id !== memberId))

    // Add activity for team member removal
    if (memberToRemove) {
      const newActivity = {
        type: "Commented",
        user: "Current User",
        timestamp: new Date().toISOString(),
        message: `Removed ${memberToRemove.name} from the team`,
      }

      setActivities((prev) => [newActivity, ...prev])
    }
  }

  // Get default message for activity type
  const getDefaultMessage = (type) => {
    switch (type) {
      case "TaskCreated":
        return "Task created"
      case "Commented":
        return "Added a comment to the task"
      case "Inspection":
        return "Meeting inspection conducted"
      case "MaterialDelivery":
        return "Materials delivered for meeting"
      case "SafetyConcern":
        return "Issue reported"
      case "Completed":
        return "Meeting completed successfully"
      default:
        return "Update on meeting preparation"
    }
  }

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "started":
        return <ThumbsUp className="w-5 h-5 text-white" />
      case "commented":
        return <MessageSquare className="w-5 h-5 text-white" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-white" />
      case "inspection":
        return <CheckSquare className="w-5 h-5 text-white" />
      case "materialdelivery":
        return <TruckIcon className="w-5 h-5 text-white" />
      case "safetyconcern":
        return <ShieldAlert className="w-5 h-5 text-white" />
      case "taskcreated":
        return <List className="w-5 h-5 text-white" />
      default:
        return <MessageSquare className="w-5 h-5 text-white" />
    }
  }

  const getActivityColor = (type) => {
    switch (type?.toLowerCase()) {
      case "started":
        return "bg-blue-500"
      case "commented":
        return "bg-gray-500"
      case "completed":
        return "bg-green-500"
      case "inspection":
        return "bg-purple-500"
      case "materialdelivery":
        return "bg-indigo-500"
      case "safetyconcern":
        return "bg-red-500"
      case "taskcreated":
        return "bg-teal-500"
      default:
        return "bg-blue-500"
    }
  }

  const getActivityLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "started":
        return "Started"
      case "commented":
        return "Commented"
      case "completed":
        return "Completed"
      case "inspection":
        return "Inspection"
      case "materialdelivery":
        return "Material Delivery"
      case "safetyconcern":
        return "Safety Concern"
      case "taskcreated":
        return "Task Created"
      default:
        return type
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "unknown date"

    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 1) return "today"
      if (diffDays === 1) return "yesterday"
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
      return `${Math.floor(diffDays / 365)} years ago`
    } catch (e) {
      return "invalid date"
    }
  }

  // Sort activities by timestamp (newest first)
  const sortedActivities = [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      if (!file.type.match("image.*")) {
        alert("Please select an image file")
        return
      }

      // Auto-fill the asset name from the file name if empty
      if (!newAsset.name) {
        const fileName = file.name.split(".")[0] // Remove extension
        setNewAsset((prev) => ({ ...prev, name: fileName }))
      }

      processFile(file)
    }
  }

  return (
    <div className="p-6">
      <div className="container mx-auto p-4 bg-white pb-8 rounded">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">{task.title}</h1>

      {/* Tabs - Single set of tabs at the top level */}
      <div className="flex border-b mb-6 border-gray-200">
        <button
          className={`flex items-center px-4 py-2 ${activeTab === "detail" ? "border-b-2 border-black text-black shadow-inner" : "text-gray-600"}`}
          onClick={() => setActiveTab("detail")}
        >
          <List className="w-5 h-5 mr-2" />
          Task Detail
        </button>
        <button
          className={`flex items-center px-4 py-2 ${activeTab === "timeline" ? "border-b-2 border-black text-black shadow-inner" : "text-gray-600"}`}
          onClick={() => setActiveTab("timeline")}
        >
          <Clock className="w-5 h-5 mr-2" />
          Activities/Timeline
        </button>
      </div>

      {/* Task Detail Tab */}
      {activeTab === "detail" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center">
                <ChevronUp className="w-4 h-4 mr-1" />
                {task.priority}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 ${
                    taskStatus.isCompleted ? "bg-green-500" : taskStatus.isStarted ? "bg-yellow-500" : "bg-gray-500"
                  } rounded-full mr-2`}
                ></div>
                <span className="text-gray-700 font-medium">{task.status}</span>
              </div>
            </div>
          </div>

          <div className="text-gray-600 mb-6">Created At: {task.createdAt}</div>

          <div className="flex items-center border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex items-center mr-8">
              <span className="text-gray-700">Assets : {assets.length}</span>
            </div>
            <div className="border-l h-6 mx-4"></div>
            <div className="flex items-center">
              <span className="text-gray-700">Sub-Task : {task.subTasks}</span>
            </div>
          </div>

          {/* Team Members Section with Add/Remove */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-500 font-medium">TASK TEAM</h3>
              {!taskStatus.isCompleted && (
                <button
                  onClick={() => setShowTeamForm(!showTeamForm)}
                  className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                >
                  {showTeamForm ? (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add Team Member
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Add Team Member Form */}
            {showTeamForm && !taskStatus.isCompleted && (
              <form onSubmit={handleAddTeamMember} className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="memberName"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="memberRole" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      id="memberRole"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      placeholder="Project Manager"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="memberInitials" className="block text-sm font-medium text-gray-700 mb-1">
                      Initials (Optional)
                    </label>
                    <input
                      type="text"
                      id="memberInitials"
                      value={newTeamMember.initials}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, initials: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      placeholder="JD"
                      maxLength={2}
                    />
                  </div>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Add Team Member
                </button>
              </form>
            )}

            {/* Team Members List */}
            <div className="space-y-4">
              {team.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{member.name}</div>
                      <div className="text-gray-500 text-sm">{member.role}</div>
                    </div>
                  </div>
                  {!taskStatus.isCompleted && (
                    <button
                      onClick={() => handleRemoveTeamMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove team member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {team.length === 0 && (
                <div className="text-gray-500 text-sm italic">No team members assigned to this task.</div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-gray-500 font-medium mb-4">SUB-TASKS</h3>
            <div className="space-y-4">
              {task.subTasksList.map((subTask, index) => (
                <div key={index} className="flex items-start">
                  <div className="mt-1 mr-3">
                    <CheckSquare className={`w-5 h-5 ${subTask.completed ? "text-black" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <div className="text-gray-500">{task.createdAt}</div>
                    <div className="text-gray-500 font-medium">{subTask.title}</div>
                    <div className="text-gray-700">{subTask.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assets Section with Add/Remove */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-700 font-medium">ASSETS</h3>
              {!taskStatus.isCompleted && (
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
              )}
            </div>

            {/* Add Asset Form */}
            {showAssetForm && !taskStatus.isCompleted && (
              <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                <form onSubmit={handleAddAsset} className="mb-4">
                  <div className="mb-4">
                    <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Name
                    </label>
                    <input
                      type="text"
                      id="assetName"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      placeholder="Document Name"
                      required
                    />
                  </div>

                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
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
                            setUploadPreview(null)
                            setNewAsset((prev) => ({ ...prev, url: "" }))
                          }}
                          className="mt-2 text-red-500 text-sm hover:text-red-700"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600 mb-2">Drag and drop an image here, or</p>
                      </>
                    )}

                    <div className="flex justify-center">
                      <label
                        htmlFor="fileUpload"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
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
                        setShowAssetForm(false)
                        setUploadPreview(null)
                        setNewAsset({ name: "", url: "" })
                      }}
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-md ${
                        newAsset.name && uploadPreview
                          ? "bg-blue-500 text-white hover:bg-blue-600"
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
                <div key={asset.id} className="relative rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={asset.url || "/placeholder.svg"} alt={asset.name} className="w-full h-48 object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                    <div className="flex justify-between items-center">
                      <span>{asset.name}</span>
                      {!taskStatus.isCompleted && (
                        <button
                          onClick={() => handleRemoveAsset(asset.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Remove asset"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {assets.length === 0 && (
                <div className="col-span-2 text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No assets added to this task.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab - Side by side layout */}
      {activeTab === "timeline" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-700 font-medium">Activities & Timeline</h3>
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

              {/* Timeline items - Newest first */}
              <div className="space-y-8">
                {sortedActivities.map((activity, index) => (
                  <div key={index} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-6 w-3 h-3 rounded-full ${getActivityColor(activity.type)} transform -translate-x-1.5 mt-1.5 z-10 ring-4 ring-white`}
                    ></div>

                    {/* Activity icon */}
                    <div
                      className={`ml-12 ${getActivityColor(activity.type)} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Activity content */}
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">{activity.user || "Unknown user"}</span>
                        <span className="ml-2 text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                      </div>
                      <div className="text-gray-700 mt-1">{activity.message || ""}</div>

                      {/* Activity card */}
                      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <div className="text-sm text-gray-600">{getActivityLabel(activity.type)}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* If task is completed, show completion message */}
                {taskStatus.isCompleted && (
                  <div className="relative flex items-start">
                    <div className="absolute left-6 w-3 h-3 rounded-full bg-green-500 transform -translate-x-1.5 mt-1.5 z-10 ring-4 ring-white"></div>
                    <div className="ml-12 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="p-3 bg-green-50 rounded-md border border-green-200">
                        <div className="text-green-700 font-medium">Task completed</div>
                        <div className="text-sm text-green-600">No further updates can be made</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add Comment Form - Right side */}
            <div className="md:w-1/2">
              {taskStatus.isCompleted ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-center text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">Task Completed</h3>
                    <p>This task has been marked as completed and cannot be modified further.</p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-gray-700 font-medium mb-4">Add Update or Change Status</h3>

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
                      <label htmlFor="commented" className="text-gray-700">
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
                      <label htmlFor="inspection" className="text-gray-700">
                        Inspection
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="materialdelivery"
                        name="activityType"
                        checked={activityStatus.MaterialDelivery}
                        onChange={() => handleStatusChange("MaterialDelivery")}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="materialdelivery" className="text-gray-700">
                        Material Delivery
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="safetyconcern"
                        name="activityType"
                        checked={activityStatus.SafetyConcern}
                        onChange={() => handleStatusChange("SafetyConcern")}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="safetyconcern" className="text-gray-700">
                        Safety Concern
                      </label>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitComment} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <textarea
                      className="w-full border rounded-md p-3 mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add details about the meeting update..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Submit Update
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
  )
}

export default TaskDetail

