import { LocalStorageAdapter } from '@/adapters/storage/local.adapter'
import { S3StorageAdapter } from '@/adapters/storage/s3.adapter'
import { StorageProvider } from '@/adapters/storage/types'
import { RetryableWhatsAppAdapter } from '@/adapters/whatsapp/decorators/retryable-whatsapp.adapter'
import { EvolutionWhatsAppAdapter } from '@/adapters/whatsapp/evolution.adapter'
import { MetaWhatsAppAdapter } from '@/adapters/whatsapp/meta.adapter'
import { WhatsAppProvider } from '@/adapters/whatsapp/types'
import { env } from './env'

export function makeWhatsAppProvider(): WhatsAppProvider {
  const provider = env.WA_PROVIDER === 'meta' ? new MetaWhatsAppAdapter() : new EvolutionWhatsAppAdapter()
  return new RetryableWhatsAppAdapter(provider)
}

export function makeStorageProvider(): StorageProvider {
  if (env.STORAGE_DRIVER === 's3') return new S3StorageAdapter()
  return new LocalStorageAdapter()
}
