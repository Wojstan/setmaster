interface APITrackInfo {
  id: string
  user: {
    username: string
  }
  artwork_url: string
  title: string
  transcoding: string
  duration: number
  media: {
    transcodings: {
      url: string
    }[]
  }
}

interface TrackInfo extends Partial<APITrackInfo> {
  cover: string
  streamUrl: string
  artist: string
}

export class SoundCloudAPI {
  private readonly API_URL = 'https://api-v2.soundcloud.com'
  private readonly WEB_URL = 'https://soundcloud.com'
  private CLIENT_ID

  async getClientId(): Promise<string> {
    if (this.CLIENT_ID) return this.CLIENT_ID

    return this.scrapClientId()
  }

  async getTrackInfo(trackUrl: string): Promise<TrackInfo> {
    const trackId = await this.fetchTrackID(trackUrl)
    const apiTrackInfo = await this.fetchTrackInfo(trackId)
    const trackInfo = this.parseTrackInfo(apiTrackInfo)

    return trackInfo
  }

  private parseTrackInfo(apiTrackInfo: APITrackInfo): TrackInfo {
    return {
      id: apiTrackInfo.id,
      artist: apiTrackInfo.user.username,
      cover: apiTrackInfo.artwork_url,
      title: apiTrackInfo.title,
      duration: apiTrackInfo.duration,
      streamUrl: apiTrackInfo.media.transcodings[0].url,
    }
  }

  private async fetchTrackInfo(trackId: string): Promise<APITrackInfo> {
    const response = await fetch(
      `${this.API_URL}/tracks/${trackId}?client_id=${this.CLIENT_ID}`,
    )
    const data: APITrackInfo = await response.json()

    return data
  }

  private async fetchTrackID(trackUrl: string): Promise<string> {
    const response = await fetch(
      `${this.API_URL}/resolve?url=${trackUrl}&client_id=${this.CLIENT_ID}`,
    )
    const data: { id: string } = await response.json()

    return data.id
  }

  private async scrapClientId(): Promise<string> {
    const scriptUrls = await this.scrapScriptUrls()

    for (const url of scriptUrls) {
      const response = await fetch(url)
      const scriptScrap = await response.text()
      const clientId = scriptScrap.match(/[{,]client_id:"(\w+)"/)?.[1]

      if (!clientId) continue

      this.CLIENT_ID = clientId
      return clientId
    }

    throw new Error('Could not find client ID in script URLs')
  }

  private async scrapScriptUrls(): Promise<string[]> {
    const response = await fetch(this.WEB_URL)
    const webScrap = await response.text()

    if (!webScrap) throw new Error('Empty response from WEB_URL')

    return webScrap.match(/https?:\/\/[^\s"]+\.js/g) || []
  }
}
