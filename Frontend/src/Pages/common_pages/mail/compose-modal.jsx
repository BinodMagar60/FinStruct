import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ComposeModal({ onClose, sendMail, users, currentUser }) {
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState({}); // <-- for validation messages

  useEffect(() => {
    if (toEmail.length > 0) {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(toEmail.toLowerCase()) ||
          user.name.toLowerCase().includes(toEmail.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [toEmail, users]);

  const validateForm = () => {
    const newErrors = {};
    if (!toEmail.trim()) {
      newErrors.toEmail = "Recipient email is required.";
    } else if (!/\S+@\S+\.\S+/.test(toEmail)) {
      newErrors.toEmail = "Please enter a valid email address.";
    }
    if (!subject.trim()) newErrors.subject = "Subject is required.";
    if (!message.trim()) newErrors.message = "Message cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = () => {
    if (!validateForm()) return; // stop if invalid

    const mailData = {
      subject,
      description: message,
      toEmail,
    };

    sendMail(mailData);
    onClose();
  };

  const selectSuggestion = (user) => {
    setToEmail(user.email);
    setShowSuggestions(false);
    setErrors((prev) => ({ ...prev, toEmail: "" }));
  };

  return (
    <div className="fixed inset-0 bg-[#00000012] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Compose Mail</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* To Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
            <input
              type="text"
              value={toEmail}
              onChange={(e) => {
                setToEmail(e.target.value);
                setErrors((prev) => ({ ...prev, toEmail: "" }));
              }}
              className={`w-full p-2 border rounded-md ${
                errors.toEmail ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter recipient email"
            />
            {errors.toEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.toEmail}</p>
            )}
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((user, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectSuggestion(user)}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.jobTitle}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No matches found</div>
                )}
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors((prev) => ({ ...prev, subject: "" }));
              }}
              className={`w-full p-2 border rounded-md ${
                errors.subject ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter subject"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setErrors((prev) => ({ ...prev, message: "" }));
              }}
              className={`w-full p-2 border rounded-md h-40 ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Write your message here"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
