export const SOUNDCLOUD_API_URL = 'https://api-v2.soundcloud.com'
const WEB_URL = 'https://soundcloud.com'

let CLIENT_ID: string | null = null

export async function getClientId(): Promise<string> {
  if (CLIENT_ID) return CLIENT_ID

  return await scrapClientId()
}

async function scrapClientId(): Promise<string> {
  const scriptUrls = await scrapScriptUrls()

  for (const url of scriptUrls) {
    const response = await fetch(url)
    const scriptScrap = await response.text()
    const clientId = scriptScrap.match(/[{,]client_id:"(\w+)"/)?.[1]

    if (clientId) {
      CLIENT_ID = clientId
      return clientId
    }
  }

  throw new Error('Could not find client ID in script URLs')
}

async function scrapScriptUrls(): Promise<string[]> {
  const response = await fetch(WEB_URL)
  const webScrap = await response.text()

  if (!webScrap) throw new Error('Empty response from WEB_URL')

  return webScrap.match(/https?:\/\/[^\s"]+\.js/g) || []
}
