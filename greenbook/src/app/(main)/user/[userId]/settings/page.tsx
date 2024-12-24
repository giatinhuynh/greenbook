import UserDetails from '@/components/forms/user-details'
import BlurPage from '@/components/global/blur-page'
import { getAuthUserDetails } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: { userId: string }
}

const UserSettingsPage = async ({ params }: Props) => {
  const authUser = await currentUser()
  if (!authUser) return redirect('/')

  const userDetails = await getAuthUserDetails()
  if (!userDetails) return null

  // Get all clients for user access management
  const allClients = [
    ...userDetails.clients,
    ...userDetails.clientUsers.map(cu => cu.client)
  ].reduce((unique, client) => {
    const exists = unique.find(u => u.id === client.id)
    if (!exists) {
      unique.push(client)
    }
    return unique
  }, [] as any[])

  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <UserDetails
          userData={userDetails}
          clients={allClients} id={null}/>
      </div>
    </BlurPage>
  )
}

export default UserSettingsPage