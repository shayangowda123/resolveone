import { useState } from 'react'
import { resetEmployeePassword } from '../../../api/employeeApi'
import { getApiErrorMessage } from '../../../api/axiosInstance'

const ResetPasswordModal = ({
  open,
  employee,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleReset = async () => {
    setError('')

    if (!password) {
      setError('Password is required.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      await resetEmployeePassword(employee.id, password)

      setPassword('')
      setConfirmPassword('')

      await onSuccess()
      onClose()
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          'Failed to reset password.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1422] p-8">

        <h2 className="text-2xl font-semibold text-white">
          Reset Password
        </h2>

        <p className="mt-3 text-slate-400">
          Reset password for{' '}
          <span className="font-semibold text-white">
            {employee?.fullName}
          </span>
        </p>

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6">
          <label className="mb-2 block text-sm text-slate-300">
            New Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm text-slate-300">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/10 px-5 py-3 text-white hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading
              ? 'Resetting...'
              : 'Reset Password'}
          </button>

        </div>

      </div>
    </div>
  )
}

export default ResetPasswordModal