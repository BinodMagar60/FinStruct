import { MessageSquare, ThumbsUp, CheckCircle, AlertTriangle, UserPlus } from "lucide-react"

const TaskTimeline = ({ activities = [], onAddActivity }) => {
  // Add default empty array to prevent undefined error

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "started":
        return <ThumbsUp className="w-5 h-5 text-white" />
      case "commented":
        return <MessageSquare className="w-5 h-5 text-white" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-white" />
      case "bug":
        return <AlertTriangle className="w-5 h-5 text-white" />
      case "assigned":
        return <UserPlus className="w-5 h-5 text-white" />
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
      case "bug":
        return "bg-red-500"
      case "assigned":
        return "bg-purple-500"
      default:
        return "bg-blue-500"
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

  // If activities is empty, show a message
  if (!activities || activities.length === 0) {
    return <div className="text-gray-500 py-4">No activities to display</div>
  }

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div key={index} className="flex">
          <div
            className={`w-10 h-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center mr-4 flex-shrink-0`}
          >
            {getActivityIcon(activity.type)}
          </div>
          <div>
            <div className="font-medium text-gray-800">{activity.user || "Unknown user"}</div>
            <div className="text-gray-500 text-sm">
              {activity.type || "Activity"} {formatDate(activity.timestamp)}
            </div>
            <div className="mt-1 text-gray-700">{activity.message || ""}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskTimeline

