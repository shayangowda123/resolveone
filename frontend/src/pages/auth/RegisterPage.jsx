import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  Hash,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
  Workflow,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { registerStudent } from '../../api/authApi'
import { getApiErrorMessage } from '../../api/axiosInstance'

const DEPARTMENTS = [
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'ISE', label: 'Information Science & Engineering' },
  { value: 'AIML', label: 'Artificial Intelligence & Machine Learning' },
  { value: 'AIDS', label: 'Artificial Intelligence & Data Science' },
  { value: 'ECE', label: 'Electronics & Communication Engineering' },
  { value: 'EEE', label: 'Electrical & Electronics Engineering' },
  { value: 'ME', label: 'Mechanical Engineering' },
  { value: 'CIVIL', label: 'Civil Engineering' },
  { value: 'MBA', label: 'Master of Business Administration' },
  { value: 'MCA', label: 'Master of Computer Applications' },
]

const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F']

const RegisterPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    collegeId: '',
    email: '',
    password: '',
    department: '',
    section: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const validateForm = () => {
    const fullName = formData.fullName.trim()
    const collegeId = formData.collegeId.trim()
    const email = formData.email.trim()

    if (
      !fullName ||
      !collegeId ||
      !email ||
      !formData.password ||
      !formData.department ||
      !formData.section
    ) {
      return 'Complete all required fields to create your account.'
    }

    if (formData.password.length < 8) {
      return 'Password must contain at least 8 characters.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const response = await registerStudent({
        fullName: formData.fullName.trim(),
        collegeId: formData.collegeId.trim(),
        email: formData.email.trim(),
        password: formData.password,
        department: formData.department,
        section: formData.section,
      })

      if (!response?.success) {
        throw new Error(
          response?.message || 'Registration failed. Please try again.',
        )
      }

      navigate('/login', {
        replace: true,
        state: {
          registrationSuccess:
            response?.message || 'Your account was created successfully.',
          registeredEmail: formData.email.trim(),
        },
      })
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          error?.message ||
            'Unable to create your account. Please try again.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-indigo-500/10 blur-[130px]" />
        <div className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-violet-500/[0.08] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[0.88fr_1.12fr]">
        <section className="hidden min-h-screen flex-col justify-between border-r border-white/[0.07] p-10 lg:flex xl:p-14">
          <Link
            to="/login"
            className="flex w-fit items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
              <Workflow
                size={23}
                className="text-indigo-300"
              />
            </div>

            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-white">
                ResolveOne
              </p>
              <p className="text-xs text-slate-500">
                AI-powered complaint intelligence
              </p>
            </div>
          </Link>

          <div className="max-w-xl py-14">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-500/[0.07] px-3.5 py-2 text-sm text-indigo-200">
              <Sparkles size={15} />
              Your voice, intelligently routed
            </div>

            <h1 className="text-5xl font-semibold leading-[1.06] tracking-[-0.055em] text-white xl:text-6xl">
              Report an issue.
              <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                Track real action.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">
              Create your student account and get a transparent path
              from complaint submission to resolution.
            </p>

            <div className="mt-10 space-y-4">
              {[
                'AI-powered complaint classification and priority detection',
                'Automatic routing to the responsible department',
                'Live status, assignment and SLA visibility',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-slate-300"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-300"
                    />
                  </div>

                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Built for faster accountability and clearer resolution.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-2xl animate-app-in">
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
                  <Workflow
                    size={21}
                    className="text-indigo-300"
                  />
                </div>

                <p className="font-semibold text-white">
                  ResolveOne
                </p>
              </div>

              <Link
                to="/login"
                className="ml-auto inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-indigo-300">
                Student registration
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Create your ResolveOne account
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Use your academic details to create a secure student
                workspace.
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-rose-400/15 bg-rose-400/[0.07] px-4 py-3.5 text-sm leading-6 text-rose-200"
              >
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
              noValidate
            >
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Enter your full name"
                    className="app-input pl-11"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="collegeId"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  College ID
                </label>

                <div className="relative">
                  <Hash
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="collegeId"
                    name="collegeId"
                    type="text"
                    value={formData.collegeId}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g. 1RV22CS001"
                    className="app-input pl-11"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="you@college.edu"
                    className="app-input pl-11"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Department
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="app-input appearance-none pl-11 pr-11"
                  >
                    <option value="">
                      Select department
                    </option>

                    {DEPARTMENTS.map((department) => (
                      <option
                        key={department.value}
                        value={department.value}
                      >
                        {department.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="section"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Section
                </label>

                <div className="relative">
                  <GraduationCap
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <select
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="app-input appearance-none pl-11 pr-11"
                  >
                    <option value="">
                      Select section
                    </option>

                    {SECTIONS.map((section) => (
                      <option
                        key={section}
                        value={section}
                      >
                        Section {section}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Minimum 8 characters"
                    className="app-input px-11"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={isSubmitting}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-600">
                  Use at least 8 characters.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-1 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 font-medium text-white shadow-[0_14px_40px_rgba(99,102,241,.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(99,102,241,.3)] disabled:translate-y-0 disabled:opacity-60 sm:col-span-2"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-app-spin"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create student account
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-300 hover:text-indigo-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default RegisterPage