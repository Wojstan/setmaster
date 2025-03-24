import { spawn } from 'node:child_process'
import { join } from 'node:path'

interface SetAnalysis {
  key: string
  bpm: number
}

enum ExitCode {
  SUCCESS = 0,
}

const WORKING_DIR = join(__dirname, '../../../', 'analyzer')
const SCRIPT_PATH = './src/analyze.py'

export function analyzeWithPython(filePath: string): Promise<SetAnalysis> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(
      'uv',
      ['run', 'python3', SCRIPT_PATH, filePath],
      {
        cwd: WORKING_DIR,
      },
    )

    let output = ''
    pythonProcess.stdout.on('data', (data: Buffer) => {
      output += data.toString()
    })

    pythonProcess.stderr.on('data', (data: string) => {
      console.error(`Error: ${data}`)
      reject(data.toString())
    })

    pythonProcess.on('close', (code) => {
      if (code === ExitCode.SUCCESS) {
        resolve(serializeOutput(output))
      }

      reject(`Process exited with code ${code}`)
    })
  })
}

function serializeOutput(output: string): SetAnalysis {
  return JSON.parse(output.replaceAll("'", '"'))
}
