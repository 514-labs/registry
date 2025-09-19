import { describe, it, expect } from 'vitest'
import { Client } from '../src/client'

describe('client', () => {
  it('ping', () => {
    expect(new Client({}).ping()).toBe(true)
  })
})
