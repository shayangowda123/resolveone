import { useEffect, useState } from 'react'
import {
  createEmployee,
  updateEmployee,
} from '../../../api/employeeApi'
import {
  ROLES,
  DEPARTMENTS,
  RESPONSIBLE_DEPARTMENTS,
} from '../../../constants/employeeConstants'

import { getApiErrorMessage } from '../../../api/axiosInstance'

const initialForm = {
  fullName: '',
  collegeId: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  department: '',
  responsibleDepartment: '',
  section: '',
  phoneNumber: '',
}

const EmployeeFormModal = ({
  open,
  mode,
  employee,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && employee) {
      setFormData({
        fullName: employee.fullName ?? '',
        collegeId: employee.collegeId ?? '',
        email: employee.email ?? '',
        password: '',
        confirmPassword: '',
        role: employee.role ?? '',
        department: employee.department ?? '',
        responsibleDepartment:
          employee.responsibleDepartment ?? '',
        section: employee.section ?? '',
        phoneNumber: employee.phoneNumber ?? '',
      })
    } else {
      setFormData(initialForm)
    }

    setError('')
    setLoading(false)
  }, [open, mode, employee])


    const handleChange = (event) => {
      const { name, value } = event.target

      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }))
    }

    const validateForm = () => {
      if (!formData.fullName.trim())
        return 'Full name is required.'

      if (mode === 'create' && !formData.collegeId.trim())
        return 'College ID is required.'

      if (!formData.email.trim())
        return 'Email is required.'

      if (!formData.role)
        return 'Role is required.'

      if (!formData.department)
        return 'Department is required.'

      if (!formData.responsibleDepartment)
        return 'Responsible department is required.'

      if (mode === 'create') {
        if (!formData.password)
          return 'Password is required.'

        if (formData.password !== formData.confirmPassword)
          return 'Passwords do not match.'
      }

      return null
    }


    const handleSubmit = async (event) => {
      event.preventDefault()

      const validationError = validateForm()

      if (validationError) {
        setError(validationError)
        return
      }

      try {
        setLoading(true)
        setError('')

        const payload = {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          responsibleDepartment:
            formData.responsibleDepartment,
          section: formData.section || null,
          phoneNumber: formData.phoneNumber || null,
        }

        if (mode === 'create') {
          await createEmployee({
            ...payload,
            collegeId: formData.collegeId,
            password: formData.password,
          })
        } else {
          await updateEmployee(employee.id, payload)
        }

        await onSuccess()
        setFormData(initialForm)
        onClose()

      } catch (error) {
        setError(
          getApiErrorMessage(
            error,
            'Failed to save employee.',
          ),
        )
      } finally {
        setLoading(false)
      }
    }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[1.75rem] border border-white/10 bg-[#0d1422] p-8">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {mode === 'create'
                ? 'Create Employee'
                : 'Update Employee'}
            </h2>

            <p className="mt-2 text-slate-400">
              {mode === 'create'
                ? 'Create a new employee account.'
                : 'Update employee information.'}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
        >

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {mode === 'create' && (
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                College ID
              </label>

              <input
                type="text"
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
            >
              <option value="">Select Role</option>

              {ROLES.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Department
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
            >
              <option value="">Select Department</option>

              {DEPARTMENTS.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Responsible Department
            </label>

            <select
              name="responsibleDepartment"
              value={formData.responsibleDepartment}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
            >
              <option value="">
                Select Responsible Department
              </option>

              {RESPONSIBLE_DEPARTMENTS.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Section
            </label>

            <input
              type="text"
              maxLength={1}
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {mode === 'create' && (
            <>
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          <div className="md:col-span-2 mt-4 flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/10 px-6 py-3 text-white hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : mode === 'create'
                ? 'Create Employee'
                : 'Update Employee'}
            </button>

          </div>
        </form>

      </div>
    </div>
  )
}

export default EmployeeFormModal