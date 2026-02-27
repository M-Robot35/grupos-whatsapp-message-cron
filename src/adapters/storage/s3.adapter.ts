import { StorageProvider } from './types'

export class S3StorageAdapter implements StorageProvider {
  async upload(): Promise<{ url: string }> {
    throw new Error('S3 adapter not implemented yet.')
  }

  async remove(): Promise<void> {
    throw new Error('S3 adapter not implemented yet.')
  }
}
