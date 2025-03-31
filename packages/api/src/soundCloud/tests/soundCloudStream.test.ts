import { describe, expect, it } from 'bun:test'
import { getTrackStream } from '../soundCloudStream'

describe('soundCloudStream', () => {
  const streamUrl =
    'https://api-v2.soundcloud.com/media/soundcloud:tracks:1625664345/c8627324-b3f8-48bd-b11b-3e8cfb06f515/stream/progressive'

  it('gets track stream', async () => {
    const stream = await getTrackStream(streamUrl)

    expect(stream).toBeInstanceOf(ReadableStream)
  })
})
