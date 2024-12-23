import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import { getAuthUserDetails, getClient } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: { clientId: string }
}

const ClientLayout = async ({ children, params }: Props) => {
  const { clientId } = params
  const user = await currentUser()
  
  if (!user) {
    return redirect('/')
  }

  // Get user details including client access
  const userDetails = await getAuthUserDetails()
  if (!userDetails) {
    return <Unauthorized />
  }

  // Check if user has access to this client
  const clientAccess = userDetails.clientUsers.find(
    (cu: { client: { id: string } }) => cu.client.id === clientId
  )

  if (!clientAccess) {
    return <Unauthorized />
  }

  // Get full client details
  const clientDetails = await getClient(clientId)
  if (!clientDetails) {
    return <Unauthorized />
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar
        id={clientId}
        type="client"
        clients={userDetails.clientUsers}
      />
      <div className="md:pl-[300px]">
        <InfoBar
          role={clientAccess.role as Role}
          clientId={clientId} 
        />
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ClientLayout