import { GraphQLClient } from 'graphql-request'
import axios from 'axios'

export class BuilderAdminService {
  private client: GraphQLClient
  private templateSpaceId: string
  private privateKey: string

  constructor() {
    if (!process.env.BUILDER_PRIVATE_KEY) {
      throw new Error('BUILDER_PRIVATE_KEY is required')
    }
    if (!process.env.BUILDER_TEMPLATE_SPACE_ID) {
      throw new Error('BUILDER_TEMPLATE_SPACE_ID is required')
    }

    this.privateKey = process.env.BUILDER_PRIVATE_KEY
    this.client = new GraphQLClient('https://cdn.builder.io/api/v2/admin', {
      headers: {
        Authorization: `Bearer ${this.privateKey}`,
      },
    })
    this.templateSpaceId = process.env.BUILDER_TEMPLATE_SPACE_ID
  }

  private async getSpacePublicKey(spaceId: string): Promise<string> {
    try {
      // Try to get space details
      const response = await axios.get(`https://api.builder.io/v1/spaces/${spaceId}`, {
        headers: {
          Authorization: `Bearer ${this.privateKey}`
        }
      })
      
      // Check if we have API keys in the response
      const apiKeys = response.data?.apiKeys || []
      const publicKey = apiKeys.find((key: any) => key.type === 'public')?.token

      return publicKey || ''
    } catch (error) {
      console.error('Failed to get space public key:', error)
      return '' // Return empty string if we can't get the key
    }
  }

  async createSpaceFromTemplate(name: string): Promise<{ spaceId: string, publicKey: string }> {
    const createSpaceQuery = /* GraphQL */ `
      mutation CreateSpace($settings: JSONObject!) {
        createSpace(settings: $settings)
      }
    `

    try {
      // Create space with settings
      const spaceData = await this.client.request(createSpaceQuery, {
        settings: {
          name,
          templateId: this.templateSpaceId,
          allowBuilderSites: true,
          previewUrl: "*",
          siteUrl: "*"
        }
      })
      
      const spaceId = (spaceData as { createSpace: string }).createSpace

      // Try to get the public API key, but don't throw if we can't get it
      const publicKey = await this.getSpacePublicKey(spaceId)

      return {
        spaceId,
        publicKey
      }
    } catch (error) {
      console.error('Failed to create Builder.io space:', error)
      throw new Error('Failed to create Builder.io space')
    }
  }
}