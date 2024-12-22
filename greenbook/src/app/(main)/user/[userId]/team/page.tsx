import { db } from '@/lib/db'
import React from 'react'
import DataTable from './data-table'
import { Plus } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { columns } from './columns'
import SendInvitation from '@/components/forms/send-invitation'

type Props = {
  params: { agencyId: string }
}

const TeamPage = async ({ params }: Props) => {
  // Await all async operations in parallel for better performance
  const [authUser, agencyId] = await Promise.all([
    currentUser(),
    Promise.resolve(params.agencyId), // Explicitly await the param
  ])

  if (!authUser) return null

  // Now use the awaited agencyId in your queries
  const [teamMembers, agencyDetails] = await Promise.all([
    db.user.findMany({
      where: {
        Agency: {
          id: agencyId,
        },
      },
      include: {
        Agency: { include: { SubAccount: true } },
        Permissions: { include: { SubAccount: true } },
      },
    }),
    db.agency.findUnique({
      where: {
        id: agencyId,
      },
      include: {
        SubAccount: true,
      },
    }),
  ])

  if (!agencyDetails) return null

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    />
  )
}

export default TeamPage