import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDot,
  Clock3,
  FilePlus2,
  Inbox,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Sparkles,
  TimerReset,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { getApiErrorMessage } from '../../api/axiosInstance'
import { getMyComplaints } from '../../api/complaintApi'
import { useAuth } from '../../context/AuthContext'
import {
  formatEnumLabel,
  formatRelativeTime,
  getSlaState,
} from '../../utils/formatters'

const STATUS_STYLES = {
  OPEN:
    'border-sky-400/15 bg-sky-400/[0.08] text-sky-300',
  ASSIGNED:
    'border-violet-400/15 bg-violet-400/[0.08] text-violet-300',
  IN_PROGRESS:
    'border-amber-400/15 bg-amber-400/[0.08] text-amber-300',
  RESOLVED:
    'border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300',
  CLOSED:
    'border-slate-400/15 bg-slate-400/[0.08] text-slate-300',
  REJECTED:
    'border-rose-400/15 bg-rose-400/[0.08] text-rose-300',
  ESCALATED:
    'border-orange-400/15 bg-orange-400/[0.08] text-orange-300',
}

const PRIORITY_STYLES = {
  LOW: 'text-emerald-300',
  MEDIUM: 'text-sky-300',
  HIGH: 'text-amber-300',
  CRITICAL: 'text-rose-300',
}

const SLA_STYLES = {
  neutral: 'text-slate-500',
  normal: 'text-indigo-300',
  success: 'text-emerald-300',
  warning: 'text-amber-300',
  danger: 'text-rose-300',
}

