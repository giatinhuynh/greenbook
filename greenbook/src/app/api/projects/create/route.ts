// app/api/projects/create/route.ts
import { NextResponse } from 'next/server'
import { ProjectAutomationService } from '@/services/project-automation'
import { createProject } from '@/lib/queries'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, description, clientId } = await req.json()
    const automationService = new ProjectAutomationService()

    // 1. Create GitHub repository
    const repoUrl = await automationService.createGithubRepository(name)

    // 2. Create Builder.io space
    const { spaceId, publicKey } = await automationService.createBuilderSpace(name)

    // 3. Create project in database with both values
    const project = await createProject({
      name,
      description,
      clientId,
      repositoryUrl: repoUrl,
      builderSpaceId: spaceId,
      builderPublicKey: publicKey
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Project creation error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}