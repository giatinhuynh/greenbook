import BlurPage from '@/components/global/blur-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getClient } from '@/lib/queries'
import { Contact2, FolderGit2, Users2 } from 'lucide-react'
import React from 'react'

type Props = {
  params: { clientId: string }
}

const ClientPage = async ({ params }: Props) => {
  const { clientId } = params
  
  const clientDetails = await getClient(clientId)
  if (!clientDetails) return null

  const stats = [
    {
      title: 'Total Projects',
      value: clientDetails.projects.length,
      icon: FolderGit2,
      description: 'Active projects under this client'
    },
    {
      title: 'Team Members', 
      value: clientDetails.clientUsers.length,
      icon: Users2,
      description: 'Users with access to this client'
    }
  ]

  return (
    <BlurPage>
      <div className="relative h-full">
        <div className="flex flex-col gap-4 pb-6">
          <div className="flex gap-4 flex-col xl:!flex-row">
            {stats.map((stat, index) => (
              <Card key={index} className="flex-1 relative">
                <CardHeader>
                  <CardDescription>{stat.title}</CardDescription>
                  <CardTitle className="text-4xl">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {stat.description}
                </CardContent>
                <stat.icon className="absolute right-4 top-4 text-muted-foreground" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </BlurPage>
  )
}

export default ClientPage