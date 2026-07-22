import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Users,
  UserCheck,
  UserX,
  Building2,
  ArrowRight,
} from 'lucide-react'

import { getEmployees } from '../../api/employeeApi'
import { getApiErrorMessage } from '../../api/axiosInstance'

import { useAuth } from '../../context/AuthContext'

import DashboardHeader from '../../components/dashboard/DashboardHeader'
import StatCard from '../../components/dashboard/StatCard'

const AdminDashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadEmployees = useCallback(async () => {
    try {
      setErrorMessage('')

      const response = await getEmployees()

      setEmployees(response.data ?? [])
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Unable to load employees.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const statistics = useMemo(() => {
    const total = employees.length

    const active = employees.filter(
      employee => employee.active,
    ).length

    const inactive = total - active

    const departments = new Set(
      employees
        .map(employee => employee.department)
        .filter(Boolean),
    ).size

    return {
      total,
      active,
      inactive,
      departments,
    }
  }, [employees])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <DashboardHeader
          badge="Administration"
          title={`Welcome back, ${user?.name ?? 'Admin'}`}
          description="Manage employees, monitor the platform, and administer ResolveOne."
        />

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Employees"
            value={statistics.total}
            description="Total employees"
            icon={<Users size={24} />}
          />

          <StatCard
            label="Active"
            value={statistics.active}
            description="Currently active"
            icon={<UserCheck size={24} />}
          />

          <StatCard
            label="Inactive"
            value={statistics.inactive}
            description="Disabled employees"
            icon={<UserX size={24} />}
          />

          <StatCard
            label="Departments"
            value={statistics.departments}
            description="Departments covered"
            icon={<Building2 size={24} />}
          />
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-white/10 bg-[#0d1422] p-8">
          <h2 className="text-2xl font-semibold">
            Quick Actions
          </h2>

          <p className="mt-2 text-slate-400">
            Manage your institution.
          </p>

          <button
            onClick={() =>
              navigate('/admin/employees')
            }
            className="mt-8 flex items-center gap-3 rounded-xl bg-indigo-600 px-6 py-4 font-semibold transition hover:bg-indigo-500"
          >
            Employee Management

            <ArrowRight size={18} />
          </button>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboardPage