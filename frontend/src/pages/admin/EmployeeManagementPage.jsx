import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import EmployeeTable from './components/EmployeeTable'
import ResetPasswordModal from './components/ResetPasswordModal'
import { getApiErrorMessage } from '../../api/axiosInstance'
import {
  getEmployees,
  enableEmployee,
  disableEmployee,
} from '../../api/employeeApi'

import DashboardHeader from '../../components/dashboard/DashboardHeader'
import EmployeeFormModal from './components/EmployeeFormModal'



const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [showEmployeeModal, setShowEmployeeModal] =
    useState(false)

  const [selectedEmployee, setSelectedEmployee] =
    useState(null)

  const [modalMode, setModalMode] =
    useState('create')

  const [showResetModal, setShowResetModal] =
    useState(false)

  const [resetEmployee, setResetEmployee] =
    useState(null)

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


        const handleToggleStatus = async (employee) => {
          try {
            if (employee.active) {
              await disableEmployee(employee.id)
            } else {
              await enableEmployee(employee.id)
            }

            await loadEmployees()
          } catch (error) {
            alert(
              getApiErrorMessage(
                error,
                'Failed to update employee status.',
              ),
            )
          }
        }


  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        <DashboardHeader
          badge="Administration"
          title="Employee Management"
          description="Create, update and manage employees."
        />

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              setSelectedEmployee(null)
              setModalMode('create')
              setShowEmployeeModal(true)
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
          >
            <Plus size={18} />

            Create Employee
          </button>
        </div>



                {loading ? (
                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#0d1422] p-12 text-center">
                    Loading employees...
                  </div>
                ) : errorMessage ? (
                  <div className="mt-8 rounded-[1.5rem] border border-rose-400/20 bg-rose-500/10 p-6 text-rose-300">
                    {errorMessage}
                  </div>
                ) : (
                  <EmployeeTable
                    employees={employees}
                    onEdit={(employee) => {
                      setSelectedEmployee(employee)
                      setModalMode('edit')
                      setShowEmployeeModal(true)
                    }}
                    onToggleStatus={handleToggleStatus}
                    onResetPassword={(employee) => {
                      setResetEmployee(employee)
                      setShowResetModal(true)
                    }}
                  />
                )}

                <EmployeeFormModal
                  open={showEmployeeModal}
                  mode={modalMode}
                  employee={selectedEmployee}
                  onClose={() => setShowEmployeeModal(false)}
                  onSuccess={loadEmployees}
                />
                <ResetPasswordModal
                  open={showResetModal}
                  employee={resetEmployee}
                  onClose={() => setShowResetModal(false)}
                  onSuccess={loadEmployees}
                />

      </main>
    </div>
  )
}

export default EmployeeManagementPage