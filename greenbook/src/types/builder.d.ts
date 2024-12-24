declare module '@builder.io/sdk' {
  export interface BuilderOptions {
    apiKey: string;
    name?: string;
    description?: string;
    // Add other options as needed
  }

  export interface BuilderSpace {
    id: string;
    name: string;
    settings: {
      hasChannels: boolean;
      pathPrefix: string;
    };
  }

  export interface BuilderApiKey {
    id: string;
    name: string;
    token: string;
    permissions: string[];
  }

  export class BuilderIO {
    constructor(apiKey: string);
    
    createSpace(options: BuilderOptions): Promise<BuilderSpace>;
    
    generateToken(spaceId: string, options: {
      name: string;
      permissions?: string[];
    }): Promise<BuilderApiKey>;
    
    getSpace(spaceId: string): Promise<BuilderSpace>;
  }
}