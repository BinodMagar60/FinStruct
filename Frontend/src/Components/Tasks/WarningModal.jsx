const WarningModal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#7e7e7e50] bg-opacity-50 z-50" onClick={onClose}>
    <div className="bg-white p-6 rounded-md shadow-lg w-96 max-w-full mx-4" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-red-600 font-bold text-xl flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        Dependency Warning
      </h3>
      <div className="mt-3 text-gray-700 max-h-60 overflow-y-auto">
        {message.split("\n").map((line, i) => (
          <p key={i} className="mb-2">
            {line}
          </p>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
)

export default WarningModal

