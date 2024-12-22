import BlurPage from '@/components/global/blur-page'
import SubaccountFunnelChart from '@/components/global/subaccount-funnel-chart'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { db } from '@/lib/db'
import { Contact2 } from 'lucide-react'
import React from 'react'

type Props = {
  params: { subaccountId: string }
  searchParams: {
    code: string
  }
}

const SubaccountPageId = async ({ params, searchParams }: Props) => {
  const { subaccountId } = await params // Ensure params is awaited

  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  })

  if (!subaccountDetails) return null // Return null or a fallback UI if subaccountDetails is not found

  return (
    <BlurPage>
      <div className="relative h-full">
        <div className="flex flex-col gap-4 pb-6">
          <div className="flex gap-4 flex-col xl:!flex-row">
          </div>
        </div>
      </div>
    </BlurPage>
  )
}

export default SubaccountPageId
