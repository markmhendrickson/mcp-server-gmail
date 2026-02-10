import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLabel, updateLabel, deleteLabel, findLabelByName, getOrCreateLabel } from '../../src/label-manager.js'

describe('Label Manager', () => {
  describe('createLabel', () => {
    it('should create a label with valid parameters', async () => {
      const mockGmail = {
        users: {
          labels: {
            create: vi.fn().mockResolvedValue({
              data: {
                id: 'Label_123',
                name: 'Test Label',
                type: 'user'
              }
            })
          }
        }
      }

      const result = await createLabel(mockGmail as any, 'me', 'Test Label')

      expect(result).toBeDefined()
      expect(result.id).toBe('Label_123')
      expect(result.name).toBe('Test Label')
      expect(mockGmail.users.labels.create).toHaveBeenCalledWith({
        userId: 'me',
        requestBody: expect.objectContaining({
          name: 'Test Label'
        })
      })
    })

    it('should handle label creation errors', async () => {
      const mockGmail = {
        users: {
          labels: {
            create: vi.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }

      await expect(createLabel(mockGmail as any, 'me', 'Test Label')).rejects.toThrow('API Error')
    })
  })

  describe('findLabelByName', () => {
    it('should find label by exact name', async () => {
      const mockGmail = {
        users: {
          labels: {
            list: vi.fn().mockResolvedValue({
              data: {
                labels: [
                  { id: 'Label_1', name: 'Work' },
                  { id: 'Label_2', name: 'Personal' },
                  { id: 'Label_3', name: 'Test' }
                ]
              }
            })
          }
        }
      }

      const result = await findLabelByName(mockGmail as any, 'me', 'Work')

      expect(result).toBeDefined()
      expect(result?.id).toBe('Label_1')
      expect(result?.name).toBe('Work')
    })

    it('should return null if label not found', async () => {
      const mockGmail = {
        users: {
          labels: {
            list: vi.fn().mockResolvedValue({
              data: {
                labels: [
                  { id: 'Label_1', name: 'Work' }
                ]
              }
            })
          }
        }
      }

      const result = await findLabelByName(mockGmail as any, 'me', 'Nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('getOrCreateLabel', () => {
    it('should return existing label if found', async () => {
      const mockGmail = {
        users: {
          labels: {
            list: vi.fn().mockResolvedValue({
              data: {
                labels: [
                  { id: 'Label_1', name: 'Existing' }
                ]
              }
            }),
            create: vi.fn()
          }
        }
      }

      const result = await getOrCreateLabel(mockGmail as any, 'me', 'Existing')

      expect(result.id).toBe('Label_1')
      expect(result.name).toBe('Existing')
      expect(mockGmail.users.labels.create).not.toHaveBeenCalled()
    })

    it('should create label if not found', async () => {
      const mockGmail = {
        users: {
          labels: {
            list: vi.fn().mockResolvedValue({
              data: {
                labels: []
              }
            }),
            create: vi.fn().mockResolvedValue({
              data: {
                id: 'Label_New',
                name: 'New Label',
                type: 'user'
              }
            })
          }
        }
      }

      const result = await getOrCreateLabel(mockGmail as any, 'me', 'New Label')

      expect(result.id).toBe('Label_New')
      expect(result.name).toBe('New Label')
      expect(mockGmail.users.labels.create).toHaveBeenCalled()
    })
  })

  describe('updateLabel', () => {
    it('should update label properties', async () => {
      const mockGmail = {
        users: {
          labels: {
            update: vi.fn().mockResolvedValue({
              data: {
                id: 'Label_1',
                name: 'Updated Label',
                type: 'user'
              }
            })
          }
        }
      }

      const result = await updateLabel(mockGmail as any, 'me', 'Label_1', { name: 'Updated Label' })

      expect(result.name).toBe('Updated Label')
      expect(mockGmail.users.labels.update).toHaveBeenCalledWith({
        userId: 'me',
        id: 'Label_1',
        requestBody: expect.objectContaining({
          name: 'Updated Label'
        })
      })
    })
  })

  describe('deleteLabel', () => {
    it('should delete label successfully', async () => {
      const mockGmail = {
        users: {
          labels: {
            delete: vi.fn().mockResolvedValue({ data: {} })
          }
        }
      }

      await deleteLabel(mockGmail as any, 'me', 'Label_1')

      expect(mockGmail.users.labels.delete).toHaveBeenCalledWith({
        userId: 'me',
        id: 'Label_1'
      })
    })

    it('should handle deletion errors', async () => {
      const mockGmail = {
        users: {
          labels: {
            delete: vi.fn().mockRejectedValue(new Error('Label not found'))
          }
        }
      }

      await expect(deleteLabel(mockGmail as any, 'me', 'Invalid')).rejects.toThrow('Label not found')
    })
  })
})
