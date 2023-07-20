import { Registry } from 'prom-client'
import { MongoClient } from 'mongodb'
import { monitorMongoDBDriver } from '../src'
import { beforeEach, describe, expect, test, jest } from '@jest/globals'

const mockMongoClient = jest.fn()
const mockRegistry = jest.fn
jest.mock('mongodb', () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => {
      return {
        new: mockMongoClient
      }
    })
  }
})

jest.mock('prom-client', () => {
  return {
    Registry: jest.fn().mockImplementation(() => {
      return {
        new: mockRegistry
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
