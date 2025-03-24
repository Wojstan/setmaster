import { getTrackStream } from './soundCloud/soundCloudStream'
import { getTrackInfo } from './soundCloud/soundCloudTrack'
import { readStream, saveStream } from './stream/nodeStream'

async function main() {
  const trackUrl =
    'https://soundcloud.com/groovin-uk/show-me-what-you-got-vocal-mix'
  const trackInfo = await getTrackInfo(trackUrl)
  const stream = await getTrackStream(trackInfo.streamUrl)
  const readableStream = readStream(stream)

  saveStream(readableStream)
}

main()
