/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { beforeEach } from '@jest/globals'
import { MongoDBDriverExporter } from '../src/mongoDBDriverExporter'
import { MongoClient } from 'mongodb'
import { Gauge, Histogram, type Registry } from 'prom-client'

jest.mock('prom-client', () => ({
  Gauge: jest.fn(() => {
    return {
      set: jest.fn(),
      get: jest.fn()
    }
  }),
  Histogram: jest.fn(() => {
    return {
      set: jest.fn(),
      get: jest.fn()
    }
  })
}))

describe('test if all metrics are created with the correct parameters', () => {
  const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
  const register: Registry = {} as Registry

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('tests if all gauge metrics are created', () => {
    // eslint-disable-next-line no-new
    new MongoDBDriverExporter(mongoClient, register)

    expect(Gauge).toBeCalledTimes(5)

    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_size',
      help: 'the current size of the connection pool, including idle and in-use members',
      labelNames: ['server_address'],
      registers: [register]
    })
    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_min',
      help: 'the minimum size of the connection pool',
      labelNames: ['server_address'],
      registers: [register]
    })
    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_max',
      help: 'the maximum size of the connection pool',
      labelNames: ['server_address'],
      registers: [register]
    })
    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_checkedout',
      help: 'the count of connections that are currently in use',
      labelNames: ['server_address'],
      registers: [register]
    })
    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_waitqueuesize',
      help: 'the current size of the wait queue for a connection from the pool',
      labelNames: ['server_address'],
      registers: [register]
    })
  })

  test('tests if all histogram metrics are created', () => {
    // eslint-disable-next-line no-new
    new MongoDBDriverExporter(mongoClient, register)

    expect(Histogram).toBeCalledTimes(1)

    expect(Histogram).toHaveBeenCalledWith({
      name: 'mongodb_driver_commands_seconds',
      help: 'Timer of mongodb commands',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['command', 'server_address', 'status'],
      registers: [register]
    })
  })
})
