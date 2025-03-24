import type { WebStream } from 'types/WebStream'
import { getClientId } from './config'

export async function getTrackStream(transcoding: string): Promise<WebStream> {
  const streamUrl = await scrapTrackStreamUrl(transcoding)
  const stream = await fetchTrackStream(streamUrl)

  return stream
}

async function fetchTrackStream(streamUrl: string): Promise<WebStream> {
  const response = await fetch(streamUrl)
  if (!response.ok || !response.body)
    throw new Error(`Failed to fetch stream: ${response.statusText}`)

  return response.body
}

async function scrapTrackStreamUrl(transcoding: string): Promise<string> {
  const clientId = await getClientId()
  const response = await fetch(`${transcoding}?client_id=${clientId}`)

  if (!response.ok)
    throw new Error(`Failed to fetch transcoding URL: ${response.statusText}`)

  const data: { url: string } = await response.json()
  return data.url
}
