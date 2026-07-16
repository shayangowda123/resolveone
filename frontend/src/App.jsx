import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import StudentDashboardPage from './pages/student/StudentDashboardPage'
import CreateComplaintPage from './pages/student/CreateComplaintPage'
import StudentComplaintDetailPage from './pages/student/StudentComplaintDetailPage'

import StaffDashboardPage from './pages/staff/StaffDashboardPage'
import StaffComplaintDetailsPage from './pages/staff/StaffComplaintDetailsPage'
import ManagementComplaintDetailsPage from './pages/management/ManagementComplaintDetailsPage'
import ManagementDashboardPage from './pages/management/ManagementDashboardPage'

import {
  ProtectedRoute,
  PublicOnlyRoute,
} from './routes/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />
      </Route>

      {/* Student protected routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={['STUDENT']}
          />
        }
      >
        <Route element={<AppLayout />}>
          <Route
            path="/student/dashboard"
            element={<StudentDashboardPage />}
          />

          <Route
            path="/student/complaints/new"
            element={<CreateComplaintPage />}
          />

          <Route
            path="/student/complaints/:complaintId"
            element={<StudentComplaintDetailPage />}
          />
        </Route>
      </Route>

      {/* Staff protected routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={['STAFF']}
          />
        }
      >
        <Route element={<AppLayout />}>
          <Route
            path="/staff/dashboard"
            element={<StaffDashboardPage />}
          />

          <Route
            path="/staff/complaints/:complaintId"
            element={<StaffComplaintDetailsPage />}
          />
        </Route>
      </Route>

      {/* Management protected routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              'HOD',
              'DEAN',
              'PRINCIPAL',
              'ADMIN',
            ]}
          />
        }
      >
        <Route
          path="/management/dashboard"
          element={<ManagementDashboardPage />}
        />

        <Route
          path="/management/complaints/:complaintId"
          element={<ManagementComplaintDetailsPage />}
        />
      </Route>

      {/* Unauthorized page */}
      <Route
        path="/unauthorized"
        element={
          <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-6 text-center text-white">
            <div>
              <h1 className="text-3xl font-semibold">
                Access unavailable
              </h1>

              <p className="mt-3 text-slate-500">
                Your current role does not have access to this
                workspace.
              </p>
            </div>
          </div>
        }
      />

      {/* Default route */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* Unknown routes — ALWAYS LAST */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  )
}

export default App