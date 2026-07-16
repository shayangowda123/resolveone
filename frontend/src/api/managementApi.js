import axiosInstance from './axiosInstance'

export const getEscalatedComplaints = async () => {
  const response = await axiosInstance.get(
    '/api/v1/management/complaints/escalated',
  )

  return response.data
}

export const getManagementComplaintById = async (
  complaintId,
) => {
  const response = await axiosInstance.get(
    `/api/v1/management/complaints/${complaintId}`,
  )

  return response.data
}

export const getEligibleStaff = async (
  complaintId,
) => {
  const response = await axiosInstance.get(
    `/api/v1/management/complaints/${complaintId}/eligible-staff`,
  )

  return response.data
}

export const assignComplaintToStaff = async (
  complaintId,
  staffId,
) => {
  const response = await axiosInstance.patch(
    `/api/v1/management/complaints/${complaintId}/assign/${staffId}`,
  )

  return response.data
}