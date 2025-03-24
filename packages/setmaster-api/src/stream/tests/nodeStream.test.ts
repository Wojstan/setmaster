import * as fs from 'node:fs'
import { Readable, Writable } from 'node:stream'
import { describe, expect, it, vi } from 'vitest'
import { readStream, saveStream } from '../nodeStream'

describe('nodeStream', () => {
  it('reads stream', async () => {
    const webStream = createMockWebStream()
    const nodeStream = readStream(webStream)

    expect(nodeStream).toBeInstanceOf(Readable)
  })

  it('matches data from stream', async () => {
    const webStream = createMockWebStream()
    const nodeStream = readStream(webStream)

    const chunks: Buffer[] = []
    for await (const chunk of nodeStream) {
      chunks.push(chunk)
    }

    const result = Buffer.concat(chunks).toString()
    expect(result).toBe('mock data')
  })

  it('writes to a file', () => {
    const mockNodeStream = Readable.from(['mock data'])
    saveStream(mockNodeStream)

    expect(fs.createWriteStream).toHaveBeenCalledWith('./set.mp3')
  })
})

vi.mock('fs', () => ({
  createWriteStream: vi.fn(() => {
    const writable = new Writable({
      write(_chunk, _encoding, callback) {
        callback()
      },
    })
    vi.spyOn(writable, 'pipe')
    return writable
  }),
}))

function createMockWebStream(): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('mock data'))
      controller.close()
    },
  })
}
