import { useState } from "react"
import { CheckCircle, Circle } from "lucide-react"
import MailDetail from "./mail-detail"

export default function MailList({ mails, markAsRead, deleteMail }) {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedMail, setSelectedMail] = useState(null)

  const tabs = [
    { id: "all", label: "All Mail", count: mails.length },
    { id: "sent", label: "Sent", count: mails.filter((m) => m.isSent).length },
    { id: "unread", label: "Unread", count: mails.filter((m) => !m.isRead).length },
    { id: "read", label: "Read", count: mails.filter((m) => m.isRead).length },
  ]

  const filteredMails = mails.filter((mail) => {
    if (activeTab === "all") return true
    if (activeTab === "sent") return mail.isSent
    if (activeTab === "unread") return !mail.isRead
    if (activeTab === "read") return mail.isRead
    return true
  })

  const handleMailClick = (mail) => {
    setSelectedMail(mail)
    if (!mail.isRead) {
      markAsRead(mail.id)
    }
  }

  const closeMailDetail = () => {
    setSelectedMail(null)
  }

  const handleDeleteMail = (id) => {
    deleteMail(id)
    closeMailDetail()
  }

  // Function to format date in the requested format: "15:45 · 5th of July 2023"
  const formatDate = (date) => {
    if (!date) return ""

    const mailDate = new Date(date)

    // Format time in 24-hour format (15:45)
    const hours = mailDate.getHours().toString().padStart(2, "0")
    const minutes = mailDate.getMinutes().toString().padStart(2, "0")
    const timeStr = `${hours}:${minutes}`

    // Format date (5th of July 2023)
    const day = mailDate.getDate()
    const month = mailDate.toLocaleString("default", { month: "long" })
    const year = mailDate.getFullYear()

    // Add ordinal suffix to day (1st, 2nd, 3rd, 4th, etc.)
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th"
      switch (day % 10) {
        case 1:
          return "st"
        case 2:
          return "nd"
        case 3:
          return "rd"
        default:
          return "th"
      }
    }

    const dateStr = `${day}${getOrdinalSuffix(day)} of ${month} ${year}`

    // Combine with a small gap (using a middot character)
    return `${timeStr} · ${dateStr}`
  }

  return (
    <div>
      <div className="flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 flex items-center gap-2 ${
              activeTab === tab.id ? "border-b-2 border-black font-medium shadow-inner" : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span
              className={`inline-flex items-center justify-center w-5 h-5 text-xs ${
                activeTab === tab.id ? "bg-black text-white" : "bg-gray-200 text-gray-700"
              } rounded-full`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-2">
        {filteredMails.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No emails found</div>
        ) : (
          filteredMails.map((mail) => (
            <div
              key={mail.id}
              className={`border-b border-gray-300 p-4 flex items-start hover:bg-gray-50 cursor-pointer ${
                !mail.isRead ? "bg-blue-50" : ""
              }`}
              onClick={() => handleMailClick(mail)}
            >
              <div className="mr-3 mt-1">
                {mail.isRead ? (
                  <CheckCircle size={20} className="text-gray-400" />
                ) : (
                  <Circle size={20} className="text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{mail.subject}</h3>
                  <span className="text-sm text-gray-500">{formatDate(mail.date)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {mail.description.length > 60 ? mail.description.substring(0, 60) + "..." : mail.description}
                </p>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <div>From: {mail.fromName || "Unknown"}</div>
                  <div>To: {mail.to}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedMail && (
        <MailDetail mail={selectedMail} onClose={closeMailDetail} onDelete={() => handleDeleteMail(selectedMail.id)} />
      )}
    </div>
  )
}
