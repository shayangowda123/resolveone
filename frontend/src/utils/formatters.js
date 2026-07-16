export const formatEnumLabel = (value) => {
  if (!value) {
    return 'Not available'
  }

  return value
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
}

export const formatDateTime = (value) => {
  if (!value) {
    return 'Not available'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const formatRelativeTime = (value) => {
  if (!value) {
    return 'Unknown time'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown time'
  }

  const differenceInSeconds = Math.round(
    (date.getTime() - Date.now()) / 1000,
  )

  const formatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
  })

  const ranges = [
    { limit: 60, divisor: 1, unit: 'second' },
    { limit: 3600, divisor: 60, unit: 'minute' },
    { limit: 86400, divisor: 3600, unit: 'hour' },
    { limit: 604800, divisor: 86400, unit: 'day' },
    { limit: 2629800, divisor: 604800, unit: 'week' },
    { limit: 31557600, divisor: 2629800, unit: 'month' },
    {
      limit: Number.POSITIVE_INFINITY,
      divisor: 31557600,
      unit: 'year',
    },
  ]

  const absoluteDifference = Math.abs(differenceInSeconds)
  const range = ranges.find(
    (item) => absoluteDifference < item.limit,
  )

  return formatter.format(
    Math.round(differenceInSeconds / range.divisor),
    range.unit,
  )
}

export const getSlaState = (slaDeadline, status) => {
  if (!slaDeadline) {
    return {
      label: 'No SLA deadline',
      state: 'neutral',
    }
  }

  if (status === 'RESOLVED' || status === 'CLOSED') {
    return {
      label: 'Completed',
      state: 'success',
    }
  }

  const deadline = new Date(slaDeadline)
  const now = new Date()

  if (Number.isNaN(deadline.getTime())) {
    return {
      label: 'SLA unavailable',
      state: 'neutral',
    }
  }

  const difference = deadline.getTime() - now.getTime()

  if (difference <= 0) {
    return {
      label: 'SLA overdue',
      state: 'danger',
    }
  }

  const hours = Math.floor(difference / (1000 * 60 * 60))
  const minutes = Math.floor(
    (difference % (1000 * 60 * 60)) / (1000 * 60),
  )

  if (hours < 1) {
    return {
      label: `${Math.max(minutes, 1)}m remaining`,
      state: 'danger',
    }
  }

  if (hours < 24) {
    return {
      label: `${hours}h ${minutes}m remaining`,
      state: hours <= 4 ? 'warning' : 'normal',
    }
  }

  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24

  return {
    label: `${days}d ${remainingHours}h remaining`,
    state: 'normal',
  }
}