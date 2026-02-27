export type GroupDTO = { id: string; name: string }

export type SendTextParams = {
  instanceId: string
  groupId: string
  text: string
}

export type SendMediaParams = {
  instanceId: string
  groupId: string
  text?: string
  mediaUrl: string
  mediaType: 'image'
}

export type AppLimits = {
  maxInstances: number
  maxAds: number
  maxSchedules: number
  maxGroupsPerSchedule: number
}
