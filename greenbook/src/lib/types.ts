import { Prisma, Role, Project, Client, User } from '@prisma/client'
import { z } from 'zod'
// Project Types
export type ProjectWithClient = Prisma.ProjectGetPayload<{
 include: {
   client: true
 }
}>

export type ProjectWithDetails = Prisma.ProjectGetPayload<{
 include: {
   client: {
     include: {
       clientUsers: {
         include: {
           user: true
         }
       }
     }
   }
 }
}>

export type ProjectCreateInput = {
 name: string
 description?: string
 clientId: string
 builderSpaceId?: string
 builderApiKey?: string
 repositoryUrl?: string
}

// Client Types
export type ClientWithProjects = Prisma.ClientGetPayload<{
 include: {
   projects: true
   clientUsers: {
     include: {
       user: true
     }
   }
 }
}>

// Validation Schemas
export const ProjectCreateSchema = z.object({
 name: z.string().min(1, 'Project name is required'),
 description: z.string().optional(),
 clientId: z.string().min(1, 'Client is required'),
 builderSpaceId: z.string().optional(),
 builderApiKey: z.string().optional(),
 repositoryUrl: z.string().optional()
})

export const ClientCreateSchema = z.object({
 name: z.string().min(1, 'Name is required'),
 companyName: z.string().min(1, 'Company name is required'),
 companyEmail: z.string().email('Invalid email address'),
 companyPhone: z.string().optional(),
 companyLogo: z.string().optional(),
 address: z.string().optional(),
 city: z.string().optional(),
 state: z.string().optional(),
 country: z.string().optional()
})

// Response Types
export type PaginatedResponse<T> = {
 data: T[]
 pagination: {
   total: number
   pages: number
   page: number
   limit: number
 }
}

// Error Types
export type ApiError = {
 message: string
 code: string
 details?: Record<string, unknown>
}
