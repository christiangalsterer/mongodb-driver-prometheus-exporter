import { beforeEach, describe, expect, test, jest } from '@jest/globals'

import { Registry } from 'prom-client'
import { MongoClient } from 'mongodb'
import { monitorMongoDBDriver } from '../src/exporter'
import { MongoDBDriverExporter } from '../src/mongoDBDriverExporter'

const mockPromClient = jest.createMockFromModule('prom-client')
const mockMongodb = jest.createMockFromModule<typeof import('mongodb')>('mongodb')
// const exporterMock = jest.createMockFromModule<typeof import('../src/exporter')>('../src/exporter')
// const exporterMock = jest.createMockFromModule('../src/exporter')
jest.mock('../src/mongoDBDriverExporter')
const mockMongoDBDriverExporter = jest.mocked(MongoDBDriverExporter, { shallow: false })

describe('tests monitorMongoDBDriver', () => {
  let mongoClient: MongoClient
  let register: Registry

  beforeEach(() => {
    mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
    register = new Registry()
    mockMongoDBDriverExporter.mockClear()
  })

  test('tests if monitorMongoDBDriver called MongoDBDriverExporter constructor with mandatory parameter', () => {
    monitorMongoDBDriver(mongoClient, register)
    expect(mockMongoDBDriverExporter).toHaveBeenCalledTimes(1)
    expect(mockMongoDBDriverExporter).toBeCalledWith(mongoClient, register, undefined)
  })

  test('tests if monitorMongoDBDriver called MongoDBDriverExporter constructor with optional parameter', () => {
    const options = { mongodbDriverCommandsSecondsHistogramBuckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 20] }
    monitorMongoDBDriver(mongoClient, register, options)
    expect(mockMongoDBDriverExporter).toHaveBeenCalledTimes(1)
    expect(mockMongoDBDriverExporter).toBeCalledWith(mongoClient, register, options)
  })

  test('tests if monitorMongoDBDriver called methods of MongoDBDriverExporter instance', () => {
    monitorMongoDBDriver(mongoClient, register)
    const mockMongoDBDriverExporterInstance = mockMongoDBDriverExporter.mock.instances[0]
    const mockRegisterMetrics = mockMongoDBDriverExporterInstance.registerMetrics as jest.Mock
    const mockEnableMetrics = mockMongoDBDriverExporterInstance.enableMetrics as jest.Mock
    expect(mockRegisterMetrics).toHaveBeenCalledTimes(1)
    expect(mockEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
