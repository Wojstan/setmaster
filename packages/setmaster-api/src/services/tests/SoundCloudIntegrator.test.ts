import { describe, expect, it } from 'vitest'
import { SoundCloudIntegrator } from '../SoundcloudIntegrator'

describe('SoundCloudIntegrator', () => {
  const soundCloudIntegrator = new SoundCloudIntegrator()

  it('integrates', () => {
    expect(soundCloudIntegrator.integrating()).toBe(
      'Hello, I am integrating here',
    )
  })
})
