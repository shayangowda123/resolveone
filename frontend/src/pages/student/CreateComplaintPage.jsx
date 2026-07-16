import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  FileText,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { createComplaint } from '../../api/complaintApi'
import { getApiErrorMessage } from '../../api/axiosInstance'

const MAX_TITLE_LENGTH = 150
const MAX_DESCRIPTION_LENGTH = 5000

const CreateComplaintPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    building: '',
    location: '',
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const titleLength = formData.title.length
  const descriptionLength = formData.description.length

  const isFormComplete = useMemo(
    () =>
      formData.title.trim().length >= 5 &&
      formData.description.trim().length >= 20 &&
      formData.building.trim().length > 0 &&
      formData.location.trim().length > 0,
    [formData],
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setFieldErrors((current) => ({
      ...current,
      [name]: '',
    }))

    setErrorMessage('')
  }

  const validateForm = () => {
    const errors = {}

    const title = formData.title.trim()
    const description = formData.description.trim()
    const building = formData.building.trim()
    const location = formData.location.trim()

    if (!title) {
      errors.title = 'Complaint title is required.'
    } else if (title.length < 5) {
      errors.title =
        'Complaint title must contain at least 5 characters.'
    } else if (title.length > MAX_TITLE_LENGTH) {
      errors.title =
        'Complaint title must not exceed 150 characters.'
    }

    if (!description) {
      errors.description =
        'Complaint description is required.'
    } else if (description.length < 20) {
      errors.description =
        'Please provide at least 20 characters so the issue can be analyzed accurately.'
    } else if (
      description.length > MAX_DESCRIPTION_LENGTH
    ) {
      errors.description =
        'Complaint description must not exceed 5000 characters.'
    }

    if (!building) {
      errors.building = 'Building is required.'
    } else if (building.length > 100) {
      errors.building =
        'Building must not exceed 100 characters.'
    }

    if (!location) {
      errors.location = 'Location is required.'
    } else if (location.length > 100) {
      errors.location =
        'Location must not exceed 100 characters.'
    }

    setFieldErrors(errors)

    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        building: formData.building.trim(),
        location: formData.location.trim(),
      }

      const response = await createComplaint(payload)

      if (!response?.success || !response?.data) {
        throw new Error(
          response?.message ||
            'The complaint could not be created.',
        )
      }

      const createdComplaint = response.data

      navigate('/student/dashboard', {
        replace: true,
        state: {
          successMessage:
            'Complaint submitted and analyzed successfully.',
          createdComplaintId: createdComplaint.id,
        },
      })
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          error?.message ||
            'Unable to create your complaint. Please try again.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-app-in">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            to="/student/dashboard"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 text-sm font-medium text-slate-400 transition hover:border-indigo-400/20 hover:bg-indigo-500/[0.06] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.11] via-violet-500/[0.05] to-transparent p-6 sm:p-8">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[90px]"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-300">
              <Sparkles size={16} />
              AI-assisted complaint submission
            </div>

            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
              Tell us what needs attention.
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-slate-400">
              Describe the issue clearly. ResolveOne will analyze the
              complaint, determine its category and priority, route it
              to the responsible department and calculate its SLA
              deadline.
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.65fr)]">
          <section className="app-card overflow-hidden">
            <div className="border-b border-white/[0.07] px-6 py-5">
              <h2 className="text-lg font-semibold text-white">
                Complaint details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide accurate information so the issue can be
                routed correctly.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
              noValidate
            >
              {errorMessage && (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-400/15 bg-rose-400/[0.06] p-4">
                  <AlertTriangle
                    size={20}
                    className="mt-0.5 shrink-0 text-rose-300"
                  />

                  <div>
                    <p className="font-medium text-rose-200">
                      Complaint could not be submitted
                    </p>

                    <p className="mt-1 text-sm leading-6 text-rose-200/70">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-300"
                  >
                    Complaint title
                  </label>

                  <span className="text-xs text-slate-600">
                    {titleLength}/{MAX_TITLE_LENGTH}
                  </span>
                </div>

                <div className="relative">
                  <FileText
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={MAX_TITLE_LENGTH}
                    placeholder="Example: WiFi is not working in the computer lab"
                    disabled={isSubmitting}
                    className={`min-h-14 w-full rounded-2xl border bg-[#080d18] py-3 pl-12 pr-4 text-slate-100 outline-none transition placeholder:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                      fieldErrors.title
                        ? 'border-rose-400/40 focus:border-rose-400/60'
                        : 'border-white/[0.08] focus:border-indigo-400/40'
                    }`}
                  />
                </div>

                {fieldErrors.title && (
                  <p className="mt-2 text-sm text-rose-300">
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-slate-300"
                  >
                    Describe the issue
                  </label>

                  <span className="text-xs text-slate-600">
                    {descriptionLength}/
                    {MAX_DESCRIPTION_LENGTH}
                  </span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  rows={8}
                  placeholder="Explain what happened, when you noticed it, how it is affecting students, and any other useful details..."
                  disabled={isSubmitting}
                  className={`w-full resize-y rounded-2xl border bg-[#080d18] px-4 py-4 leading-7 text-slate-100 outline-none transition placeholder:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                    fieldErrors.description
                      ? 'border-rose-400/40 focus:border-rose-400/60'
                      : 'border-white/[0.08] focus:border-indigo-400/40'
                  }`}
                />

                <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  {fieldErrors.description ? (
                    <p className="text-sm text-rose-300">
                      {fieldErrors.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-600">
                      Minimum 20 characters for accurate AI analysis.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="building"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Building
                  </label>

                  <div className="relative">
                    <Building2
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      id="building"
                      name="building"
                      type="text"
                      value={formData.building}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="Main Academic Block"
                      disabled={isSubmitting}
                      className={`min-h-14 w-full rounded-2xl border bg-[#080d18] py-3 pl-12 pr-4 text-slate-100 outline-none transition placeholder:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                        fieldErrors.building
                          ? 'border-rose-400/40 focus:border-rose-400/60'
                          : 'border-white/[0.08] focus:border-indigo-400/40'
                      }`}
                    />
                  </div>

                  {fieldErrors.building && (
                    <p className="mt-2 text-sm text-rose-300">
                      {fieldErrors.building}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Specific location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="3rd Floor · Computer Lab"
                      disabled={isSubmitting}
                      className={`min-h-14 w-full rounded-2xl border bg-[#080d18] py-3 pl-12 pr-4 text-slate-100 outline-none transition placeholder:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                        fieldErrors.location
                          ? 'border-rose-400/40 focus:border-rose-400/60'
                          : 'border-white/[0.08] focus:border-indigo-400/40'
                      }`}
                    />
                  </div>

                  {fieldErrors.location && (
                    <p className="mt-2 text-sm text-rose-300">
                      {fieldErrors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-400/10 bg-indigo-500/[0.05] p-4">
                <div className="flex items-start gap-3">
                  <Bot
                    size={20}
                    className="mt-0.5 shrink-0 text-indigo-300"
                  />

                  <div>
                    <p className="font-medium text-indigo-100">
                      What happens after submission?
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      ResolveOne analyzes your complaint for category,
                      urgency and responsible department before
                      calculating the resolution SLA.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/student/dashboard"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/[0.08] px-5 font-medium text-slate-400 transition hover:bg-white/[0.03] hover:text-white"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || !isFormComplete}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 font-medium text-white shadow-[0_14px_40px_rgba(99,102,241,.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-app-spin"
                      />
                      AI is analyzing your complaint...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze and submit
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <article className="app-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.07]">
                <Bot
                  size={22}
                  className="text-violet-300"
                />
              </div>

              <h3 className="mt-5 font-semibold text-white">
                AI-powered triage
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your description is used to determine the issue
                category, priority and team responsible for handling
                it.
              </p>

              <div className="mt-6 space-y-4">
                {[
                  'Complaint category',
                  'Priority level',
                  'Responsible department',
                  'AI summary and reasoning',
                  'SLA resolution deadline',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.06]">
                      <CheckCircle2
                        size={15}
                        className="text-emerald-300"
                      />
                    </div>

                    <span className="text-sm text-slate-400">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="app-card p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-300"
                />

                <div>
                  <h3 className="font-semibold text-white">
                    Submit accurate information
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Clear details help staff understand the issue and
                    improve the accuracy of automated routing.
                  </p>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050914]/80 px-5 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-indigo-400/15 bg-[#0c1220] p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.08]">
              <Bot
                size={28}
                className="text-indigo-300"
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              Analyzing your complaint
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              ResolveOne is determining the category, priority,
              responsible department and SLA deadline.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-indigo-300">
              <LoaderCircle
                size={18}
                className="animate-app-spin"
              />
              Processing with AI...
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateComplaintPage