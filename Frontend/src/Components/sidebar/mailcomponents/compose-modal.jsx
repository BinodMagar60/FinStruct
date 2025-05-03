import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function ComposeModal({ onClose, sendMail, users, currentUser }) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Check for ":everyone" in the to field
  useEffect(() => {
    if (to === ":everyone") {
      setSuggestions(["All Company Users"])
      setShowSuggestions(true)
    } else if (to.length > 0) {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(to.toLowerCase()) || user.name.toLowerCase().includes(to.toLowerCase()),
      )
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [to, users])

  const handleSend = () => {
    const recipients = to === ":everyone" ? "All Employees" : to

    sendMail({
      subject,
      description: message, // Use the full message as description
      to: recipients,
    })

    onClose()
  }

  const selectSuggestion = (suggestion) => {
    if (suggestion === "All Company Users") {
      setTo(":everyone")
    } else {
      setTo(suggestion.email)
    }
    setShowSuggestions(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Compose Mail</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter recipient email or ':everyone' for all company users"
            />
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion === "All Company Users" ? (
                        <div className="font-medium">All Company Users</div>
                      ) : (
                        <>
                          <div className="font-medium">{suggestion.name}</div>
                          <div className="text-sm text-gray-600">{suggestion.email}</div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No matches found</div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-md h-40"
              placeholder="Write your message here"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              disabled={!subject || !to || !message}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
