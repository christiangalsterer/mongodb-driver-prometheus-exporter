import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import type { MongoClientOptions } from 'mongodb'
import { MongoClient } from 'mongodb'
import { Registry } from 'prom-client'

import { monitorMongoDBDriver } from '../src/exporter'
import { MongoDBDriverExporter } from '../src/mongoDBDriverExporter'

jest.mock('../src/mongoDBDriverExporter')
const mockMongoDBDriverExporter = jest.mocked(MongoDBDriverExporter, { shallow: false })

describe('tests monitorMongoDBDriver', () => {
  let mongoClient: MongoClient
  let register: Registry

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- MongoClientOptions extends Node.js TLS types that gained required properties in Node.js 24
    const mongoClientOptions = { monitorCommands: true } as unknown as MongoClientOptions
    mongoClient = new MongoClient('mongodb://localhost:27017', mongoClientOptions)
    register = new Registry()
    mockMongoDBDriverExporter.mockClear()
  })

  test('monitorMongoDBDriver calls MongoDBDriverExporter constructor with mandatory parameter', () => {
    monitorMongoDBDriver(mongoClient, register)
    expect(mockMongoDBDriverExporter).toHaveBeenCalledTimes(1)
    expect(mockMongoDBDriverExporter).toHaveBeenCalledWith(mongoClient, register, undefined)
  })

  test('monitorMongoDBDriver calls MongoDBDriverExporter constructor with optional parameter', () => {
    const options = {
      mongodbDriverCommandsSecondsHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 20],
      waitQueueSecondsHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 20]
    }
    monitorMongoDBDriver(mongoClient, register, options)
    expect(mockMongoDBDriverExporter).toHaveBeenCalledTimes(1)
    expect(mockMongoDBDriverExporter).toHaveBeenCalledWith(mongoClient, register, options)
  })

  test('monitorMongoDBDriver calls methods of MongoDBDriverExporter instance', () => {
    monitorMongoDBDriver(mongoClient, register)
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- index access is clearer when referencing a specific mock instance by position
    const mockMongoDBDriverExporterInstance = mockMongoDBDriverExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method, @typescript-eslint/no-unsafe-type-assertion -- accessing jest mock on instance method requires cast
    const mockEnableMetrics = mockMongoDBDriverExporterInstance.enableMetrics as jest.Mock
    expect(mockEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
