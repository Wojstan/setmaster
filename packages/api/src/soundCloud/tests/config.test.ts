import { describe, expect, it } from 'vitest'
import { getClientId } from '../config'

// TODO: Add tests for scrapping the client id
describe('soundCloud', () => {
  it('gets clientId', async () => {
    const clientId = await getClientId()

    expect(clientId).toEqual('UjhhbCuNo1OQfTwkzajxQNLlJcSlUlVz')
  })
})
