import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  Users,
} from 'lucide-react'

import {
  assignComplaintToStaff,
  getEligibleStaff,
  getManagementComplaintById,
} from '../../api/managementApi'

import {
  getApiErrorMessage,
} from '../../api/axiosInstance'

const ManagementComplaintDetailsPage = () => {
  const { complaintId } = useParams()
  const navigate = useNavigate()

  const [complaint, setComplaint] =
    useState(null)

  const [eligibleStaff, setEligibleStaff] =
    useState([])

  const [selectedStaffId, setSelectedStaffId] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(true)

  const [isStaffLoading, setIsStaffLoading] =
    useState(false)

  const [isAssigning, setIsAssigning] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState('')

  const [staffErrorMessage, setStaffErrorMessage] =
    useState('')

  const [successMessage, setSuccessMessage] =
    useState('')

  const loadComplaint = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const apiResponse =
        await getManagementComplaintById(
          complaintId,
        )

      setComplaint(apiResponse?.data ?? null)
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Complaint could not be loaded.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }, [complaintId])

  const loadEligibleStaff =
    useCallback(async () => {
      try {
        setIsStaffLoading(true)
        setStaffErrorMessage('')

        const apiResponse =
          await getEligibleStaff(complaintId)

        setEligibleStaff(
          apiResponse?.data ?? [],
        )
      } catch (error) {
        setStaffErrorMessage(
          getApiErrorMessage(
            error,
            'Eligible staff could not be loaded.',
          ),
        )
      } finally {
        setIsStaffLoading(false)
      }
    }, [complaintId])

  useEffect(() => {
    loadComplaint()
    loadEligibleStaff()
  }, [
    loadComplaint,
    loadEligibleStaff,
  ])

  const handleAssignStaff = async () => {
    if (!selectedStaffId) {
      setStaffErrorMessage(
        'Please select a staff member first.',
      )
      return
    }

    try {
      setIsAssigning(true)
      setStaffErrorMessage('')
      setSuccessMessage('')

      const apiResponse =
        await assignComplaintToStaff(
          complaintId,
          selectedStaffId,
        )

      setComplaint(
        apiResponse?.data ?? complaint,
      )

      setSuccessMessage(
        'Complaint assigned successfully.',
      )

      setSelectedStaffId('')
    } catch (error) {
      setStaffErrorMessage(
        getApiErrorMessage(
          error,
          'Complaint could not be assigned.',
        ),
      )
    } finally {
      setIsAssigning(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-app-spin text-indigo-300"
          />

          <p className="mt-4 text-slate-400">
            Loading complaint...
          </p>
        </div>
      </div>
    )
  }

  if (errorMessage || !complaint) {
    return (
      <div className="min-h-screen bg-[#070b14] p-6 text-white">
        <button
          type="button"
          onClick={() =>
            navigate(
              '/management/dashboard',
            )
          }
          className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-slate-300"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-rose-400/20 bg-rose-400/[0.06] p-10 text-center">
          <AlertTriangle
            size={42}
            className="mx-auto text-rose-300"
          />

          <h1 className="mt-5 text-2xl font-semibold">
            Complaint could not be loaded
          </h1>

          <p className="mt-3 text-slate-400">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={loadComplaint}
            className="mt-6 rounded-full border border-white/10 px-5 py-3"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070b14] p-6 text-white">
      <main className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() =>
            navigate(
              '/management/dashboard',
            )
          }
          className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-slate-300 transition hover:border-indigo-400/30 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        {/* Complaint information */}
        <section className="mt-8 rounded-[2rem] border border-indigo-400/15 bg-[#0d1422] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Escalated complaint
          </p>

          <h1 className="mt-4 text-4xl font-semibold">
            {complaint.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            {complaint.description}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Detail
              label="Status"
              value={complaint.status}
            />

            <Detail
              label="Priority"
              value={complaint.priority}
            />

            <Detail
              label="Responsible department"
              value={
                complaint.responsibleDepartment
              }
            />

            <Detail
              label="Reported by"
              value={complaint.createdByName}
            />

            <Detail
              label="Assigned staff"
              value={
                complaint.assignedToName ||
                'Not assigned'
              }
            />

            <Detail
              label="Escalation count"
              value={
                complaint.escalationCount ?? 0
              }
            />
          </div>
        </section>

        {/* Management intervention */}
        <section className="mt-6 rounded-[2rem] border border-indigo-400/15 bg-[#0d1422] p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
                <Users size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Management intervention
                </h2>

                <p className="mt-2 text-slate-500">
                  Assign this escalated
                  complaint to an eligible
                  staff member.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadEligibleStaff}
              disabled={isStaffLoading}
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-slate-300 transition hover:border-indigo-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  isStaffLoading
                    ? 'animate-app-spin'
                    : ''
                }
              />

              Refresh staff
            </button>
          </div>

          {/* Current assignment */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#090f1b] p-5">
            <p className="text-sm text-slate-500">
              Current assigned staff
            </p>

            <div className="mt-3 flex items-center gap-3">
              <UserCheck
                size={20}
                className={
                  complaint.assignedToName
                    ? 'text-emerald-300'
                    : 'text-slate-500'
                }
              />

              <p className="font-semibold text-slate-200">
                {complaint.assignedToName ||
                  'No staff assigned yet'}
              </p>
            </div>
          </div>

          {/* Loading staff */}
          {isStaffLoading && (
            <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#090f1b] p-8 text-slate-400">
              <RefreshCw
                size={20}
                className="animate-app-spin text-indigo-300"
              />

              Loading eligible staff...
            </div>
          )}

          {/* Staff list */}
          {!isStaffLoading &&
            eligibleStaff.length > 0 && (
              <div className="mt-6">
                <p className="mb-4 text-sm font-medium text-slate-400">
                  Eligible staff from{' '}
                  {
                    complaint.responsibleDepartment
                  }
                </p>

                <div className="grid gap-3">
                  {eligibleStaff.map(
                    (staff) => {
                      const isSelected =
                        String(
                          selectedStaffId,
                        ) ===
                        String(staff.id)

                      const isCurrentlyAssigned =
                        String(
                          complaint.assignedToId,
                        ) ===
                        String(staff.id)

                      return (
                        <button
                          key={staff.id}
                          type="button"
                          onClick={() =>
                            setSelectedStaffId(
                              staff.id,
                            )
                          }
                          className={`w-full rounded-2xl border p-5 text-left transition ${
                            isSelected
                              ? 'border-indigo-400/60 bg-indigo-400/10'
                              : 'border-white/10 bg-[#090f1b] hover:border-indigo-400/30'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-200">
                                {
                                  staff.fullName
                                }
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {staff.email}
                              </p>

                              <p className="mt-2 text-sm text-indigo-300">
                                {
                                  staff.responsibleDepartment
                                }
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              {isCurrentlyAssigned && (
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                  Currently assigned
                                </span>
                              )}

                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                  isSelected
                                    ? 'border-indigo-300 bg-indigo-400'
                                    : 'border-slate-600'
                                }`}
                              >
                                {isSelected && (
                                  <CheckCircle2
                                    size={16}
                                    className="text-white"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    },
                  )}
                </div>
              </div>
            )}

          {/* No staff */}
          {!isStaffLoading &&
            eligibleStaff.length === 0 &&
            !staffErrorMessage && (
              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
                <p className="font-medium text-amber-300">
                  No eligible staff found
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  No active staff member is
                  currently registered for the{' '}
                  {
                    complaint.responsibleDepartment
                  }{' '}
                  department.
                </p>
              </div>
            )}

          {/* Error */}
          {staffErrorMessage && (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-rose-300">
              {staffErrorMessage}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-emerald-300">
              <CheckCircle2 size={20} />
              {successMessage}
            </div>
          )}

          {/* Assign button */}
          {eligibleStaff.length > 0 && (
            <button
              type="button"
              onClick={handleAssignStaff}
              disabled={
                !selectedStaffId ||
                isAssigning
              }
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isAssigning ? (
                <>
                  <RefreshCw
                    size={20}
                    className="animate-app-spin"
                  />
                  Assigning staff...
                </>
              ) : (
                <>
                  <UserCheck size={20} />
                  Assign selected staff
                </>
              )}
            </button>
          )}
        </section>
      </main>
    </div>
  )
}

const Detail = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#090f1b] p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-200">
        {value ?? 'Not available'}
      </p>
    </div>
  )
}

export default ManagementComplaintDetailsPage