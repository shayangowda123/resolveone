import axiosInstance from './axiosInstance'

export const getEmployees = async () => {
  const response = await axiosInstance.get(
    '/api/v1/admin/employees',
  )

  return response.data
}

export const getEmployeeById = async (employeeId) => {
  const response = await axiosInstance.get(
    `/api/v1/admin/employees/${employeeId}`,
  )

  return response.data
}

export const createEmployee = async (employeeData) => {
  const response = await axiosInstance.post(
    '/api/v1/admin/employees',
    employeeData,
  )

  return response.data
}

export const updateEmployee = async (
  employeeId,
  employeeData,
) => {
  const response = await axiosInstance.put(
    `/api/v1/admin/employees/${employeeId}`,
    employeeData,
  )

  return response.data
}

export const disableEmployee = async (employeeId) => {
  const response = await axiosInstance.patch(
    `/api/v1/admin/employees/${employeeId}/disable`,
  )

  return response.data
}

export const enableEmployee = async (employeeId) => {
  const response = await axiosInstance.patch(
    `/api/v1/admin/employees/${employeeId}/enable`,
  )

  return response.data
}

export const resetEmployeePassword = async (
  employeeId,
  newPassword,
) => {
  const response = await axiosInstance.patch(
    `/api/v1/admin/employees/${employeeId}/reset-password`,
    {
      newPassword,
    },
  )

  return response.data
}