const StudentDashboardPage = () => {
  const { user } = useAuth()

  const [complaints, setComplaints] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const loadComplaints = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setIsRefreshing(true)
        } else {
          setIsLoading(true)
        }

        setErrorMessage('')

        const response = await getMyComplaints()

        if (!response?.success) {
          throw new Error(
            response?.message ||
              'Unable to retrieve your complaints.',
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
              'Unable to load your complaints.',
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

    const active = complaints.filter(
      (complaint) =>
        ![
          'RESOLVED',
          'CLOSED',
          'REJECTED',
        ].includes(complaint.status),
    ).length

    const inProgress = complaints.filter(
      (complaint) =>
        complaint.status === 'IN_PROGRESS',
    ).length

    const resolved = complaints.filter(
      (complaint) =>
        complaint.status === 'RESOLVED' ||
        complaint.status === 'CLOSED',
    ).length

    const critical = complaints.filter(
      (complaint) =>
        complaint.priority === 'CRITICAL',
    ).length

    const escalated = complaints.filter(
      (complaint) =>
        complaint.status === 'ESCALATED' ||
        (complaint.escalationCount ?? 0) > 0,
    ).length

    const resolutionRate =
      total === 0
        ? 0
        : Math.round((resolved / total) * 100)

    return {
      total,
      active,
      inProgress,
      resolved,
      critical,
      escalated,
      resolutionRate,
    }
  }, [complaints])

  const recentComplaints = useMemo(
    () =>
      [...complaints]
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        )
        .slice(0, 5),
    [complaints],
  )

  const statCards = [
    {
      label: 'Total complaints',
      value: statistics.total,
      icon: Inbox,
      description: 'All issues you have reported',
    },
    {
      label: 'Active',
      value: statistics.active,
      icon: CircleDot,
      description: 'Currently awaiting resolution',
    },
    {
      label: 'In progress',
      value: statistics.inProgress,
      icon: Clock3,
      description: 'Being worked on by staff',
    },
    {
      label: 'Resolved',
      value: statistics.resolved,
      icon: CheckCircle2,
      description: `${statistics.resolutionRate}% resolution rate`,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.08]">
            <LoaderCircle className="animate-app-spin text-indigo-300" />
          </div>

          <p className="mt-4 font-medium text-slate-300">
            Loading your workspace
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Retrieving your latest complaints...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-app-in space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.11] via-violet-500/[0.05] to-transparent p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[80px]"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-300">
              <Sparkles size={16} />
              Your resolution workspace
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-400">
              Report campus issues, follow every update and see how
              ResolveOne intelligently routes your complaint to the
              right team.
            </p>
          </div>

          <Link
            to="/student/complaints/new"
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 font-medium text-white shadow-[0_14px_40px_rgba(99,102,241,.2)] hover:-translate-y-0.5"
          >
            <FilePlus2 size={18} />
            Create complaint
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {errorMessage && (
        <section className="flex flex-col gap-4 rounded-2xl border border-rose-400/15 bg-rose-400/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-rose-300"
            />

            <div>
              <p className="font-medium text-rose-200">
                We couldn't load your complaints
              </p>

              <p className="mt-1 text-sm text-rose-200/70">
                {errorMessage}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadComplaints()}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-rose-400/15 px-4 text-sm font-medium text-rose-200 hover:bg-rose-400/[0.08]"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <article
              key={card.label}
              className="app-card app-card-interactive p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">
                    {card.label}
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    {card.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/[0.07] text-indigo-300">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-600">
                {card.description}
              </p>
            </article>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]">
        <div className="app-card overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
            <div>
              <h3 className="font-semibold text-white">
                Recent complaints
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Your latest reported issues and their current status.
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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-slate-500 hover:border-indigo-400/20 hover:text-white disabled:opacity-50"
              aria-label="Refresh complaints"
            >
              <RefreshCw
                size={17}
                className={
                  isRefreshing
                    ? 'animate-app-spin'
                    : ''
                }
              />
            </button>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                <Inbox className="text-slate-600" />
              </div>

              <h4 className="mt-5 font-medium text-slate-200">
                No complaints yet
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                When you report an issue, its AI analysis, status and
                resolution progress will appear here.
              </p>

              <Link
                to="/student/complaints/new"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-400/15 bg-indigo-500/[0.08] px-4 text-sm font-medium text-indigo-200 hover:bg-indigo-500/[0.13]"
              >
                <FilePlus2 size={17} />
                Report your first issue
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {recentComplaints.map((complaint) => {
                const sla = getSlaState(
                  complaint.slaDeadline,
                  complaint.status,
                )

                return (
                  <Link
                    key={complaint.id}
                    to={`/student/complaints/${complaint.id}`}
                    className="group block px-5 py-5 hover:bg-white/[0.02] sm:px-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
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
                            className={`text-xs font-medium ${
                              PRIORITY_STYLES[
                                complaint.priority
                              ] || 'text-slate-500'
                            }`}
                          >
                            {formatEnumLabel(
                              complaint.priority,
                            )}{' '}
                            priority
                          </span>
                        </div>

                        <h4 className="mt-3 truncate font-medium text-slate-100 transition group-hover:text-indigo-200">
                          {complaint.title}
                        </h4>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} />
                            {complaint.building}
                            {complaint.location
                              ? ` · ${complaint.location}`
                              : ''}
                          </span>

                          <span>
                            {formatRelativeTime(
                              complaint.createdAt,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 lg:justify-end">
                        <div className="text-left lg:text-right">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-700">
                            SLA
                          </p>

                          <p
                            className={`mt-1 text-xs font-medium ${
                              SLA_STYLES[
                                sla.state
                              ] ||
                              SLA_STYLES.neutral
                            }`}
                          >
                            {sla.label}
                          </p>
                        </div>

                        <ArrowRight
                          size={17}
                          className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-indigo-300"
                        />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <article className="app-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.07]">
                <Bot
                  size={21}
                  className="text-violet-300"
                />
              </div>

              <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                AI active
              </span>
            </div>

            <h3 className="mt-5 font-semibold text-white">
              Intelligent routing
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Every new complaint is analyzed for category, priority
              and responsible department before entering the
              resolution workflow.
            </p>
          </article>

          <article className="app-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/[0.07]">
                <TrendingUp
                  size={19}
                  className="text-rose-300"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Critical issues
                </p>

                <p className="text-xl font-semibold text-white">
                  {statistics.critical}
                </p>
              </div>
            </div>

            <div className="my-5 h-px bg-white/[0.06]" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/[0.07]">
                <TimerReset
                  size={19}
                  className="text-amber-300"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Escalated issues
                </p>

                <p className="text-xl font-semibold text-white">
                  {statistics.escalated}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

export default StudentDashboardPage