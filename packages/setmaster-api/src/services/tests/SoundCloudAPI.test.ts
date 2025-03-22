import { describe, expect, it } from 'vitest'
import { SoundCloudAPI } from '../SoundCloudAPI'

describe('SoundCloudAPI', () => {
  const trackUrl =
    'https://soundcloud.com/luna-city-express/luna-city-express-bucht-der-traumer-schlupfloch-16aug2024'
  const soundCloudIntegrator = new SoundCloudAPI()

  it('gets clientId', async () => {
    const clientId = await soundCloudIntegrator.getClientId()

    expect(clientId).toEqual('UjhhbCuNo1OQfTwkzajxQNLlJcSlUlVz')
  })

  it('gets track info', async () => {
    const trackInfo = await soundCloudIntegrator.getTrackInfo(trackUrl)

    expect(trackInfo).toStrictEqual({
      artist: 'Luna City Express',
      cover: 'https://i1.sndcdn.com/artworks-eRyzrep3EGVJDxHP-GHE69g-large.jpg',
      duration: 10818116,
      id: 1919014190,
      streamUrl:
        'https://api-v2.soundcloud.com/media/soundcloud:tracks:1919014190/786e2b1d-834f-438f-890f-9b7a6f0a659b/stream/hls',
      title: 'Luna City Express - Bucht Der Träumer (Schlupfloch 16Aug2024)',
    })
  })
})
