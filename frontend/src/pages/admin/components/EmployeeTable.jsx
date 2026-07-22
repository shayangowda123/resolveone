import {
  Edit,
  KeyRound,
  Power,
} from 'lucide-react'

import { formatEnumLabel } from '../../../utils/formatters'

const EmployeeTable = ({
  employees,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) => {
  if (employees.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-[#0d1422] p-12 text-center">
        <h3 className="text-xl font-semibold">
          No employees found
        </h3>

        <p className="mt-3 text-slate-400">
          Create your first employee to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0d1422]">
      <table className="w-full">
        <thead className="border-b border-white/10 bg-[#11192b]">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Employee
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Role
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Department
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {employees.map(employee => (
            <tr
              key={employee.id}
              className="border-b border-white/5 hover:bg-white/[0.03]"
            >
              <td className="px-6 py-5">
                <div>
                  <p className="font-semibold">
                    {employee.fullName}
                  </p>

                  <p className="text-sm text-slate-400">
                    {employee.email}
                  </p>
                </div>
              </td>

              <td className="px-6 py-5">
                {formatEnumLabel(employee.role)}
              </td>

              <td className="px-6 py-5">
                {formatEnumLabel(employee.department)}
              </td>

              <td className="px-6 py-5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    employee.active
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {employee.active
                    ? 'Active'
                    : 'Inactive'}
                </span>
              </td>

              <td className="px-6 py-5">
                <div className="flex justify-center gap-3">

                  <button
                    onClick={() => onEdit(employee)}
                    className="rounded-lg p-2 hover:bg-indigo-500/20"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() =>
                      onResetPassword(employee)
                    }
                    className="rounded-lg p-2 hover:bg-amber-500/20"
                  >
                    <KeyRound size={18} />
                  </button>

                  <button
                    onClick={() =>
                      onToggleStatus(employee)
                    }
                    className="rounded-lg p-2 hover:bg-rose-500/20"
                  >
                    <Power size={18} />
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeTable