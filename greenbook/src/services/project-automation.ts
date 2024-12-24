import { Octokit } from '@octokit/rest'
import { BuilderAdminService } from './builder-admin'

export class ProjectAutomationService {
  private octokit: Octokit
  private builderAdmin: BuilderAdminService
  private currentRepoUrl: string | null = null

  constructor() {
    if (!process.env.GITHUB_ACCESS_TOKEN) {
      throw new Error('GITHUB_ACCESS_TOKEN is required')
    }

    this.octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN
    })
    this.builderAdmin = new BuilderAdminService()
  }

  async createGithubRepository(projectName: string): Promise<string> {
    try {
      let repoName = `greenbook-${projectName.toLowerCase().replace(/\s+/g, '-')}`
      let attempt = 0
      let created = false
      let repo

      while (!created && attempt < 5) {
        try {
          const response = await this.octokit.repos.createForAuthenticatedUser({
            name: attempt === 0 ? repoName : `${repoName}-${attempt}`,
            private: true,
            auto_init: true
          })
          repo = response.data
          created = true
        } catch (error: any) {
          if (error.status === 422 && error.response?.data?.errors?.[0]?.message === 'name already exists on this account') {
            attempt++
          } else {
            throw error
          }
        }
      }

      if (!created || !repo) {
        throw new Error('Failed to create repository after multiple attempts')
      }

      // Wait a moment for the repository to be fully initialized
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Clone boilerplate content
      const { data: boilerplateContent } = await this.octokit.repos.getContent({
        owner: process.env.GITHUB_ORG!,
        repo: 'nextjs-boilerplate',
        path: ''
      })

      // Copy boilerplate files to new repo
      if (Array.isArray(boilerplateContent)) {
        for (const file of boilerplateContent) {
          try {
            // Get the file content from the template repository
            const { data: fileData } = await this.octokit.repos.getContent({
              owner: process.env.GITHUB_ORG!,
              repo: 'nextjs-boilerplate',
              path: file.path
            })

            // Get the content if it exists in the target repository
            let sha: string | undefined
            try {
              const { data: existingFile } = await this.octokit.repos.getContent({
                owner: repo.owner.login,
                repo: repo.name,
                path: file.path
              })
              if ('sha' in existingFile) {
                sha = existingFile.sha
              }
            } catch (error) {
              // File doesn't exist yet, which is fine
            }

            // Create or update the file
            await this.octokit.repos.createOrUpdateFileContents({
              owner: repo.owner.login,
              repo: repo.name,
              path: file.path,
              message: 'Initial commit from boilerplate',
              content: typeof fileData === 'object' && 'content' in fileData ? fileData.content : '',
              sha: sha
            })
          } catch (error) {
            console.error(`Error copying file ${file.path}:`, error)
            // Continue with other files even if one fails
          }
        }
      }

      return repo.html_url
    } catch (error) {
      console.error('GitHub repository creation error:', error)
      throw new Error('Failed to create GitHub repository')
    }
  }

  async createBuilderSpace(projectName: string): Promise<{ spaceId: string, publicKey: string }> {
    const { spaceId, publicKey } = await this.builderAdmin.createSpaceFromTemplate(projectName)
    
    // If repository URL exists, integrate Builder.io config
    if (this.currentRepoUrl) {
      await this.integrateBuilderWithRepo(this.currentRepoUrl, publicKey)
    }
    
    return { spaceId, publicKey }
  }

  async integrateBuilderWithRepo(repoUrl: string, builderPublicKey: string) {
    try {
      const [owner, repo] = repoUrl.split('/').slice(-2)

      const envContent = `
# Builder.io configuration
BUILDER_PRIVATE_KEY=${process.env.BUILDER_PRIVATE_KEY}
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=${builderPublicKey}
      `.trim()

      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: '.env',
        message: 'Add Builder.io configuration',
        content: Buffer.from(envContent).toString('base64')
      })
    } catch (error) {
      console.error('Builder.io integration error:', error)
      throw new Error('Failed to integrate Builder.io with repository')
    }
  }
}