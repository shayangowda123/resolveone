import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Building2,
  CheckCircle2,
  CircleDot,
  Clock3,
  LoaderCircle,
  MapPin,
  PlayCircle,
  RefreshCw,
  Sparkles,
  User,
  UserCheck,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { getApiErrorMessage } from '../../api/axiosInstance'
import { getComplaintById } from '../../api/complaintApi'
import {
  assignComplaintToSelf,
  resolveComplaint,
  startComplaintProgress,
} from '../../api/staffApi'
import { useAuth } from '../../context/AuthContext'
import {
  formatDateTime,
  formatEnumLabel,
  getSlaState,
} from '../../utils/formatters'

const STATUS_STYLES = {
  OPEN:
    'border-sky-400/15 bg-sky-400/[0.08] text-sky-300',
  ASSIGNED:
    'border-violet-400/15 bg-violet-400/[0.08] text-violet-300',
  IN_PROGRESS:
    'border-amber-400/15 bg-amber-400/[0.08] text-amber-300',
  ESCALATED:
    'border-orange-400/15 bg-orange-400/[0.08] text-orange-300',
  RESOLVED:
    'border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300',
  CLOSED:
    'border-slate-400/15 bg-slate-400/[0.08] text-slate-300',
}

const PRIORITY_STYLES = {
  LOW:
    'border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300',
  MEDIUM:
    'border-sky-400/15 bg-sky-400/[0.07] text-sky-300',
  HIGH:
    'border-amber-400/15 bg-amber-400/[0.07] text-amber-300',
  CRITICAL:
    'border-rose-400/15 bg-rose-400/[0.07] text-rose-300',
}

const SLA_STYLES = {
  neutral: 'text-slate-400',
  normal: 'text-indigo-300',
  success: 'text-emerald-300',
  warning: 'text-amber-300',
  danger: 'text-rose-300',
}

