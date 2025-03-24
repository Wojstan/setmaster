import { analyzeWithPython } from 'stream/analyzeWithPython'

async function main() {
  const analysis = await analyzeWithPython('./set.mp3')

  console.log(analysis)
}

main()
