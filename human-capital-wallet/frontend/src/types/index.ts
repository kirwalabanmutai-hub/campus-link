export type UserRole = 'user' | 'recruiter' | 'provider' | 'investor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  isVerified: boolean
  trustScore: number
  createdAt: string
}

export interface Profile {
  id: string
  userId: string
  bio?: string
  headline?: string
  location?: string
  website?: string
  skills: Skill[]
  education: Education[]
  experience: Experience[]
  certifications: Certification[]
  projects: Project[]
}

export interface Skill {
  id: string
  name: string
  category: string
  isVerified: boolean
  endorsements: number
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startYear: number
  endYear?: number
  current: boolean
}

export interface Experience {
  id: string
  company: string
  title: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialUrl?: string
  isVerified: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  url?: string
  imageUrl?: string
}

export interface Opportunity {
  id: string
  title: string
  description: string
  type: 'job' | 'internship' | 'scholarship' | 'grant' | 'competition' | 'tender' | 'gig'
  provider: string
  location?: string
  deadline?: string
  compensation?: string
  requirements: string[]
  tags: string[]
  isSaved: boolean
  hasApplied: boolean
  createdAt: string
}

export interface Review {
  id: string
  fromUserId: string
  fromUserName: string
  fromUserAvatar?: string
  rating: number
  comment: string
  serviceType?: string
  createdAt: string
}

export interface TrustScore {
  overall: number
  activityScore: number
  verificationScore: number
  reviewScore: number
  breakdown: { label: string; score: number; max: number }[]
}

export interface IncomeRecord {
  id: string
  amount: number
  source: string
  category: string
  date: string
  description?: string
  type: 'income' | 'expense'
}

export interface Investment {
  id: string
  name: string
  type: string
  amount: number
  currentValue: number
  roi: number
  riskLevel: 'low' | 'medium' | 'high'
  startDate: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'opportunity'
  isRead: boolean
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
