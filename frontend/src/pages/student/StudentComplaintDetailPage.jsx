import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Sparkles,
  TimerReset,
  UserRound,
  Workflow,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { getApiErrorMessage } from '../../api/axiosInstance'
import { getComplaintById } from '../../api/complaintApi'
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

const WORKFLOW_STEPS = [
  {
    key: 'OPEN',
    label: 'Submitted',
    description: 'Complaint received and analyzed',
  },
  {
    key: 'ASSIGNED',
    label: 'Assigned',
    description: 'Assigned to responsible staff',
  },
  {
    key: 'IN_PROGRESS',
    label: 'In progress',
    description: 'Resolution work has started',
  },
  {
    key: 'RESOLVED',
    label: 'Resolved',
    description: 'Complaint has been resolved',
  },
]

const STATUS_INDEX = {
  OPEN: 0,
  ESCALATED: 0,
  ASSIGNED: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  CLOSED: 3,
}

const InformationRow = ({
  label,
  value,
  valueClassName = 'text-slate-200',
}) => (
  <div className="flex flex-col gap-1 border-b border-white/[0.06] py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
    <span className="text-sm text-slate-500">
      {label}
    </span>

    <span
      className={`text-sm font-medium sm:max-w-[65%] sm:text-right ${valueClassName}`}
    >
      {value || 'Not available'}
    </span>
  </div>
)

