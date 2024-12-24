import { getAuthUserDetails } from '@/lib/queries'
import React from 'react'
import MenuOptions from './menu-options'
import { Client, ClientUser } from '@prisma/client'

type Props = {
  id: string
  type: 'user' | 'client' | 'project'
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
    : type === 'client'
    ? clients?.find(c => c.client.id === id)?.client
    : clients?.find(c => c.client.projects.some(p => p.id === id))?.client.projects.find(p => p.id === id)
  
  if (!details) return null

  // Set sidebar logo/title
  const sideBarContent = type === 'user'
    ? { type: 'text', content: 'GreenBook' }
    : type === 'client'
    ? { type: 'logo', content: (details as Client).companyLogo || '/assets/default-company.svg' }
    : { type: 'text', content: (details as any).name }

  // Define sidebar options based on type and role
  const sidebarOpt = type === 'user'
    ? [
        { id: '1', name: 'Dashboard', icon: 'home', link: `/user/${id}` },
        { id: '2', name: 'All Clients', icon: 'person', link: `/user/${id}/all-clients` },
        { id: '3', name: 'Settings', icon: 'settings', link: `/user/${id}/settings` }
      ]
    : type === 'client'
    ? [
        { id: '1', name: 'Overview', icon: 'home', link: `/client/${id}` },
        { id: '2', name: 'Projects', icon: 'star', link: `/client/${id}/projects` },
        { id: '3', name: 'Team', icon: 'person', link: `/client/${id}/team` },
        { id: '3', name: 'Settings', icon: 'settings', link: `/client/${id}/settings` }
      ]
    : [
        { id: '1', name: 'Overview', icon: 'home', link: `/project/${id}` },
        { id: '2', name: 'Builder', icon: 'info', link: `/project/${id}/builder` },
        { id: '3', name: 'Deploy', icon: 'power', link: `/project/${id}/deploy` },
        { id: '4', name: 'Settings', icon: 'settings', link: `/project/${id}/settings` }
      ]

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarContent={{
          type: sideBarContent.type as "text" | "logo",
          content: sideBarContent.content
        }}
        sidebarOpt={sidebarOpt}
        clients={clients || []}
        user={user}
      />
    </>
  )
}

export default Sidebar