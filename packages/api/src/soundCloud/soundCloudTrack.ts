import { SOUNDCLOUD_API_URL, getClientId } from './config'

interface APITrackInfo {
  id: string
  user: { username: string }
  artwork_url: string
  title: string
  transcoding: string
  duration: number
  media: { transcodings: { url: string }[] }
}

interface TrackInfo extends Partial<APITrackInfo> {
  cover: string
  streamUrl: string
  artist: string
}

export async function getTrackInfo(trackUrl: string): Promise<TrackInfo> {
  const clientId = await getClientId()
  const trackId = await fetchTrackID(trackUrl, clientId)
  const apiTrackInfo = await fetchTrackInfo(trackId, clientId)

  return parseTrackInfo(apiTrackInfo)
}

function parseTrackInfo(apiTrackInfo: APITrackInfo): TrackInfo {
  return {
    id: apiTrackInfo.id,
    artist: apiTrackInfo.user.username,
    cover: apiTrackInfo.artwork_url,
    title: apiTrackInfo.title,
    duration: apiTrackInfo.duration,
    streamUrl: apiTrackInfo.media.transcodings[1]?.url ?? '',
  }
}

async function fetchTrackInfo(
  trackId: string,
  clientId: string,
): Promise<APITrackInfo> {
  const response = await fetch(
    `${SOUNDCLOUD_API_URL}/tracks/${trackId}?client_id=${clientId}`,
  )
  if (!response.ok)
    throw new Error(`Failed to fetch track info: ${response.statusText}`)

  return response.json()
}

async function fetchTrackID(
  trackUrl: string,
  clientId: string,
): Promise<string> {
  const response = await fetch(
    `${SOUNDCLOUD_API_URL}/resolve?url=${trackUrl}&client_id=${clientId}`,
  )
  if (!response.ok)
    throw new Error(`Failed to resolve track URL: ${response.statusText}`)

  const data: { id: string } = await response.json()

  return data.id
}
