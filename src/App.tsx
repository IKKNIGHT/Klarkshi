import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
      {user ? <Dashboard /> : <Auth onAuthSuccess={() => {}} />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
