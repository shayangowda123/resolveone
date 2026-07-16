import axiosInstance from './axiosInstance'

export const registerStudent = async (registrationData) => {
  const response = await axiosInstance.post(
    '/api/v1/auth/register',
    registrationData,
  )

  return response.data
}

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post(
    '/api/v1/auth/login',
    credentials,
  )

  return response.data
}