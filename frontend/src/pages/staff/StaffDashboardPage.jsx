import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDot,
  Clock3,
  Inbox,
  LoaderCircle,
  MapPin,
  PlayCircle,
  RefreshCw,
  Sparkles,
  UserCheck,
  Workflow,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { getApiErrorMessage } from '../../api/axiosInstance'
import { getDepartmentComplaints } from '../../api/staffApi'
import { useAuth } from '../../context/AuthContext'
import {
  formatEnumLabel,
  formatRelativeTime,
  getSlaState,
} from '../../utils/formatters'
import { useNavigate } from 'react-router-dom'
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
  neutral: 'text-slate-500',
  normal: 'text-indigo-300',
  success: 'text-emerald-300',
  warning: 'text-amber-300',
  danger: 'text-rose-300',
}

const StatCard = ({
  label,
  value,
  description,
  icon: Icon,
}) => (
  <div className="app-card p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
          {value}
        </p>

        <p className="mt-4 text-xs leading-5 text-slate-600">
          {description}
        </p>
      </div>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/10 bg-indigo-500/[0.07]">
        <Icon
          size={22}
          className="text-indigo-300"
        />
      </div>
    </div>
  </div>
)

const StaffDashboardPage = () => {
  const { user } = useAuth()
    const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] =
    useState(false)
  const [errorMessage, setErrorMessage] =
    useState('')

  const loadComplaints = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setIsRefreshing(true)
        } else {
          setIsLoading(true)
        }

        setErrorMessage('')

        const response =
          await getDepartmentComplaints()

        if (!response?.success) {
          throw new Error(
            response?.message ||
              'Unable to retrieve department complaints.',
          )
        }

        setComplaints(
          Array.isArray(response.data)
            ? response.data
            : [],
        )
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            error?.message ||
              'Unable to load department complaints.',
          ),
        )
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [],
  )

  useEffect(() => {
    loadComplaints()
  }, [loadComplaints])

  const statistics = useMemo(() => {
    const total = complaints.length

    const open = complaints.filter(
      (complaint) =>
        complaint.status === 'OPEN',
    ).length

    const assigned = complaints.filter(
      (complaint) =>
        complaint.status === 'ASSIGNED',
    ).length

    const inProgress = complaints.filter(
      (complaint) =>
        complaint.status === 'IN_PROGRESS',
    ).length

    const escalated = complaints.filter(
      (complaint) =>
        complaint.status === 'ESCALATED',
    ).length

    const resolved = complaints.filter(
      (complaint) =>
        complaint.status === 'RESOLVED' ||
        complaint.status === 'CLOSED',
    ).length

    return {
      total,
      open,
      assigned,
      inProgress,
      escalated,
      resolved,
    }
  }, [complaints])

  const activeComplaints = useMemo(
    () =>
      complaints.filter(
        (complaint) =>
          complaint.status !== 'RESOLVED' &&
          complaint.status !== 'CLOSED' &&
          complaint.status !== 'REJECTED',
      ),
    [complaints],
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.08]">
            <LoaderCircle className="animate-app-spin text-indigo-300" />
          </div>

          <p className="mt-4 font-medium text-slate-300">
            Loading department workspace
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Retrieving complaints assigned to your
            department...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl animate-app-in space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.11] via-violet-500/[0.05] to-transparent p-7 sm:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[90px]"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
            <Workflow size={18} />
            Resolution operations
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
            Welcome back, {user?.name || 'staff member'}.
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
            Review complaints routed to your department,
            take ownership and move every issue through the
            resolution workflow.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-4 py-2 text-sm font-medium text-emerald-300">
              <UserCheck size={16} />
              Staff access active
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-400/[0.07] px-4 py-2 text-sm font-medium text-indigo-200">
              <Bot size={16} />
              AI-routed queue
            </span>
          </div>
        </div>
      </section>

      {errorMessage && (
        <div className="flex flex-col gap-4 rounded-2xl border border-rose-400/15 bg-rose-400/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={21}
              className="mt-0.5 shrink-0 text-rose-300"
            />

            <div>
              <p className="font-semibold text-rose-200">
                We couldn't load department complaints
              </p>

              <p className="mt-1 text-sm text-rose-200/70">
                {errorMessage}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadComplaints()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-400/20 px-4 text-sm font-medium text-rose-200 hover:bg-rose-400/[0.07]"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Department complaints"
          value={statistics.total}
          description="All complaints routed to your team"
          icon={Inbox}
        />

        <StatCard
          label="Open"
          value={statistics.open}
          description="Waiting for staff ownership"
          icon={CircleDot}
        />

        <StatCard
          label="In progress"
          value={statistics.inProgress}
          description="Currently being worked on"
          icon={PlayCircle}
        />

        <StatCard
          label="Resolved"
          value={statistics.resolved}
          description="Successfully completed complaints"
          icon={CheckCircle2}
        />
      </section>

      <section className="app-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Department complaint queue
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Complaints automatically routed to your
              responsible department.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadComplaints({
                refresh: true,
              })
            }
            disabled={isRefreshing}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-white/[0.07] px-4 text-sm font-medium text-slate-400 hover:border-indigo-400/20 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                isRefreshing
                  ? 'animate-app-spin'
                  : ''
              }
            />

            Refresh
          </button>
        </div>

        {activeComplaints.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <Inbox
                size={27}
                className="text-slate-600"
              />
            </div>

            <h4 className="mt-6 text-lg font-semibold text-slate-300">
              No active complaints
            </h4>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
              New complaints routed to your department will
              appear here automatically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {activeComplaints.map((complaint) => {
              const sla = getSlaState(
                complaint.slaDeadline,
                complaint.status,
              )

              return (
                <article
                  key={complaint.id}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate(
                      `/staff/complaints/${complaint.id}`,
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' ||
                      event.key === ' '
                    ) {
                      navigate(
                        `/staff/complaints/${complaint.id}`,
                      )
                    }
                  }}
                  className="group cursor-pointer p-6 transition-colors hover:bg-white/[0.025] sm:p-7"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            STATUS_STYLES[
                              complaint.status
                            ] ||
                            STATUS_STYLES.OPEN
                          }`}
                        >
                          {formatEnumLabel(
                            complaint.status,
                          )}
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

                        {complaint.status ===
                          'ESCALATED' && (
                          <span className="rounded-full border border-orange-400/15 bg-orange-400/[0.07] px-3 py-1 text-xs font-semibold text-orange-300">
                            Escalated
                          </span>
                        )}
                      </div>

                      <h4 className="mt-4 text-lg font-semibold text-slate-200">
                        {complaint.title}
                      </h4>

                      <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                        {complaint.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {complaint.building}
                          {complaint.location
                            ? ` · ${complaint.location}`
                            : ''}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Sparkles size={14} />
                          {formatEnumLabel(
                            complaint.category,
                          )}
                        </span>

                        <span>
                          Reported by{' '}
                          {complaint.createdByName ||
                            'Student'}
                        </span>

                        <span>
                          {formatRelativeTime(
                            complaint.createdAt,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-4 xl:min-w-[220px] xl:items-end">
                      <div className="xl:text-right">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-700">
                          SLA
                        </p>

                        <p
                          className={`mt-1 text-sm font-semibold ${
                            SLA_STYLES[sla.state] ||
                            SLA_STYLES.neutral
                          }`}
                        >
                          {sla.label}
                        </p>
                      </div>

                      {complaint.assignedToName && (
                        <p className="text-xs text-slate-500">
                          Assigned to{' '}
                          <span className="font-medium text-slate-300">
                            {complaint.assignedToName}
                          </span>
                        </p>
                      )}

                      <div className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300">
                        Open complaint
                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="app-card p-6">
          <p className="text-sm text-slate-500">
            Assigned
          </p>

          <p className="mt-2 text-2xl font-semibold text-violet-300">
            {statistics.assigned}
          </p>
        </div>

        <div className="app-card p-6">
          <p className="text-sm text-slate-500">
            Escalated
          </p>

          <p className="mt-2 text-2xl font-semibold text-orange-300">
            {statistics.escalated}
          </p>
        </div>

        <div className="app-card p-6">
          <div className="flex items-center gap-2">
            <Clock3
              size={17}
              className="text-indigo-300"
            />

            <p className="text-sm text-slate-500">
              Active workload
            </p>
          </div>

          <p className="mt-2 text-2xl font-semibold text-white">
            {activeComplaints.length}
          </p>
        </div>
      </section>
    </div>
  )
}

export default StaffDashboardPage