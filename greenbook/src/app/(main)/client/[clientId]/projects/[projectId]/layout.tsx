import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import { getAuthUserDetails, getProject } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: { projectId: string }
}

const ProjectLayout = async ({ children, params }: Props) => {
  const { projectId } = params
  const user = await currentUser()
  
  if (!user) {
    return redirect('/')
  }

  const userDetails = await getAuthUserDetails()
  if (!userDetails) {
    return <Unauthorized />
  }

  // Check if user has access to this project through client access
  const clientAccess = userDetails.clientUsers.find(
    cu => cu.client.projects.some(p => p.id === projectId)
  )

  if (!clientAccess) {
    return <Unauthorized />
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar
        id={projectId}
        type="project"
        clients={userDetails.clientUsers}
      />
      <div className="md:pl-[300px]">
        <InfoBar
          role={clientAccess.role as Role}
          clientId={clientAccess.client.id}
        />
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ProjectLayout
