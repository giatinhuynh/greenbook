import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { updateProject } from '@/lib/queries'
import { ProjectAutomationService } from '@/services/project-automation'

export async function PATCH(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { builderPublicKey } = await req.json()
    
    // 1. Update project in database
    const project = await updateProject(params.projectId, {
      builderPublicKey
    })

    // 2. Integrate Builder.io with repository
    if (project?.repositoryUrl) {
      const automationService = new ProjectAutomationService()
      await automationService.integrateBuilderWithRepo(
        project.repositoryUrl,
        builderPublicKey
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Builder key update error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}