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

  const funnels = await db.funnel.findMany({
    where: {
      subAccountId: subaccountId,
    },
    include: {
      FunnelPages: true,
    },
  })

  const funnelPerformanceMetrics = funnels.map((funnel) => ({
    ...funnel,
    totalFunnelVisits: funnel.FunnelPages.reduce(
      (total, page) => total + page.visits,
      0
    ),
  }))

  return (
    <BlurPage>
      <div className="relative h-full">
        <div className="flex flex-col gap-4 pb-6">
          <div className="flex gap-4 flex-col xl:!flex-row">
            <Card className="relative">
              <CardHeader>
                <CardDescription>Funnel Performance</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground flex flex-col gap-8 justify-between">
                <SubaccountFunnelChart data={funnelPerformanceMetrics} />
                <div className="lg:w-[300px]">
                  Total page visits across all funnels. Hover over to get more
                  details on funnel page performance.
                </div>
              </CardContent>
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
          </div>
        </div>
      </div>
    </BlurPage>
  )
}

export default SubaccountPageId