const StudentComplaintDetailPage = () => {
  const { complaintId } = useParams()

  const [complaint, setComplaint] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
              'Unable to retrieve this complaint.',
          )
        }

        setComplaint(response.data)
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            error?.message ||
              'Unable to load this complaint.',
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

  const sla = useMemo(
    () =>
      getSlaState(
        complaint?.slaDeadline,
        complaint?.status,
      ),
    [complaint],
  )

  const currentWorkflowIndex =
    STATUS_INDEX[complaint?.status] ?? 0

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.08]">
            <LoaderCircle className="animate-app-spin text-indigo-300" />
          </div>

          <p className="mt-4 font-medium text-slate-300">
            Loading complaint details
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Retrieving the latest complaint status...
          </p>
        </div>
      </div>
    )
  }

  if (errorMessage && !complaint) {
    return (
      <div className="mx-auto max-w-3xl animate-app-in">
        <Link
          to="/student/dashboard"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 text-sm font-medium text-slate-400 hover:border-indigo-400/20 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mt-6 rounded-3xl border border-rose-400/15 bg-rose-400/[0.06] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/[0.08]">
            <AlertTriangle className="text-rose-300" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            Complaint could not be loaded
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => loadComplaint()}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-400/15 px-4 text-sm font-medium text-rose-200 hover:bg-rose-400/[0.08]"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl animate-app-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/student/dashboard"
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 text-sm font-medium text-slate-400 hover:border-indigo-400/20 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <button
          type="button"
          onClick={() =>
            loadComplaint({
              refresh: true,
            })
          }
          disabled={isRefreshing}
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-white/[0.07] px-4 text-sm font-medium text-slate-400 hover:border-indigo-400/20 hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={16}
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
        <div className="flex items-start gap-3 rounded-2xl border border-rose-400/15 bg-rose-400/[0.06] p-4">
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0 text-rose-300"
          />

          <p className="text-sm leading-6 text-rose-200">
            {errorMessage}
          </p>
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.11] via-violet-500/[0.05] to-transparent p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[90px]"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${
                STATUS_STYLES[complaint.status] ||
                STATUS_STYLES.OPEN
              }`}
            >
              {formatEnumLabel(complaint.status)}
            </span>

            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${
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

            {(complaint.escalationCount ?? 0) > 0 && (
              <span className="inline-flex rounded-full border border-orange-400/15 bg-orange-400/[0.08] px-3 py-1.5 text-xs font-semibold text-orange-300">
                Escalated
              </span>
            )}
          </div>

          <h2 className="mt-5 max-w-4xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
            {complaint.title}
          </h2>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              {complaint.building}
              {complaint.location
                ? ` · ${complaint.location}`
                : ''}
            </span>

            <span className="flex items-center gap-2">
              <CalendarClock size={16} />
              Submitted{' '}
              {formatDateTime(
                complaint.createdAt,
              )}
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)]">
        <div className="space-y-6">
          <section className="app-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
                <Workflow
                  size={20}
                  className="text-slate-300"
                />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Complaint description
                </h3>

                <p className="text-sm text-slate-600">
                  Information submitted with this complaint
                </p>
              </div>
            </div>

            <p className="mt-6 whitespace-pre-wrap leading-7 text-slate-300">
              {complaint.description}
            </p>
          </section>

          <section className="app-card overflow-hidden">
            <div className="border-b border-white/[0.07] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.07]">
                  <Bot
                    size={21}
                    className="text-violet-300"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">
                      AI analysis
                    </h3>

                    <Sparkles
                      size={15}
                      className="text-indigo-300"
                    />
                  </div>

                  <p className="text-sm text-slate-600">
                    Automated complaint intelligence
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <InformationRow
                label="Category"
                value={formatEnumLabel(
                  complaint.category,
                )}
              />

              <InformationRow
                label="Priority"
                value={formatEnumLabel(
                  complaint.priority,
                )}
              />

              <InformationRow
                label="Responsible department"
                value={formatEnumLabel(
                  complaint.responsibleDepartment,
                )}
              />

              <div className="border-t border-white/[0.06] pt-6">
                <p className="text-sm font-medium text-slate-300">
                  AI summary
                </p>

                <p className="mt-3 leading-7 text-slate-400">
                  {complaint.aiSummary ||
                    'No AI summary available.'}
                </p>
              </div>

              <div className="mt-6 border-t border-white/[0.06] pt-6">
                <p className="text-sm font-medium text-slate-300">
                  AI reasoning
                </p>

                <p className="mt-3 leading-7 text-slate-400">
                  {complaint.aiReason ||
                    complaint.aiReasoning ||
                    'No AI reasoning available.'}
                </p>
              </div>
            </div>
          </section>

          <section className="app-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/[0.07]">
                <Workflow
                  size={20}
                  className="text-indigo-300"
                />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Resolution progress
                </h3>

                <p className="text-sm text-slate-600">
                  Track the complaint through its lifecycle
                </p>
              </div>
            </div>

            <div className="mt-7">
              {WORKFLOW_STEPS.map(
                (step, index) => {
                  const completed =
                    index < currentWorkflowIndex

                  const current =
                    index === currentWorkflowIndex

                  return (
                    <div
                      key={step.key}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {index <
                        WORKFLOW_STEPS.length -
                          1 && (
                        <div
                          className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px ${
                            completed
                              ? 'bg-emerald-400/40'
                              : 'bg-white/[0.08]'
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                          completed
                            ? 'border-emerald-400/30 bg-emerald-400/[0.1] text-emerald-300'
                            : current
                              ? 'border-indigo-400/40 bg-indigo-500/[0.12] text-indigo-300'
                              : 'border-white/[0.08] bg-[#0c1220] text-slate-700'
                        }`}
                      >
                        {completed ? (
                          <Check size={15} />
                        ) : current ? (
                          <Circle
                            size={12}
                            fill="currentColor"
                          />
                        ) : (
                          <Circle size={12} />
                        )}
                      </div>

                      <div className="pt-1">
                        <p
                          className={`text-sm font-medium ${
                            completed
                              ? 'text-emerald-300'
                              : current
                                ? 'text-indigo-200'
                                : 'text-slate-600'
                          }`}
                        >
                          {step.label}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="app-card p-6">
            <div className="flex items-center gap-3">
              <Clock3
                size={21}
                className="text-indigo-300"
              />

              <h3 className="font-semibold text-white">
                SLA status
              </h3>
            </div>

            <p
              className={`mt-5 text-2xl font-semibold tracking-[-0.03em] ${
                SLA_STYLES[sla.state] ||
                SLA_STYLES.neutral
              }`}
            >
              {sla.label}
            </p>

            <InformationRow
              label="Deadline"
              value={formatDateTime(
                complaint.slaDeadline,
              )}
            />
          </section>

          <section className="app-card p-6">
            <div className="flex items-center gap-3">
              <UserRound
                size={21}
                className="text-violet-300"
              />

              <h3 className="font-semibold text-white">
                Assigned staff
              </h3>
            </div>

            <div className="mt-5">
              {complaint.assignedStaff ? (
                <p className="text-sm font-medium text-slate-200">
                  {complaint.assignedStaff.name ||
                    complaint.assignedStaff.fullName ||
                    'Assigned staff member'}
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-300">
                    Awaiting assignment
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The responsible department has not assigned a
                    staff member yet.
                  </p>
                </>
              )}
            </div>
          </section>

          <section className="app-card p-6">
            <div className="flex items-center gap-3">
              <TimerReset
                size={21}
                className={
                  (complaint.escalationCount ?? 0) > 0
                    ? 'text-orange-300'
                    : 'text-slate-500'
                }
              />

              <h3 className="font-semibold text-white">
                Escalation
              </h3>
            </div>

            {(complaint.escalationCount ?? 0) > 0 ? (
              <div className="mt-5">
                <p className="font-medium text-orange-300">
                  Complaint escalated
                </p>

                <InformationRow
                  label="Escalation count"
                  value={String(
                    complaint.escalationCount,
                  )}
                />

                <InformationRow
                  label="Last escalated"
                  value={formatDateTime(
                    complaint.escalatedAt,
                  )}
                />
              </div>
            ) : (
              <div className="mt-5 flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-300"
                />

                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Not escalated
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    This complaint has not required escalation.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="app-card p-6">
            <div className="flex items-center gap-3">
              <Building2
                size={21}
                className="text-sky-300"
              />

              <h3 className="font-semibold text-white">
                Location
              </h3>
            </div>

            <InformationRow
              label="Building"
              value={complaint.building}
            />

            <InformationRow
              label="Specific location"
              value={complaint.location}
            />
          </section>

          <section className="app-card p-6">
            <div className="flex items-center gap-3">
              <CalendarClock
                size={21}
                className="text-slate-400"
              />

              <h3 className="font-semibold text-white">
                Activity
              </h3>
            </div>

            <InformationRow
              label="Created"
              value={formatDateTime(
                complaint.createdAt,
              )}
            />

            <InformationRow
              label="Last updated"
              value={formatDateTime(
                complaint.updatedAt,
              )}
            />

            {complaint.resolvedAt && (
              <InformationRow
                label="Resolved"
                value={formatDateTime(
                  complaint.resolvedAt,
                )}
              />
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}

export default StudentComplaintDetailPage