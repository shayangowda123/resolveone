import axiosInstance from './axiosInstance'

export const createComplaint = async (complaintData) => {
  const response = await axiosInstance.post(
    '/api/v1/complaints',
    complaintData,
  )

  return response.data
}

export const getMyComplaints = async () => {
  const response = await axiosInstance.get(
    '/api/v1/complaints/my',
  )

  return response.data
}

export const getComplaintById = async (complaintId) => {
  const response = await axiosInstance.get(
    `/api/v1/complaints/${complaintId}`,
  )

  return response.data
}

export const getAllComplaints = async () => {
  const response = await axiosInstance.get(
    '/api/v1/complaints',
  )

  return response.data
}