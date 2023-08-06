import { beforeEach, describe, expect, test, jest, afterEach } from '@jest/globals'
import { Registry } from 'prom-client'
import { MongoClient } from 'mongodb'
import { MongoDBDriverExporter } from '../src/mongoDBDriverExporter'

const mockPromClient = jest.createMockFromModule<typeof import('prom-client')>('prom-client')
const mockMongodb = jest.createMockFromModule<typeof import('mongodb')>('mongodb')

describe('tests mongoDBDriverExporter', () => {
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    register.clear()
  })

  afterEach(() => {
    register.clear()
  })

  test('tests if connection and commands metrics are registered in registry', () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
    const exporter = new MongoDBDriverExporter(mongoClient, register)
    exporter.registerMetrics()
    expect(register.getMetricsAsArray().length).toBe(6)
    // console.log(register.getMetricsAsArray())
  })

  test('tests if only connection metrics are registered in registry', () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: false })
    const exporter = new MongoDBDriverExporter(mongoClient, register)
    exporter.registerMetrics()
    expect(register.getMetricsAsArray().length).toBe(5)
  })

  test('tests if event connection and command listeners are registered for mongo client events', () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
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
    expect(mongoClient.listenerCount('commandSucceeded')).toBe(1)
    expect(mongoClient.listenerCount('commandFailed')).toBe(1)
  })

  test('tests if only event connection listeners are registered for mongo client events', () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: false })
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
    expect(mongoClient.listenerCount('commandSucceeded')).toBe(0)
    expect(mongoClient.listenerCount('commandFailed')).toBe(0)
  })
})
