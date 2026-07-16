import axiosInstance from './axiosInstance'

export const getDepartmentComplaints = async () => {
  const response = await axiosInstance.get(
    '/api/v1/staff/complaints',
  )

  return response.data
}

export const assignComplaintToSelf = async (complaintId) => {
  const response = await axiosInstance.patch(
    `/api/v1/staff/complaints/${complaintId}/assign`,
  )

  return response.data
}

export const startComplaintProgress = async (complaintId) => {
  const response = await axiosInstance.patch(
    `/api/v1/staff/complaints/${complaintId}/start`,
  )

  return response.data
}

export const resolveComplaint = async (complaintId) => {
  const response = await axiosInstance.patch(
    `/api/v1/staff/complaints/${complaintId}/resolve`,
  )

  return response.data
}

export const escalateComplaint = async (complaintId) => {
  const response = await axiosInstance.patch(
    `/api/v1/staff/complaints/${complaintId}/escalate`,
  )

  return response.data
}