import { listAdsAction } from '@/actions/ads/list-ads.action'
import { AdsClient } from './ads-client'

export default async function AdsPage() {
    const ads = await listAdsAction()
    return <AdsClient initialAds={ads} />
}
