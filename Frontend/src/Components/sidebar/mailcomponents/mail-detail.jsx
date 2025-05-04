import { X } from "lucide-react"

export default function MailDetail({ mail, onClose, onDelete }) {
  // Format date for display
  const formatDetailDate = (date) => {
    if (!date) return ""

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }

    return new Date(date).toLocaleString(undefined, options)
  }

  return (
    <div className="fixed inset-0 bg-[#00000012] bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{mail.subject}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="border-t border-b py-4 mb-4 border-gray-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                From: {mail.fromName || "Unknown"}
                {/* {mail.fromJobTitle && <span className="text-gray-500 ml-1">({mail.fromJobTitle})</span>} */}
              </p>
              <p className="text-gray-600">To: {mail.to}</p>
            </div>
            <p className="text-sm text-gray-500">{formatDetailDate(mail.date)}</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          {/* Display the message content from description */}
          <div style={{ whiteSpace: "pre-line" }}>{mail.description}</div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-500 rounded-md text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
