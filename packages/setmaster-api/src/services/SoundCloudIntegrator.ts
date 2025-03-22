import { Readable } from 'node:stream'

interface SoundCloudTrack {
  name: string
}

interface SoundCloudTranscoding {
  name: string
}

export class SoundCloudIntegrator {
  async getTrackStream(trackUrl: string): Promise<Readable> {
    const soundcloudTrack = await this.getTrackFromSoundCloud(trackUrl)
    const [transcoding] = await this.sortTranscodings(
      soundcloudTrack,
      'progressive',
    )
    const url = await this.fetchTrackStreamUrl(transcoding)
    const webStream = await this.fetchAudioWebStream(url)
    const nodeStream = await this.saveWebStreamToNodeReadable(webStream)

    return nodeStream
  }

  private async getTrackFromSoundCloud(
    trackResolvable: string,
  ): Promise<SoundCloudTrack> {}

  private fetchTrackStreamUrl(): Promise<string> {}

  private readonly sortTranscodings = async (
    track: SoundCloudTrack,
    protocol?: 'progressive' | 'hls',
  ) => {
    const transcodings = track.media.transcodings.sort((t) =>
      t.quality === 'hq' ? -1 : 1,
    )

    if (!protocol) return transcodings

    return transcodings.filter((t) => t.format.protocol === protocol)
  }

  private async fetchAudioWebStream(
    trackUrl: string,
  ): Promise<ReadableStream<Uint8Array<ArrayBufferLike>> | null> {
    const response = await fetch(trackUrl, {
      headers: {
        Origin: 'https://soundcloud.com',
        Referer: 'https://soundcloud.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67',
      },
    })

    return response.body
  }

  private saveWebStreamToNodeReadable(
    webStream: ReadableStream<Uint8Array> | null,
  ) {
    if (!webStream) throw new Error('No stream')

    const webStreamReader = webStream.getReader()
    const readable = new Readable({
      async read() {
        const { done, value } = await webStreamReader.read()

        if (done) {
          this.push(null)
          return
        }

        this.push(value)
      },
    })

    return readable
  }
}
