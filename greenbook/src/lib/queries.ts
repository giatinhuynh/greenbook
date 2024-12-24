'use server'
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { db } from './db'
import { AuthorizationError, ValidationError } from './errors'
import { 
  Role, 
  User, 
  Client, 
  Project, 
  ProjectStatus, 
  ClientUser 
} from '@prisma/client'
import { 
  ProjectCreateInput, 
  ProjectWithClient, 
  ProjectWithDetails 
} from './types'

// User Operations
export const getAuthUserDetails = async () => {
  const user = await currentUser()
  if (!user) return null

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      clients: true,
      clientUsers: {
        include: {
          client: {
            include: {
              projects: true
            }
          }
        }
      }
    }
  })

  return userData
}

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser()
  if (!user) return null

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: {
      ...newUser,
      role: undefined 
    },
    create: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: 'USER',
    },
  })

  const clerk = await clerkClient()
  await clerk.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: 'USER',
    },
  })

  return userData
}

// Client Operations
export const createClient = async (client: Partial<Client>) => {
  const user = await currentUser()
  if (!user) return null

  if (!client.companyName || !client.companyEmail) {
    throw new ValidationError('Missing required fields')
  }

  const response = await db.$transaction(async (tx) => {
    const newClient = await tx.client.create({
      data: {
        companyName: client.companyName!,
        companyEmail: client.companyEmail!,
        companyLogo: client.companyLogo ?? null,
        companyPhone: client.companyPhone ?? null,
        address: client.address,
        city: client.city,
        state: client.state,
        country: client.country,
        createdById: user.id
      }
    })

    // Add creator as admin
    await tx.clientUser.create({
      data: {
        clientId: newClient.id,
        userId: user.id,
        role: 'ADMIN'
      }
    })

    return newClient
  })

  return response
}

