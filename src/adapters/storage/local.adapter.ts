import fs from 'node:fs/promises'
import path from 'node:path'
import { StorageProvider } from './types'

export class LocalStorageAdapter implements StorageProvider {
  private baseDir = path.resolve(process.cwd(), 'uploads')

  async upload(file: Buffer, filePath: string): Promise<{ url: string }> {
    const absolutePath = path.join(this.baseDir, filePath)
    await fs.mkdir(path.dirname(absolutePath), { recursive: true })
    await fs.writeFile(absolutePath, file)
    return { url: `/uploads/${filePath}` }
  }

  async remove(filePath: string): Promise<void> {
    const absolutePath = path.join(this.baseDir, filePath)
    await fs.rm(absolutePath, { force: true })
  }
}
