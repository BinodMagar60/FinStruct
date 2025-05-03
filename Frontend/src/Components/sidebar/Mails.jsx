import { useState, useEffect, useCallback } from "react"
import MailList from "./mailcomponents/mail-list"
import ComposeModal from "./mailcomponents/compose-modal"

export default function MailPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [mails, setMails] = useState([])
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  // const [loading, setLoading] = useState(true)

  // Mock data - In a real application, this would come from an API
  // Updated to match the Mongoose schema:
  // companyId, subject, description, from, to, date, isRead, isSent
  const mockMails = [
    {
      id: 1, // This would be _id in MongoDB
      companyId: "60d21b4667d0d8992e610c85", // Mock ObjectId
      subject: "New project proposal",
      description: `Dear Marketing Team,

I'm excited to share our detailed proposal for the Q2 marketing strategy. After analyzing our Q1 performance and market trends, I believe we have a strong opportunity to increase our market share through targeted digital campaigns.

Key points:
- Increase social media presence by 30%
- Launch the new product line with an integrated campaign
- Partner with three key influencers in our industry
- Optimize our conversion funnel with A/B testing

Please review the attached documents and share your feedback by Friday. I'd like to finalize this plan by early next week.

Best regards,
Emily`,
      from: "60d21b4667d0d8992e610c86", // User ObjectId
      fromName: "Emily Johnson", // Additional field for display purposes
      to: "Marketing Team",
      date: new Date(2023, 4, 15, 10, 30), // May 15, 2023, 10:30 AM
      isRead: false,
      isSent: false, // This indicates the email was received, not sent by the current user
    },
    {
      id: 2,
      companyId: "60d21b4667d0d8992e610c85",
      subject: "Budget Review Meeting",
      description: `Hello Finance Department,

I've scheduled our quarterly budget review meeting for this Thursday at 2 PM in Conference Room A. Please find the agenda and financial reports attached to this email.

Agenda:
1. Q1 Performance Review
2. Budget Variance Analysis
3. Q2 Budget Adjustments
4. Department Funding Requests
5. Cost-saving Initiatives

Please come prepared with your department's spending reports and any funding requests for the upcoming quarter.

Regards,
Michael Chen
Financial Director`,
      from: "60d21b4667d0d8992e610c87",
      fromName: "Michael Chen",
      to: "Finance Department",
      date: new Date(2023, 4, 15, 9, 15), // May 15, 2023, 9:15 AM
      isRead: false,
      isSent: false,
    },
    {
      id: 3,
      companyId: "60d21b4667d0d8992e610c85",
      subject: "Customer Feedback Report",
      description: "Quarterly customer satisfaction analysis shows a 15% increase in our NPS score. Great job team!",
      from: "60d21b4667d0d8992e610c88",
      fromName: "Sarah Rodriguez",
      to: "Customer Success Team",
      date: new Date(2023, 4, 15, 7, 45), // May 15, 2023, 7:45 AM
      isRead: true,
      isSent: false,
    },
    {
      id: 4,
      companyId: "60d21b4667d0d8992e610c85",
      subject: "Product Development Update",
      description:
        "Sprint progress and upcoming feature roadmap. We're on track to release the new dashboard next week.",
      from: "60d21b4667d0d8992e610c89",
      fromName: "Alex Kim",
      to: "Engineering Team",
      date: new Date(2023, 4, 14, 16, 30), // May 14, 2023, 4:30 PM
      isRead: true,
      isSent: false,
    },
    {
      id: 5,
      companyId: "60d21b4667d0d8992e610c85",
      subject: "Weekly Team Update",
      description:
        "Summary of our team's progress this week. We've hit all our KPIs and are ready for the product launch.",
      from: "60d21b4667d0d8992e610c86", // Current user's ID
      fromName: "Emily Johnson",
      to: "Marketing Team",
      date: new Date(2023, 4, 14, 15, 0), // May 14, 2023, 3:00 PM
      isRead: true,
      isSent: true, // This indicates the email was sent by the current user
    },
  ]

  const mockUsers = [
    {
      id: "60d21b4667d0d8992e610c86",
      name: "Emily Johnson",
      email: "emily.johnson@company.com",
      department: "Marketing",
    },
    { id: "60d21b4667d0d8992e610c87", name: "Michael Chen", email: "michael.chen@company.com", department: "Finance" },
    {
      id: "60d21b4667d0d8992e610c88",
      name: "Sarah Rodriguez",
      email: "sarah.rodriguez@company.com",
      department: "Customer Success",
    },
    { id: "60d21b4667d0d8992e610c89", name: "Alex Kim", email: "alex.kim@company.com", department: "Engineering" },
    {
      id: "60d21b4667d0d8992e610c90",
      name: "David Thompson",
      email: "david.thompson@company.com",
      department: "Sales",
    },
  ]

  const mockCurrentUser = {
    id: "60d21b4667d0d8992e610c86",
    name: "Emily Johnson",
    email: "emily.johnson@company.com",
    department: "Marketing",
  }

  // Load initial data
  useEffect(() => {
    // Simulate API call with setTimeout
    const loadData = async () => {
      try {
        // API INTEGRATION POINT:
        // Replace this with actual API calls to fetch mails and users
        // Example:
        // const mailsResponse = await fetch('/api/mails');
        // const mailsData = await mailsResponse.json();
        // const usersResponse = await fetch('/api/users');
        // const usersData = await usersResponse.json();

         setMails(mockMails)
          setUsers(mockUsers)
          setCurrentUser(mockCurrentUser)
          // setLoading(false)

        // setTimeout(() => {
        //   setMails(mockMails)
        //   setUsers(mockUsers)
        //   setCurrentUser(mockCurrentUser)
        //   setLoading(false)
        // }, 500)
      } catch (error) {
        console.error("Failed to load data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Memoize functions to prevent unnecessary re-renders
  const sendMail = useCallback(
    (mail) => {
      // API INTEGRATION POINT:
      // In a real application, you would make an API call here
      // Example:
      // await fetch('/api/mails', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(mail)
      // });

      setMails((prevMails) => [
        {
          id: prevMails.length + 1,
          companyId: "60d21b4667d0d8992e610c85", // Company ID would come from the current user's context
          from: currentUser.id,
          fromName: currentUser.name,
          ...mail,
          date: new Date(), // Use current date for new emails
          isRead: false,
          isSent: true, // Mark as sent since current user is sending it
        },
        ...prevMails,
      ])
    },
    [currentUser],
  )

  const markAsRead = useCallback((id) => {
    // API INTEGRATION POINT:
    // In a real application, you would make an API call here
    // Example:
    // await fetch(`/api/mails/${id}/read`, {
    //   method: 'PUT'
    // });

    setMails((prevMails) => prevMails.map((mail) => (mail.id === id ? { ...mail, isRead: true } : mail)))
  }, [])

  const deleteMail = useCallback((id) => {
    // API INTEGRATION POINT:
    // In a real application, you would make an API call here
    // Example:
    // await fetch(`/api/mails/${id}`, {
    //   method: 'DELETE'
    // });

    setMails((prevMails) => prevMails.filter((mail) => mail.id !== id))
  }, [])

  // if (loading) {
  //   return <div className="flex justify-center items-center h-screen">Loading...</div>
  // }

  return (
    <div className="p-6">
      <div className="container mx-auto p-4 bg-white pb-8 rounded">
      <h1 className="text-2xl font-bold mb-6">Mails</h1>

      <MailList mails={mails} markAsRead={markAsRead} deleteMail={deleteMail} />

      {isComposeOpen && (
        <ComposeModal
          onClose={() => setIsComposeOpen(false)}
          sendMail={sendMail}
          users={users}
          currentUser={currentUser}
        />
      )}

      <button
        onClick={() => setIsComposeOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Compose new mail"
      >
        <span className="text-2xl">+</span>
      </button>
    </div>
    </div>
  )
}
