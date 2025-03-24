import { spawn } from 'node:child_process'
import path from 'node:path'

async function main() {
  analyzeAudio('./set.mp3')
}

main()

function analyzeAudio(filePath: string) {
  const workingDir = path.join(__dirname, '../../', 'analyzer')

  const pythonProcess = spawn(
    'uv',
    ['run', 'python3', './src/analyze.py', filePath],
    {
      cwd: workingDir,
    },
  )

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}
