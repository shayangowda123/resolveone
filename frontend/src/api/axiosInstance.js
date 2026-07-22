import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://resolveone-5ay8.onrender.com'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resolveone_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('resolveone_token')
      localStorage.removeItem('resolveone_user')

      const currentPath = window.location.pathname

      if (
        currentPath !== '/login' &&
        currentPath !== '/register'
      ) {
        window.location.replace('/login?session=expired')
      }
    }

    return Promise.reject(error)
  },
)

export const getApiErrorMessage = (
  error,
  fallbackMessage = 'Something went wrong. Please try again.',
) => {
  const responseData = error?.response?.data

  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message
  }

  if (typeof responseData?.error === 'string' && responseData.error.trim()) {
    return responseData.error
  }

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData
  }

  if (error?.code === 'ECONNABORTED') {
    return 'The request took too long. Please try again.'
  }

  if (!error?.response) {
    return 'Unable to connect to ResolveOne. Please check your connection and try again.'
  }

  return fallbackMessage
}

export default axiosInstance