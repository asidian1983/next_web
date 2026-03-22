import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-textile-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Page not found</h2>
        <p className="text-gray-400 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link
          href="/"
          className="px-6 py-2 bg-textile-600 text-white rounded-lg hover:bg-textile-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
