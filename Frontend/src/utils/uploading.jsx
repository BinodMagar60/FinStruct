import { useEffect, useState } from "react"

export default function LoadingScreen() {
  const [dots, setDots] = useState("")

  // Optional: Add animated dots to the "UPLOADING" text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="w-full max-w-md rounded-md p-8 bg-white flex flex-col items-center">
        {/* Spinner */}
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full mb-4"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>

        {/* Text */}
        <p className="text-gray-600 text-center uppercase tracking-wide">UPLOADING{dots}</p>
        <p className="text-gray-500 text-center text-sm mt-1">PLEASE WAIT</p>
      </div>
    </div>
  )
}
