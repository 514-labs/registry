import { describe, it, expect } from 'vitest'
import { PipelineRunner } from '../src/runner'

describe('PipelineRunner', () => {
  it('ping', () => {
    expect(new PipelineRunner({}).ping()).toBe(true)
  })
})
