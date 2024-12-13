/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { beforeEach } from '@jest/globals'
import { MongoClient } from 'mongodb'
import { Gauge, Histogram, type Registry } from 'prom-client'

import { MongoDBDriverExporter } from '../src/mongoDBDriverExporter'

jest.mock('prom-client', () => ({
  Gauge: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn()
  })),
  Histogram: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn()
  }))
}))

describe('all metrics are created with the correct parameters', () => {
  const options = { defaultLabels: { foo: 'bar', alice: 2 } }
  const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const register: Registry = {} as Registry

  beforeEach(() => {
    jest.clearAllMocks()
    register.getSingleMetric = jest.fn(() => undefined)
  })

  test('all metrics are created', () => {
    // eslint-disable-next-line no-new
    new MongoDBDriverExporter(mongoClient, register)

    expect(Gauge).toHaveBeenCalledTimes(5)
    expect(Histogram).toHaveBeenCalledTimes(2)

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

    expect(Histogram).toHaveBeenCalledWith({
      name: 'mongodb_driver_commands_seconds',
      help: 'Timer of mongodb commands',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['command', 'server_address', 'status'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_waitqueue_seconds',
      help: 'Duration of waiting for a connection from the pool',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['server_address', 'status'],
      registers: [register]
    })
  })

  test('all metrics are created with default labels', () => {
    // eslint-disable-next-line no-new
    new MongoDBDriverExporter(mongoClient, register, options)

    expect(Gauge).toHaveBeenCalledTimes(5)
    expect(Histogram).toHaveBeenCalledTimes(2)

    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_size',
      help: 'the current size of the connection pool, including idle and in-use members',
      labelNames: ['server_address', 'foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_min',
      help: 'the minimum size of the connection pool',
      labelNames: ['server_address', 'foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_max',
      help: 'the maximum size of the connection pool',
      labelNames: ['server_address', 'foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_checkedout',
      help: 'the count of connections that are currently in use',
      labelNames: ['server_address', 'foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_waitqueuesize',
      help: 'the current size of the wait queue for a connection from the pool',
      labelNames: ['server_address', 'foo', 'alice'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'mongodb_driver_commands_seconds',
      help: 'Timer of mongodb commands',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['command', 'server_address', 'status', 'foo', 'alice'],
      registers: [register]
    })


    expect(Histogram).toHaveBeenCalledWith({
      name: 'mongodb_driver_pool_waitqueue_seconds',
      help: 'Duration of waiting for a connection from the pool',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['server_address', 'status', 'foo', 'alice'],
      registers: [register]
    })
  })

  test('all metrics include the name prefix.', () => {
    // eslint-disable-next-line no-new
    new MongoDBDriverExporter(mongoClient, register, { prefix: 'test_' })

    expect(Gauge).toHaveBeenCalledTimes(5)
    expect(Histogram).toHaveBeenCalledTimes(2)

    expect(Gauge).toHaveBeenCalledWith({
      name: 'test_mongodb_driver_pool_size',
      help: 'the current size of the connection pool, including idle and in-use members',
      labelNames: ['server_address'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'test_mongodb_driver_pool_min',
      help: 'the minimum size of the connection pool',
      labelNames: ['server_address'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'test_mongodb_driver_pool_max',
      help: 'the maximum size of the connection pool',
      labelNames: ['server_address'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'test_mongodb_driver_pool_checkedout',
      help: 'the count of connections that are currently in use',
      labelNames: ['server_address'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'test_mongodb_driver_pool_waitqueuesize',
      help: 'the current size of the wait queue for a connection from the pool',
      labelNames: ['server_address'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'test_mongodb_driver_commands_seconds',
      help: 'Timer of mongodb commands',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['command', 'server_address', 'status'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'test_mongodb_driver_pool_waitqueue_seconds',
      help: 'Duration of waiting for a connection from the pool',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['server_address', 'status'],
      registers: [register]
    })
  })
})
