/* eslint-disable no-console */
import { describe, expect, test } from '@jest/globals'

import { ConsoleLogger, mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from '../src/utils'

describe('consoleLogger', () => {
  let consoleLogger: ConsoleLogger

  beforeEach(() => {
    consoleLogger = new ConsoleLogger()
    jest.spyOn(console, 'log')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('log an info message', () => {
    consoleLogger.info('Info message')
    expect(console.log).toHaveBeenCalledWith('Info message')
  })

  test('log a warning message', () => {
    consoleLogger.warn('Warning message')
    expect(console.log).toHaveBeenCalledWith('Warning message')
  })

  test('log an error message', () => {
    consoleLogger.error('Error message')
    expect(console.log).toHaveBeenCalledWith('Error message')
  })
})

describe('mergeLabelNamesWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = ['label1', 'label2']
  const emptylabels = []

  test('mergeLabelNamesWithStandardLabels with no default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels)).toStrictEqual(labels)
  })

  test('mergeLabelNamesWithStandardLabels with empty labels and no default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(emptylabels)).toStrictEqual([])
  })

  test('mergeLabelNamesWithStandardLabels with default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels, defaultLabels)).toStrictEqual(['label1', 'label2', 'foo', 'alice'])
  })

  test('mergeLabelNamesWithStandardLabels with empty labels and default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(emptylabels, defaultLabels)).toStrictEqual(['foo', 'alice'])
  })
})

describe('mergeLabelsWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = { label1: 'value1', label2: 2, label3: undefined }
  const emptyLabels = {}

  test('mergeLabelsWithStandardLabels with labels and no default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels)).toStrictEqual({ label1: 'value1', label2: 2 })
  })

  test('mergeLabelsWithStandardLabels with empty labels and no default labels', () => {
    expect(mergeLabelsWithStandardLabels(emptyLabels)).toStrictEqual(emptyLabels)
  })

  test('mergeLabelsWithStandardLabels with labels and default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels, defaultLabels)).toStrictEqual({ label1: 'value1', label2: 2, foo: 'bar', alice: 3 })
  })

  test('mergeLabelsWithStandardLabels with empty labels and default labels', () => {
    expect(mergeLabelsWithStandardLabels(emptyLabels, defaultLabels)).toStrictEqual(defaultLabels)
  })
})
