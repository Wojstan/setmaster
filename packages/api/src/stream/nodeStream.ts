import { createWriteStream } from 'node:fs'
import { Readable } from 'node:stream'
import type { WebStream } from 'types/WebStream'

export function readStream(webStream: WebStream): Readable {
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

export function saveStream(nodeStream: Readable): void {
  const writeStream = createWriteStream('../analyzer/set.mp3')

  nodeStream.pipe(writeStream)
}
