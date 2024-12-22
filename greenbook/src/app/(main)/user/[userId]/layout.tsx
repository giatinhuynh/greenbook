import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { getAuthUserDetails } from '@/lib/queries'

interface LayoutProps {
  children: React.ReactNode
  params: { userId: string }
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { userId } = params
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  try {
    const userData = await getAuthUserDetails()
    
    if (!userData) {
      redirect('/sign-in')
    }

    // Validate that the user ID matches the route param
    if (user.id !== userId) {
      return <Unauthorized />
    }

    // Get user's clients and their roles 
    const clientsWithAccess = userData.clientUsers.map((cu: any) => ({
      client: cu.client,
      role: cu.role
    }))

    return (
      <main className="h-screen overflow-hidden">
        <Sidebar
          id={userId}
          type="agency"
          clients={clientsWithAccess}
        />
        <div className="md:pl-[300px]">
          <InfoBar
            role={userData.role} 
          />
          <div className="relative">
            <BlurPage>
              {children}
            </BlurPage>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error in user layout:', error)
    redirect('/sign-in')
  }
}

export default Layout