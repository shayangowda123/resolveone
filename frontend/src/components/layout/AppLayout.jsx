import { useEffect, useState } from 'react'
import {
  Bell,
  ChevronRight,
  CircleUserRound,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldCheck,
  Workflow,
  X,
} from 'lucide-react'
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

const NAVIGATION_BY_ROLE = {
  STUDENT: [
    {
      label: 'Dashboard',
      path: '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'New complaint',
      path: '/student/complaints/new',
      icon: FilePlus2,
    },
  ],

  STAFF: [
    {
      label: 'Dashboard',
      path: '/staff/dashboard',
      icon: LayoutDashboard,
    },
  ],

  HOD: [
    {
      label: 'Dashboard',
      path: '/management/dashboard',
      icon: LayoutDashboard,
    },
  ],

  DEAN: [
    {
      label: 'Dashboard',
      path: '/management/dashboard',
      icon: LayoutDashboard,
    },
  ],

  PRINCIPAL: [
    {
      label: 'Dashboard',
      path: '/management/dashboard',
      icon: LayoutDashboard,
    },
  ],

  ADMIN: [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
  ],
}

const PAGE_TITLES = {
  '/student/dashboard': {
    eyebrow: 'Student workspace',
    title: 'Complaint overview',
  },
  '/student/complaints/new': {
    eyebrow: 'Student workspace',
    title: 'Create complaint',
  },
  '/staff/dashboard': {
    eyebrow: 'Staff workspace',
    title: 'Department complaints',
  },
  '/management/dashboard': {
    eyebrow: 'Management workspace',
    title: 'Escalation overview',
  },
  '/admin/dashboard': {
    eyebrow: 'Administration',
    title: 'System overview',
  },

  '/staff/dashboard': {
    eyebrow: 'Staff workspace',
    title: 'Resolution dashboard',
  },

  '/staff/complaints': {
    eyebrow: 'Staff workspace',
    title: 'Complaint details',
  },
}

const getInitials = (name) => {
  if (!name) {
    return 'U'
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

const AppLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false)

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false)

  const navigation =
    NAVIGATION_BY_ROLE[user?.role] || []

  const pageInformation =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith('/student/complaints/')
      ? {
          eyebrow: 'Student workspace',
          title: 'Complaint details',
        }
      : {
          eyebrow: 'ResolveOne',
          title: 'Workspace',
        })

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login', {
      replace: true,
    })
  }

  const sidebarContent = (
    <>
      <div
        className={`flex h-20 items-center border-b border-white/[0.07] ${
          sidebarCollapsed
            ? 'justify-center px-3'
            : 'justify-between px-5'
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 shadow-[0_0_28px_rgba(99,102,241,.12)]">
            <Workflow
              size={21}
              className="text-indigo-300"
            />
          </div>

          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate font-semibold tracking-[-0.025em] text-white">
                ResolveOne
              </p>

              <p className="truncate text-xs text-slate-600">
                Complaint intelligence
              </p>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {!sidebarCollapsed && (
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Workspace
          </p>
        )}

        <div className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={
                  sidebarCollapsed
                    ? item.label
                    : undefined
                }
                className={({ isActive }) =>
                  `group flex min-h-11 items-center rounded-xl transition ${
                    sidebarCollapsed
                      ? 'justify-center px-2'
                      : 'gap-3 px-3.5'
                  } ${
                    isActive
                      ? 'border border-indigo-400/15 bg-indigo-500/10 text-indigo-200'
                      : 'border border-transparent text-slate-500 hover:bg-white/[0.035] hover:text-slate-200'
                  }`
                }
              >
                <Icon
                  size={19}
                  className="shrink-0"
                />

                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>

                    <ChevronRight
                      size={15}
                      className="opacity-0 transition group-hover:opacity-70"
                    />
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-white/[0.07] p-3">
        <div
          className={`rounded-2xl border border-white/[0.06] bg-white/[0.025] ${
            sidebarCollapsed
              ? 'p-2'
              : 'p-3'
          }`}
        >
          <div
            className={`flex items-center ${
              sidebarCollapsed
                ? 'justify-center'
                : 'gap-3'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
              {getInitials(user?.name)}
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">
                  {user?.name}
                </p>

                <p className="truncate text-xs text-slate-600">
                  {user?.email}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title={
              sidebarCollapsed
                ? 'Sign out'
                : undefined
            }
            className={`mt-3 flex min-h-10 w-full items-center rounded-xl text-sm text-slate-500 hover:bg-rose-400/[0.07] hover:text-rose-300 ${
              sidebarCollapsed
                ? 'justify-center'
                : 'gap-2.5 px-3'
            }`}
          >
            <LogOut size={17} />

            {!sidebarCollapsed && (
              <span>Sign out</span>
            )}
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/4 top-0 h-[28rem] w-[28rem] rounded-full bg-indigo-500/[0.055] blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-400/[0.035] blur-[140px]" />
      </div>

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() =>
            setMobileSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex border-r border-white/[0.07] bg-[#090e19]/95 backdrop-blur-2xl transition-[width,transform] duration-300 ${
          sidebarCollapsed
            ? 'w-[78px]'
            : 'w-[270px]'
        } ${
          mobileSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex w-full flex-col">
          {sidebarContent}
        </div>
      </aside>

      <div
        className={`relative min-h-screen transition-[padding] duration-300 ${
          sidebarCollapsed
            ? 'lg:pl-[78px]'
            : 'lg:pl-[270px]'
        }`}
      >
        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-white/[0.07] bg-[#070b14]/80 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() =>
              setMobileSidebarOpen(true)
            }
            className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-400 hover:text-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <button
            type="button"
            onClick={() =>
              setSidebarCollapsed(
                (current) => !current,
              )
            }
            className="mr-5 hidden h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 hover:border-indigo-400/20 hover:text-white lg:flex"
            aria-label={
              sidebarCollapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-indigo-300/70">
              {pageInformation.eyebrow}
            </p>

            <h1 className="mt-1 truncate text-lg font-semibold tracking-[-0.025em] text-white sm:text-xl">
              {pageInformation.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden xl:block">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="search"
                placeholder="Search workspace"
                className="h-10 w-56 rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-700 focus:border-indigo-400/30"
              />
            </div>

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            <div className="hidden h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 sm:flex">
              <ShieldCheck
                size={16}
                className="text-emerald-400"
              />

              <span className="text-xs font-medium text-slate-400">
                {user?.role}
              </span>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white sm:hidden">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        <main className="relative mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout