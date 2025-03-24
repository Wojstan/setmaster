import { spawn } from 'node:child_process'
import { analyzeWithPython } from '../analyzeWithPython'

describe('analyzeWithPython', () => {
  it('should resolve with the parsed analysis data', async () => {
    const result = await analyzeWithPython('path/to/file')

    expect(result).toEqual({
      bpm: 120,
      key: '8A',
    })
    expect(spawn).toHaveBeenCalledWith(
      'uv',
      ['run', 'python3', './src/analyze.py', 'path/to/file'],
      expect.objectContaining({
        cwd: expect.stringContaining('analyzer'),
      }),
    )
  })
})

vi.mock('node:child_process', () => ({
  spawn: vi.fn().mockImplementation(() => ({
    stdout: {
      on: vi.fn().mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from("{'bpm': 120, 'key': '8A'}"))
        }
      }),
    },
    stderr: {
      on: vi.fn().mockImplementation(() => {}),
    },
    on: vi.fn().mockImplementation((event, callback) => {
      if (event === 'close') {
        callback(0)
      }
    }),
  })),
}))
