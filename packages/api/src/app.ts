import { getTrackStream } from 'soundCloud/soundCloudStream'
import { getTrackInfo } from 'soundCloud/soundCloudTrack'
import { streamToBuffer } from 'stream/streamToBuffer'

async function main() {
  const track = await getTrackInfo('https://soundcloud.com/m44k/mstks')
  const trackStream = await getTrackStream(track.streamUrl)
  const buffer = await streamToBuffer(trackStream)

  console.log(buffer)
}

main()