const StaffComplaintDetailsPage = () => {
  const { complaintId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [complaint, setComplaint] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] =
    useState(false)
  const [activeAction, setActiveAction] =
    useState(null)
  const [errorMessage, setErrorMessage] =
    useState('')
  const [actionMessage, setActionMessage] =
    useState('')

  const loadComplaint = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setIsRefreshing(true)
        } else {
          setIsLoading(true)
        }

        setErrorMessage('')

        const response =
          await getComplaintById(complaintId)

        if (!response?.success || !response?.data) {
          throw new Error(
            response?.message ||
              'Unable to retrieve complaint.',
          )
        }

        setComplaint(response.data)
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            error?.message ||
              'Unable to load complaint details.',
          ),
        )
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [complaintId],
  )

  useEffect(() => {
    loadComplaint()
  }, [loadComplaint])

  const runAction = async (
    actionName,
    actionFunction,
  ) => {
    try {
      setActiveAction(actionName)
      setErrorMessage('')
      setActionMessage('')

      const response =
        await actionFunction(complaint.id)

      if (!response?.success || !response?.data) {
        throw new Error(
          response?.message ||
            'Unable to update complaint.',
        )
      }

      setComplaint(response.data)
      setActionMessage(
        response.message ||
          'Complaint updated successfully.',
      )
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          error?.message ||
            'Unable to update complaint.',
        ),
      )
    } finally {
      setActiveAction(null)
    }
  }

  const sla = useMemo(
    () =>
      getSlaState(
        complaint?.slaDeadline,
        complaint?.status,
      ),
    [complaint],
  )

  const isAssignedToCurrentStaff =
    complaint?.assignedToId &&
    user?.id &&
    Number(complaint.assignedToId) ===
      Number(user.id)

  const isAssignedToAnotherStaff =
    complaint?.assignedToId &&
    !isAssignedToCurrentStaff

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto animate-app-spin text-indigo-300" />

          <p className="mt-4 font-medium text-slate-300">
            Loading complaint details
          </p>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="app-card p-8 text-center">
          <AlertTriangle className="mx-auto text-rose-300" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            Complaint unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {errorMessage ||
              'This complaint could not be loaded.'}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/staff/dashboard')
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.04]"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl animate-app-in space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() =>
            navigate('/staff/dashboard')
          }
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.04]"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        <button
          type="button"
          onClick={() =>
            loadComplaint({
              refresh: true,
            })
          }
          disabled={isRefreshing}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-3 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              isRefreshing
                ? 'animate-app-spin'
                : ''
            }
          />

          Refresh status
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-400/15 bg-rose-400/[0.06] p-5">
          <AlertTriangle
            size={21}
            className="mt-0.5 shrink-0 text-rose-300"
          />

          <div>
            <p className="font-semibold text-rose-200">
              Action could not be completed
            </p>

            <p className="mt-1 text-sm text-rose-200/70">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {actionMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5">
          <CheckCircle2
            size={21}
            className="mt-0.5 shrink-0 text-emerald-300"
          />

          <div>
            <p className="font-semibold text-emerald-200">
              Workflow updated
            </p>

            <p className="mt-1 text-sm text-emerald-200/70">
              {actionMessage}
            </p>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.11] via-violet-500/[0.05] to-transparent p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              STATUS_STYLES[complaint.status] ||
              STATUS_STYLES.OPEN
            }`}
          >
            {formatEnumLabel(complaint.status)}
          </span>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              PRIORITY_STYLES[
                complaint.priority
              ] ||
              'border-white/[0.08] text-slate-400'
            }`}
          >
            {formatEnumLabel(
              complaint.priority,
            )}{' '}
            priority
          </span>
        </div>

        <h1 className="mt-6 max-w-5xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
          {complaint.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <MapPin size={17} />

            {complaint.building}
            {complaint.location
              ? ` · ${complaint.location}`
              : ''}
          </span>

          <span className="flex items-center gap-2">
            <Clock3 size={17} />

            Submitted{' '}
            {formatDateTime(
              complaint.createdAt,
            )}
          </span>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[1fr_380px]">
        <div className="space-y-7">
          <div className="app-card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                <CircleDot
                  size={21}
                  className="text-slate-300"
                />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Complaint description
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Information submitted by the
                  student
                </p>
              </div>
            </div>

            <p className="mt-7 whitespace-pre-wrap text-base leading-8 text-slate-300">
              {complaint.description}
            </p>
          </div>

          <div className="app-card overflow-hidden">
            <div className="border-b border-white/[0.07] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.07]">
                  <Bot
                    size={22}
                    className="text-violet-300"
                  />
                </div>

                <div>
                  <h2 className="flex items-center gap-2 font-semibold text-white">
                    AI analysis
                    <Sparkles
                      size={17}
                      className="text-indigo-300"
                    />
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    Automated complaint
                    intelligence
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-600">
                    Category
                  </p>

                  <p className="mt-2 font-semibold text-slate-200">
                    {formatEnumLabel(
                      complaint.category,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">
                    Priority
                  </p>

                  <p className="mt-2 font-semibold text-slate-200">
                    {formatEnumLabel(
                      complaint.priority,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">
                    Responsible department
                  </p>

                  <p className="mt-2 font-semibold text-slate-200">
                    {formatEnumLabel(
                      complaint.responsibleDepartment,
                    )}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/[0.07] pt-6">
                <p className="font-semibold text-slate-300">
                  AI summary
                </p>

                <p className="mt-3 leading-7 text-slate-400">
                  {complaint.aiSummary ||
                    'No AI summary available.'}
                </p>
              </div>

              <div className="border-t border-white/[0.07] pt-6">
                <p className="font-semibold text-slate-300">
                  AI reasoning
                </p>

                <p className="mt-3 leading-7 text-slate-400">
                  {complaint.aiReason ||
                    'No AI reasoning available.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-7">
          <div className="app-card p-6">
            <h2 className="font-semibold text-white">
              Resolution workflow
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Move this complaint through its
              resolution lifecycle.
            </p>

            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-600">
                Current status
              </p>

              <p className="mt-2 text-lg font-semibold text-white">
                {formatEnumLabel(
                  complaint.status,
                )}
              </p>
            </div>

            <div className="mt-5">
              {complaint.status === 'OPEN' && (
                <button
                  type="button"
                  onClick={() =>
                    runAction(
                      'assign',
                      assignComplaintToSelf,
                    )
                  }
                  disabled={Boolean(activeAction)}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 font-semibold text-white shadow-lg shadow-indigo-500/10 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {activeAction === 'assign' ? (
                    <LoaderCircle
                      size={19}
                      className="animate-app-spin"
                    />
                  ) : (
                    <UserCheck size={19} />
                  )}

                  Assign to myself
                </button>
              )}

              {complaint.status ===
                'ASSIGNED' &&
                isAssignedToCurrentStaff && (
                  <button
                    type="button"
                    onClick={() =>
                      runAction(
                        'start',
                        startComplaintProgress,
                      )
                    }
                    disabled={Boolean(
                      activeAction,
                    )}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 font-semibold text-white hover:brightness-110 disabled:opacity-50"
                  >
                    {activeAction ===
                    'start' ? (
                      <LoaderCircle
                        size={19}
                        className="animate-app-spin"
                      />
                    ) : (
                      <PlayCircle size={19} />
                    )}

                    Start work
                  </button>
                )}

              {(complaint.status ===
                'IN_PROGRESS' ||
                complaint.status ===
                  'ESCALATED') &&
                isAssignedToCurrentStaff && (
                  <button
                    type="button"
                    onClick={() =>
                      runAction(
                        'resolve',
                        resolveComplaint,
                      )
                    }
                    disabled={Boolean(
                      activeAction,
                    )}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 font-semibold text-white hover:brightness-110 disabled:opacity-50"
                  >
                    {activeAction ===
                    'resolve' ? (
                      <LoaderCircle
                        size={19}
                        className="animate-app-spin"
                      />
                    ) : (
                      <CheckCircle2
                        size={19}
                      />
                    )}

                    Mark as resolved
                  </button>
                )}

              {isAssignedToAnotherStaff && (
                <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-4">
                  <p className="text-sm font-medium text-amber-200">
                    Assigned to another staff
                    member
                  </p>

                  <p className="mt-1 text-sm text-amber-200/60">
                    {complaint.assignedToName} is
                    currently responsible for this
                    complaint.
                  </p>
                </div>
              )}

              {(complaint.status ===
                'RESOLVED' ||
                complaint.status ===
                  'CLOSED') && (
                <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 size={18} />

                    <p className="font-semibold">
                      Complaint resolved
                    </p>
                  </div>

                  {complaint.resolvedAt && (
                    <p className="mt-2 text-sm text-emerald-200/60">
                      Completed{' '}
                      {formatDateTime(
                        complaint.resolvedAt,
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="app-card p-6">
            <div className="flex items-center gap-2">
              <Clock3
                size={19}
                className="text-indigo-300"
              />

              <h2 className="font-semibold text-white">
                SLA status
              </h2>
            </div>

            <p
              className={`mt-5 text-2xl font-semibold ${
                SLA_STYLES[sla.state] ||
                SLA_STYLES.neutral
              }`}
            >
              {sla.label}
            </p>

            <div className="mt-5 border-t border-white/[0.07] pt-5">
              <p className="text-sm text-slate-600">
                Resolution deadline
              </p>

              <p className="mt-2 font-medium text-slate-300">
                {formatDateTime(
                  complaint.slaDeadline,
                )}
              </p>
            </div>
          </div>

          <div className="app-card p-6">
            <div className="flex items-center gap-2">
              <User
                size={19}
                className="text-violet-300"
              />

              <h2 className="font-semibold text-white">
                Assignment
              </h2>
            </div>

            <div className="mt-5">
              {complaint.assignedToName ? (
                <>
                  <p className="font-semibold text-slate-200">
                    {complaint.assignedToName}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Assigned staff member
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-300">
                    Awaiting assignment
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    No staff member has taken
                    ownership yet.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="app-card p-6">
            <div className="flex items-center gap-2">
              <Building2
                size={19}
                className="text-sky-300"
              />

              <h2 className="font-semibold text-white">
                Location
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-slate-600">
                  Building
                </p>

                <p className="mt-1 font-medium text-slate-300">
                  {complaint.building ||
                    'Not available'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  Specific location
                </p>

                <p className="mt-1 font-medium text-slate-300">
                  {complaint.location ||
                    'Not available'}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default StaffComplaintDetailsPage