import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { AuthProvider, type AppUserRole, useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Services from './pages/Services'
import Login from './pages/Login'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import BookingDetail from './pages/BookingDetail'
import Settings from './pages/Settings'
import BookService from './pages/BookService'
import DashboardLayout from './components/DashboardNav'
import EngageUs from './pages/EngageUs'
import Properties from './pages/Properties'
import { AdminLogin } from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { PropertyDetail } from './pages/PropertyDetail'
import { InspectionBooking } from './pages/InspectionBooking'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles?: AppUserRole[]
}) {
  const { user, loading, profile } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const clientPortalRoles: AppUserRole[] = ['client_admin', 'client_user', 'staff', 'admin']

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/services',
    element: <Services />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/subscription',
    element: <Navigate to="/pricing#subscription" replace />,
  },
  {
    path: '/engage-us',
    element: <EngageUs />,
  },
  {
    path: '/properties',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/properties/:id',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/book/inspection/:propertyId',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard/*',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'staff']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={clientPortalRoles}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'bookings',
        element: <Bookings />,
      },
      {
        path: 'bookings/:bookingId',
        element: <BookingDetail />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/book/service',
    element: (
      <ProtectedRoute allowedRoles={clientPortalRoles}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <BookService />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default function App() {
  const app = <RouterProvider router={router} />

  return (
    <AuthProvider>
      {stripePromise ? <Elements stripe={stripePromise}>{app}</Elements> : app}
    </AuthProvider>
  )
}
