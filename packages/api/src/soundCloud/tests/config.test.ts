import { describe, expect, it } from 'bun:test'
import { getClientId } from '../config'

// TODO: Add tests for scrapping the client id
describe('soundCloud', () => {
  it('gets clientId', async () => {
    const clientId = await getClientId()

    expect(clientId).toEqual('qQiu5UJazb1JLxqsBpsp67Yr5yrptKJ0')
  })
})
