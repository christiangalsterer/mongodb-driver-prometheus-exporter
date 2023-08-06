import { beforeEach, describe, expect, test, jest, afterEach } from '@jest/globals'
import { Registry } from 'prom-client'
import { MongoClient } from 'mongodb'
import { MongoDBDriverExporter } from '../src/mongoDBDriverExporter'

const mockPromClient = jest.createMockFromModule<typeof import('prom-client')>('prom-client')
const mockMongodb = jest.createMockFromModule<typeof import('mongodb')>('mongodb')

describe('tests mongoDBDriverExporter', () => {
  let mongoClient: MongoClient
  let register: Registry

  beforeEach(() => {
    mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
    register = new Registry()
    register.clear()
  })

  afterEach(() => {
    register.clear()
  })

  test('tests if metrics are registered in registry', () => {
    const exporter = new MongoDBDriverExporter(mongoClient, register)
    exporter.registerMetrics()
    expect(register.getMetricsAsArray().length).toBe(6)
    // console.log(register.getMetricsAsArray())
  })

  test('tests if event listeners are registered for mongo client events', () => {
    const exporter = new MongoDBDriverExporter(mongoClient, register)
    exporter.registerMetrics()
    exporter.enableMetrics()
    expect(mongoClient.listenerCount('connectionPoolCreated')).toBe(1)
    expect(mongoClient.listenerCount('connectionPoolClosed')).toBe(1)
    expect(mongoClient.listenerCount('connectionCreated')).toBe(1)
    expect(mongoClient.listenerCount('connectionClosed')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckOutStarted')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckedOut')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckOutFailed')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckedIn')).toBe(1)
  })
})
