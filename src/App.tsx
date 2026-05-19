import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Services from './pages/Services'
import Login from './pages/Login'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import Settings from './pages/Settings'
import BookService from './pages/BookService'
import DashboardLayout from './components/DashboardNav'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/services",
        element: <Services />,
    },
    {
        path: "/pricing",
        element: <Pricing />,
    },
    {
        path: "/about",
        element: <About />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "bookings",
                element: <Bookings />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
    },
    {
        path: "/book/service",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <BookService />,
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

export default function App() {
  return (
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
  )
}
