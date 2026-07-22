import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../../components/dashboard/StatCard'
import {
  AlertTriangle,
  Bell,
  Building2,
  Clock3,
  RefreshCw,
  ShieldCheck,
  Siren,
} from 'lucide-react'

import { getEscalatedComplaints } from '../../api/managementApi'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import {
  formatDateTime,
  formatEnumLabel,
  formatRelativeTime,
} from '../../utils/formatters'

const ManagementDashboardPage = () => {
  const { user } = useAuth()
    const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadComplaints = useCallback(async () => {
    try {
      setErrorMessage('')

      const apiResponse = await getEscalatedComplaints()
      const complaintData = apiResponse?.data

      setComplaints(
        Array.isArray(complaintData) ? complaintData : [],
      )
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'We could not load escalated complaints.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadComplaints()
  }, [loadComplaints])

  const statistics = useMemo(() => {
    const total = complaints.length

    const critical = complaints.filter(
      (complaint) => complaint.priority === 'CRITICAL',
    ).length

    const unresolved = complaints.filter(
      (complaint) =>
        complaint.status !== 'RESOLVED' &&
        complaint.status !== 'CLOSED',
    ).length

    const repeatedEscalations = complaints.filter(
      (complaint) =>
        (complaint.escalationCount ?? 0) > 1,
    ).length

    return {
      total,
      critical,
      unresolved,
      repeatedEscalations,
    }
  }, [complaints])

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070b14]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Management workspace
            </p>

            <h1 className="mt-1 text-2xl font-semibold">
              Escalation command center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-slate-400"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-4 py-3 text-sm font-semibold text-amber-200">
              <ShieldCheck size={18} />
              {formatEnumLabel(user?.role)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-indigo-400/15 bg-gradient-to-br from-indigo-500/[0.13] via-[#10152b] to-[#0c1220] p-8 shadow-2xl shadow-black/20 lg:p-12">
          <div className="flex max-w-4xl flex-col gap-6">
            <div className="flex items-center gap-3 text-indigo-300">
              <Siren size={22} />

              <span className="font-semibold">
                Institutional oversight
              </span>
            </div>

            <div>
              <h2 className="text-4xl font-semibold tracking-tight lg:text-5xl">
                Welcome back, {user?.name || 'Management'}.
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                Monitor complaints that have crossed their resolution
                SLA and require management attention.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-4 py-2 text-sm font-semibold text-amber-300">
                Escalation monitoring active
              </div>

              <div className="rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-4 py-2 text-sm font-semibold text-indigo-300">
                Automated SLA tracking
              </div>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-rose-400/25 bg-rose-400/[0.08] p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="mt-0.5 text-rose-300"
                size={22}
              />

              <div>
                <p className="font-semibold text-rose-200">
                  We couldn't load escalated complaints
                </p>

                <p className="mt-1 text-sm text-rose-200/70">
                  {errorMessage}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadComplaints}
              className="flex items-center gap-2 rounded-xl border border-rose-300/20 px-4 py-2 text-sm font-semibold text-rose-200"
            >
              <RefreshCw size={17} />
              Try again
            </button>
          </div>
        )}

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Escalated complaints"
            value={statistics.total}
            description="Complaints requiring oversight"
            icon={<Siren size={24} />}
          />

          <StatCard
            label="Unresolved"
            value={statistics.unresolved}
            description="Still awaiting resolution"
            icon={<Clock3 size={24} />}
          />

          <StatCard
            label="Critical priority"
            value={statistics.critical}
            description="Highest-priority escalations"
            icon={<AlertTriangle size={24} />}
          />

          <StatCard
            label="Repeated escalation"
            value={statistics.repeatedEscalations}
            description="Escalated more than once"
            icon={<Building2 size={24} />}
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1422]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Escalated complaint queue
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Complaints automatically surfaced after SLA breach.
              </p>
            </div>

            <button
              type="button"
              onClick={loadComplaints}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.04] disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={
                  isLoading ? 'animate-app-spin' : ''
                }
              />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="flex min-h-80 items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  size={30}
                  className="mx-auto animate-app-spin text-indigo-300"
                />

                <p className="mt-4 text-slate-400">
                  Loading escalated complaints...
                </p>
              </div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center p-8">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300">
                  <ShieldCheck size={28} />
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  No escalated complaints
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  There are currently no SLA-breached complaints
                  requiring management attention.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {complaints.map((complaint) => (
                <article
                  key={complaint.id}
                  onClick={() =>
                    navigate(
                      `/management/complaints/${complaint.id}`,
                    )
                  }
                  className="cursor-pointer p-6 transition hover:bg-white/[0.02]"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge
                          value={complaint.status}
                        />

                        <PriorityBadge
                          value={complaint.priority}
                        />

                        <span className="rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-3 py-1 text-xs font-semibold text-amber-300">
                          Escalated ×
                          {complaint.escalationCount ?? 1}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold text-slate-100">
                        {complaint.title}
                      </h3>

                      <p className="mt-3 line-clamp-2 max-w-3xl leading-7 text-slate-400">
                        {complaint.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                        <span>
                          {formatEnumLabel(
                            complaint.responsibleDepartment,
                          )}
                        </span>

                        <span>
                          Reported by{' '}
                          {complaint.createdByName ||
                            'Unknown student'}
                        </span>

                        <span>
                          {formatRelativeTime(
                            complaint.createdAt,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#090f1b] p-5 lg:min-w-64">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
                        Escalated
                      </p>

                      <p className="mt-2 font-semibold text-amber-300">
                        {formatDateTime(
                          complaint.escalatedAt,
                        )}
                      </p>

                      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-600">
                        Assigned staff
                      </p>

                      <p className="mt-2 font-semibold text-slate-300">
                        {complaint.assignedToName ||
                          'Not assigned'}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}



const StatusBadge = ({ value }) => {
  return (
    <span className="rounded-full border border-sky-400/20 bg-sky-400/[0.08] px-3 py-1 text-xs font-semibold text-sky-300">
      {formatEnumLabel(value)}
    </span>
  )
}

const PriorityBadge = ({ value }) => {
  const priorityClass =
    value === 'CRITICAL'
      ? 'border-rose-400/20 bg-rose-400/[0.08] text-rose-300'
      : value === 'HIGH'
        ? 'border-amber-400/20 bg-amber-400/[0.08] text-amber-300'
        : 'border-indigo-400/20 bg-indigo-400/[0.08] text-indigo-300'

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityClass}`}
    >
      {formatEnumLabel(value)} priority
    </span>
  )
}

export default ManagementDashboardPage