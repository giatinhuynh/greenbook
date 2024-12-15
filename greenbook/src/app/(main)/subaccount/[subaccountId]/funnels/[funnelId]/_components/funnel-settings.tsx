import React from 'react'
import { Funnel } from '@prisma/client'
import { db } from '@/lib/db'
import FunnelForm from '@/components/forms/funnel-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface FunnelSettingsProps {
  subaccountId: string
  defaultData: Funnel
}

const FunnelSettings: React.FC<FunnelSettingsProps> = async ({
  subaccountId,
  defaultData,
}) => {
  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  })

  if (!subaccountDetails) return

  return (
    <div className="flex gap-4 flex-col xl:!flex-row">
      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Funnel Settings</CardTitle>
          <CardDescription>
            Configure your funnel settings and properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add your non-payment related funnel settings here */}
        </CardContent>
      </Card>

      <FunnelForm
        subAccountId={subaccountId}
        defaultData={defaultData}
      />
    </div>
  )
}

export default FunnelSettings