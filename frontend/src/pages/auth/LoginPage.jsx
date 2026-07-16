import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import { getApiErrorMessage } from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import { getHomeRouteForRole } from '../../routes/ProtectedRoute'

const LoginPage = () => {
  const { login } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [noticeMessage, setNoticeMessage] = useState('')

useEffect(() => {
  if (searchParams.get('session') === 'expired') {
    setNoticeMessage(
      'Your session has expired. Sign in again to continue.',
    )
    return
  }

  if (location.state?.registrationSuccess) {
    setNoticeMessage(location.state.registrationSuccess)

    if (location.state.registeredEmail) {
      setFormData((current) => ({
        ...current,
        email: location.state.registeredEmail,
      }))
    }
  }
}, [location.state, searchParams])

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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const email = formData.email.trim()
    const password = formData.password

    if (!email || !password) {
      setErrorMessage(
        'Enter both your email address and password.',
      )
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const authenticatedUser = await login({
        email,
        password,
      })

      const requestedPath = location.state?.from?.pathname

      const destination =
        requestedPath &&
        requestedPath !== '/login' &&
        requestedPath !== '/register'
          ? requestedPath
          : getHomeRouteForRole(authenticatedUser.role)

      navigate(destination, {
        replace: true,
      })
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          error?.message ||
            'Unable to sign in. Check your credentials and try again.',
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
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-cyan-400/8 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden min-h-screen flex-col justify-between border-r border-white/[0.07] p-10 lg:flex xl:p-14">
          <Link
            to="/"
            className="flex w-fit items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,.12)]">
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

          <div className="max-w-2xl py-16">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-500/[0.07] px-3.5 py-2 text-sm text-indigo-200">
              <Sparkles size={15} />
              Intelligent resolution starts here
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] text-white xl:text-6xl">
              Turn every complaint into a
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                {' '}
                clear path to resolution.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              ResolveOne intelligently analyzes, prioritizes,
              routes and tracks complaints so the right team can
              act before issues become escalations.
            </p>

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              {[
                {
                  icon: BrainCircuit,
                  title: 'AI analyzed',
                  text: 'Automatic classification',
                },
                {
                  icon: Workflow,
                  title: 'Smart routing',
                  text: 'Right team, instantly',
                },
                {
                  icon: ShieldCheck,
                  title: 'SLA aware',
                  text: 'Escalation built in',
                },
              ].map((feature) => {
                const Icon = feature.icon

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-sm"
                  >
                    <Icon
                      size={20}
                      className="mb-4 text-indigo-300"
                    />

                    <p className="text-sm font-medium text-slate-100">
                      {feature.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {feature.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 size={15} />
            Secure role-based access for students and teams
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[460px] animate-app-in">
            <div className="mb-9 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
                <Workflow
                  size={21}
                  className="text-indigo-300"
                />
              </div>

              <div>
                <p className="font-semibold text-white">
                  ResolveOne
                </p>
                <p className="text-xs text-slate-500">
                  Complaint intelligence platform
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-indigo-300">
                Welcome back
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Sign in to your workspace
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Access your complaints, assignments and resolution
                workflow.
              </p>
            </div>

            {noticeMessage && (
              <div
                role="status"
                className="mb-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.07] px-4 py-3.5 text-sm leading-6 text-amber-100"
              >
                {noticeMessage}
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-rose-400/15 bg-rose-400/[0.07] px-4 py-3.5 text-sm leading-6 text-rose-200"
              >
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >
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
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Enter your password"
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
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 font-medium text-white shadow-[0_14px_40px_rgba(99,102,241,.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(99,102,241,.3)] disabled:translate-y-0 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-app-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Continue to ResolveOne
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.07]" />
              <span className="text-xs uppercase tracking-[0.18em] text-slate-600">
                New to ResolveOne?
              </span>
              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            <Link
              to="/register"
              className="flex min-h-12 w-full items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.025] px-5 font-medium text-slate-200 hover:border-indigo-400/20 hover:bg-indigo-500/[0.06] hover:text-white"
            >
              Create a student account
            </Link>

            <p className="mt-8 text-center text-xs leading-5 text-slate-600">
              Authorized access only. Your activity is protected by
              secure role-based authentication.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginPage