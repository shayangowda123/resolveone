import axiosInstance from './axiosInstance'

export const createStaff = async (staffData) => {
  const response = await axiosInstance.post(
    '/api/v1/admin/staff',
    staffData,
  )

  return response.data
}

export const getEligibleStaff = async (complaintId) => {
  const response = await axiosInstance.get(
    `/api/v1/admin/complaints/${complaintId}/eligible-staff`,
  )

  return response.data
}