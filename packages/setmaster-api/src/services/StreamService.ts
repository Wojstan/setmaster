import { Readable } from 'node:stream'
import type { SoundCloudService } from './SoundCloudService'

type WebStream = ReadableStream<Uint8Array<ArrayBufferLike>>

export class StreamService {
  constructor(private readonly soundCloudService: SoundCloudService) {}

  async getTrackStream(trackUrl: string): Promise<Readable> {
    const { streamUrl } = await this.soundCloudService.getTrackInfo(trackUrl)
    const webStream = await this.fetchAudioWebStream(streamUrl)

    return this.saveWebStreamToNodeReadable(webStream)
  }

  private async fetchAudioWebStream(
    streamUrl: string,
  ): Promise<WebStream | null> {
    const response = await fetch(streamUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch stream: ${response.statusText}`)
    }

    return response.body
  }

  private saveWebStreamToNodeReadable(webStream: WebStream | null): Readable {
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
