import { describe, expect, it } from 'vitest'
import { StreamService } from '../StreamService'
import { SoundCloudService } from '../SoundCloudService'

describe('StreamService', () => {
  const trackUrl =
    'https://soundcloud.com/groovin-uk/show-me-what-you-got-vocal-mix'
  const soundCloudService = new SoundCloudService()
  const streamService = new StreamService(soundCloudService)

  it('gets track', async () => {
    const trackStream = await streamService.getTrackStream(trackUrl)

    expect(trackStream).toEqual([])
  })
})
