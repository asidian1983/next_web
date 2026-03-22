'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button onClick={reset} className="px-6 py-2 bg-textile-600 text-white rounded-lg hover:bg-textile-700">
          Try again
        </button>
      </div>
    </div>
  )
}
