import axios from 'axios'
import Cookies from 'js-cookie'
import type { ApiResponse, IncomeRecord } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

type IncomeRecordResponse = Omit<IncomeRecord, 'amount'> & { amount: number | string }

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = Cookies.get('hcw_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      Cookies.remove('hcw_token')
      if (typeof window !== 'undefined') {
        window.location.assign(new URL('/login', window.location.origin).toString())
      }
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register:       (data: object) => api.post('/auth/register', data),
  login:          (data: object) => api.post('/auth/login', data),
  me:             ()             => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data: object) => api.post('/auth/reset-password', data),
  verifyEmail:    (token: string) => api.get(`/auth/verify-email/${token}`),
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}

export const profileApi = {
  getMyProfile:       ()             => api.get('/profile/me'),
  getPublicProfile:   (id: string)   => api.get(`/profile/${id}`),
  updateProfile:      (data: object) => api.put('/profile', data),
  addSkill:           (data: object) => api.post('/profile/skills', data),
  deleteSkill:        (id: string)   => api.delete(`/profile/skills/${id}`),
  addEducation:       (data: object) => api.post('/profile/education', data),
  addExperience:      (data: object) => api.post('/profile/experience', data),
  addCertification:   (data: object) => api.post('/profile/certifications', data),
  addProject:         (data: object) => api.post('/profile/projects', data),
  uploadAvatar:       (file: FormData) => api.post('/profile/avatar', file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export const opportunityApi = {
  getAll:     (params?: object) => api.get('/opportunities', { params }),
  getById:    (id: string)       => api.get(`/opportunities/${id}`),
  save:       (id: string)       => api.post(`/opportunities/${id}/save`),
  unsave:     (id: string)       => api.delete(`/opportunities/${id}/save`),
  apply:      (id: string, data: object) => api.post(`/opportunities/${id}/apply`, data),
  getSaved:   ()                 => api.get('/opportunities/saved'),
  getApplied: ()                 => api.get('/opportunities/applied'),
}

export const careerApi = {
  getRecommendations: () => api.get('/ai/career-match'),
  getSkillGap:        () => api.get('/ai/skill-gap'),
  getRoadmap:         () => api.get('/ai/roadmap'),
  getResumeAdvice:    () => api.post('/ai/resume-advice'),
  getInterviewPrep:   (role: string) => api.post('/ai/interview-prep', { role }),
}

export const incomeApi = {
  getRecords:  (params?: { type?: IncomeRecord['type']; category?: string; limit?: number; page?: number }) =>
    api.get<ApiResponse<IncomeRecordResponse[]>>('/income', { params }),
  addRecord:   (data: Omit<IncomeRecord, 'id'>) =>
    api.post<ApiResponse<IncomeRecordResponse>>('/income', data),
  updateRecord:(id: string, data: object) => api.put(`/income/${id}`, data),
  deleteRecord:(id: string)      => api.delete(`/income/${id}`),
  getSummary:  ()                => api.get('/income/summary'),
  getReport:   (month: string)   => api.get(`/income/report/${month}`),
}

export const investmentApi = {
  getAll:     () => api.get('/investments'),
  getById:    (id: string) => api.get(`/investments/${id}`),
  add:        (data: object) => api.post('/investments', data),
  update:     (id: string, data: object) => api.put(`/investments/${id}`, data),
  delete:     (id: string) => api.delete(`/investments/${id}`),
  calcROI:    (data: object) => api.post('/investments/calculate-roi', data),
}

export const reputationApi = {
  getMyScore:   () => api.get('/reputation/me'),
  getUserScore: (id: string) => api.get(`/reputation/${id}`),
  getReviews:   (id: string) => api.get(`/reputation/${id}/reviews`),
  addReview:    (id: string, data: object) => api.post(`/reputation/${id}/reviews`, data),
}

export const notificationApi = {
  getAll:    () => api.get('/notifications'),
  markRead:  (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete:    (id: string) => api.delete(`/notifications/${id}`),
}

export const paymentApi = {
  subscribe:     (plan: string) => api.post('/payments/subscribe', { plan }),
  mpesaPay:      (data: object) => api.post('/payments/mpesa/stk', data),
  getHistory:    () => api.get('/payments/history'),
}

export const adminApi = {
  getStats:           () => api.get('/admin/stats'),
  getUsers:           (params?: object) => api.get('/admin/users', { params }),
  updateUserRole:     (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  suspendUser:        (id: string) => api.put(`/admin/users/${id}/suspend`),
  getOpportunities:   (params?: object) => api.get('/admin/opportunities', { params }),
  approveOpportunity: (id: string) => api.put(`/admin/opportunities/${id}/approve`),
  getPayments:        () => api.get('/admin/payments'),
  getReports:         () => api.get('/admin/reports'),
}

export default api
