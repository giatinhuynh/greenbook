import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  params: { agencyId: string }
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { agencyId } = await params
  const user = await currentUser()
  if (!user) {
    redirect('/agency/sign-in')
  }

  const routeAgencyId = agencyId

  try {
    // Verify invitation and get agency ID
    const agencyId = await verifyAndAcceptInvitation()
    if (!agencyId) {
      redirect('/agency')
    }

    // Validate that the agency ID matches the route param
    if (agencyId !== routeAgencyId) {
      redirect('/agency')
    }

    // Check user role
    const userRole = user.privateMetadata.role as string
    if (userRole !== 'AGENCY_OWNER' && userRole !== 'AGENCY_ADMIN') {
      return <Unauthorized />
    }

    // Get notifications
    const notifications = await getNotificationAndUser(routeAgencyId)
    const allNotifications = notifications || []

    return (
      <main className="h-screen overflow-hidden">
        <Sidebar
          id={routeAgencyId}
          type="agency"
        />
        <div className="md:pl-[300px]">
          <InfoBar
            notifications={allNotifications}
            role={userRole}
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
    console.error('Error in agency layout:', error)
    redirect('/agency/sign-in')
  }
}

export default Layout