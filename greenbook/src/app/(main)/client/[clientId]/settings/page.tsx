import ClientDetails from '@/components/forms/client-details'
import UserDetails from '@/components/forms/user-details'
import BlurPage from '@/components/global/blur-page'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
  params: { clientId: string }
}

const ClientSettingPage = async ({ params }: Props) => {
  const { clientId } = params
  const authUser = await currentUser()
  if (!authUser) return null

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  })
  if (!userDetails) return null

  const client = await db.client.findUnique({
    where: { id: clientId },
  })
  if (!client) return null

  // Get all clients for user access management
  const allClients = await db.client.findMany()

  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <ClientDetails 
          details={client}
          user={userDetails}
        />
        <UserDetails
          id={clientId}
          userData={userDetails}
          clients={allClients}
        />
      </div>
    </BlurPage>
  )
}

export default ClientSettingPage
