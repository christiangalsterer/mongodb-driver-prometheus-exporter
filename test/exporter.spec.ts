import { Registry } from 'prom-client'
import { MongoClient, MongoClientOptions } from 'mongodb'
import { monitorMongoDBDriver } from '../src'
import { beforeEach, describe, expect, test, jest } from '@jest/globals'

const mongoClientMock = jest.fn()
const registryMock = jest.fn

jest.mock('mongodb', () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => {
      return {
        new: mongoClientMock
      }
    })
  }
})

jest.mock('prom-client', () => {
  return {
    Registry: jest.fn().mockImplementation(() => {
      return {
        new: registryMock
      }
    })
  }
})

describe('monitorMongoDBDriver', () => {
  let mongoClient: MongoClient
  let register: Registry

  beforeEach(() => {
    mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
    register = new Registry()
  })

  test('monitorMongoDBDriver', () => {
    monitorMongoDBDriver(mongoClient, register)
  })
})
