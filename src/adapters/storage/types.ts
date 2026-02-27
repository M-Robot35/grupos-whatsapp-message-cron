export interface StorageProvider {
  upload(file: Buffer, path: string, contentType: string): Promise<{ url: string }>
  remove(path: string): Promise<void>
}