export const updateClient = async (clientId: string, client: Partial<Client>) => {
  const user = await currentUser()
  if (!user) return null

  const hasAccess = await verifyClientAccess(clientId, user.id, ['ADMIN'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized')

  const response = await db.client.update({
    where: { id: clientId },
    data: client
  })
  return response
}

export const deleteClient = async (clientId: string) => {
  const user = await currentUser()
  if (!user) return null

  const hasAccess = await verifyClientAccess(clientId, user.id, ['ADMIN'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized')

  const response = await db.client.delete({
    where: { id: clientId }
  })
  return response
}

export const getClient = async (clientId: string) => {
  const user = await currentUser()
  if (!user) return null

  // First check if the client exists
  const client = await db.client.findUnique({
    where: { id: clientId },
    include: {
      projects: true,
      clientUsers: {
        include: {
          user: true
        }
      }
    }
  })

  if (!client) return null

  // Then check access
  const clientUser = await db.clientUser.findFirst({
    where: {
      clientId,
      userId: user.id,
    }
  })

  // Allow access if user is either:
  // 1. The creator of the client
  // 2. Has a clientUser association
  if (client.createdById !== user.id && !clientUser) {
    throw new AuthorizationError('Unauthorized')
  }

  return client
}

export const getClientProjects = async (
  clientId: string,
  page = 1,
  limit = 10
) => {
  const user = await currentUser()
  if (!user) return null

  const hasAccess = await verifyClientAccess(clientId, user.id, ['ADMIN', 'USER', 'GUEST'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized')

  const skip = (page - 1) * limit

  const [projects, total] = await Promise.all([
    db.project.findMany({
      where: { clientId },
      include: {
        client: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit
    }),
    db.project.count({
      where: { clientId }
    })
  ])

  return {
    projects,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit
    }
  }
}

// Project Operations
export const createProject = async (project: ProjectCreateInput) => {
  const user = await currentUser()
  if (!user) return null

  if (!project.name || !project.clientId) {
    throw new ValidationError('Missing required fields')
  }

  const hasAccess = await verifyClientAccess(project.clientId, user.id, ['ADMIN', 'USER'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized')

  const response = await db.project.create({
    data: {
      name: project.name,
      description: project.description,
      clientId: project.clientId,
      status: 'NOT_DEPLOYED',
      repositoryUrl: project.repositoryUrl,
      builderSpaceId: project.builderSpaceId,
      builderPublicKey: project.builderPublicKey
    },
    include: {
      client: true
    }
  })
  return response
}

export const updateProject = async (projectId: string, project: Partial<Project>) => {
  const user = await currentUser()
  if (!user) return null

  const currentProject = await db.project.findUnique({
    where: { id: projectId },
    select: { clientId: true }
  })
  if (!currentProject) throw new Error('Project not found')

  const hasAccess = await verifyClientAccess(currentProject.clientId, user.id, ['ADMIN', 'USER'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized')

  const response = await db.project.update({
    where: { id: projectId },
    data: project,
    include: {
      client: true
    }
  })
  return response
}

export const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
  const user = await currentUser()
  if (!user) return null

  const currentProject = await db.project.findUnique({
    where: { id: projectId },
    select: { clientId: true }
  })
  if (!currentProject) throw new Error('Project not found')

  const hasAccess = await verifyClientAccess(currentProject.clientId, user.id, ['ADMIN'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized: Only admins can update project status')

  const response = await db.project.update({
    where: { id: projectId },
    data: { status },
    include: {
      client: true
    }
  })
  return response
}

export const deleteProject = async (projectId: string) => {
  const user = await currentUser()
  if (!user) return null

  const currentProject = await db.project.findUnique({
    where: { id: projectId },
    select: { clientId: true }
  })
  if (!currentProject) throw new Error('Project not found')

  const hasAccess = await verifyClientAccess(currentProject.clientId, user.id, ['ADMIN'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized')

  const response = await db.project.delete({
    where: { id: projectId }
  })
  return response
}

export const getProject = async (projectId: string): Promise<ProjectWithDetails | null> => {
  const user = await currentUser()
  if (!user) return null

  const project = await db.project.findUnique({
    where: { id: projectId },
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
  })

  if (!project) throw new Error('Project not found')

  const hasAccess = await verifyClientAccess(project.clientId, user.id, ['ADMIN', 'USER', 'GUEST'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized')

  return project
}

export const getProjects = async (filters?: {
  status?: ProjectStatus
  clientId?: string
  search?: string
  page?: number
  limit?: number
}) => {
  const user = await currentUser()
  if (!user) return null

  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const skip = (page - 1) * limit

  // Get all clients user has access to
  const accessibleClients = await db.clientUser.findMany({
    where: {
      userId: user.id
    },
    select: {
      clientId: true
    }
  })

  const clientIds = accessibleClients.map(c => c.clientId)

  const [projects, total] = await Promise.all([
    db.project.findMany({
      where: {
        AND: [
          { clientId: { in: clientIds } },
          filters?.status ? { status: filters.status } : {},
          filters?.clientId ? { clientId: filters.clientId } : {},
          filters?.search ? {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { description: { contains: filters.search, mode: 'insensitive' } }
            ]
          } : {}
        ]
      },
      include: {
        client: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit
    }),
    db.project.count({
      where: {
        AND: [
          { clientId: { in: clientIds } },
          filters?.status ? { status: filters.status } : {},
          filters?.clientId ? { clientId: filters.clientId } : {},
          filters?.search ? {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { description: { contains: filters.search, mode: 'insensitive' } }
            ]
          } : {}
        ]
      }
    })
  ])

  return {
    projects,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit
    }
  }
}

// Access Control
export const addUserToClient = async (clientId: string, userEmail: string, role: Role = 'GUEST') => {
  const user = await currentUser()
  if (!user) return null

  const hasAccess = await verifyClientAccess(clientId, user.id, ['ADMIN'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized')

  const targetUser = await db.user.findUnique({
    where: { email: userEmail }
  })
  if (!targetUser) throw new Error('User not found')

  const response = await db.clientUser.create({
    data: {
      clientId,
      userId: targetUser.id,
      role
    },
    include: {
      user: true,
      client: true
    }
  })
  return response
}

export const removeUserFromClient = async (clientId: string, userId: string) => {
  const user = await currentUser()
  if (!user) return null

  const hasAccess = await verifyClientAccess(clientId, user.id, ['ADMIN'])
  if (!hasAccess) throw new AuthorizationError('Unauthorized')

  const response = await db.clientUser.delete({
    where: {
      clientId_userId: {
        clientId,
        userId
      }
    }
  })
  return response
}

// Helper Functions
async function verifyClientAccess(
  clientId: string, 
  userId: string, 
  allowedRoles: Role[]
): Promise<boolean> {
  const clientUser = await db.clientUser.findFirst({
    where: {
      clientId,
      userId,
      role: {
        in: allowedRoles
      }
    }
  })
  return !!clientUser
}
