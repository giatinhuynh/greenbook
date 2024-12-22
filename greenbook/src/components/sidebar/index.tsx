import { getAuthUserDetails } from '@/lib/queries'
import React from 'react'
import MenuOptions from './menu-options'
import { Client, ClientUser } from '@prisma/client'

type Props = {
  id: string
  type: 'user' | 'client'
  clients?: Array<{
    client: Client & { projects: any[] }
    role: string
  }>
}

const Sidebar = async ({ id, type, clients }: Props) => {
  const user = await getAuthUserDetails()
  if (!user) return null
  // Get details based on type
  const details = type === 'user' 
    ? user 
    : clients?.find(c => c.client.id === id)?.client
  if (!details) return null
  // Set sidebar logo
  const sideBarLogo = type === 'user'
    ? user.avatarUrl || '/assets/default-avatar.svg'
    : 'companyLogo' in details || '/assets/default-company.svg'
  // Define sidebar options based on type and role
  const sidebarOpt = type === 'user'
    ? [
        { id: '1', name: 'Dashboard', icon: 'dashboard', link: `/user/${id}` },
        { id: '2', name: 'All Clients', icon: 'clients', link: `/user/${id}/all-clients` },
        { id: '3', name: 'Settings', icon: 'settings', link: `/user/${id}/settings` }
      ]
    : [
        { id: '1', name: 'Overview', icon: 'dashboard', link: `/client/${id}` },
        { id: '2', name: 'Projects', icon: 'folder', link: `/client/${id}/projects` },
        { id: '3', name: 'Team', icon: 'users', link: `/client/${id}/team` },
        { id: '4', name: 'Settings', icon: 'settings', link: `/client/${id}/settings` }
      ]
  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={typeof sideBarLogo === 'string' ? sideBarLogo : '/assets/default-company.svg'}
        sidebarOpt={sidebarOpt}
        clients={clients || []}
        user={user}
      />
    </>
  )
}

export default Sidebar