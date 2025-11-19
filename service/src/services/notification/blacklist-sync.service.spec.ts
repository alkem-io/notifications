import { Test } from '@nestjs/testing';
import { BlacklistSyncService } from './blacklist-sync.service';
import { ConfigService } from '@nestjs/config';
import { MockWinstonProvider } from '@test/mocks';
import { GraphQLClient } from 'graphql-request';

// Mock GraphQLClient
jest.mock('graphql-request');

describe('BlacklistSyncService', () => {
  let service: BlacklistSyncService;
  let mockGraphQLClient: jest.Mocked<GraphQLClient>;

  const mockSuccessResponse = {
    platform: {
      id: 'test-platform-id',
      settings: {
        integration: {
          notificationEmailBlacklist: [
            'blocked1@example.com',
            'blocked2@example.com',
            'BLOCKED3@EXAMPLE.COM', // Test case normalization
          ],
        },
      },
    },
  };

  const createServiceWithConfig = async (config: any) => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              endpoint: 'http://localhost:3000/graphql',
              blacklist_sync: config,
            }),
          },
        },
        MockWinstonProvider,
        BlacklistSyncService,
      ],
    }).compile();

    return moduleRef.get<BlacklistSyncService>(BlacklistSyncService);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset GraphQLClient mock
    mockGraphQLClient = {
      request: jest.fn(),
    } as any;
    (
      GraphQLClient as jest.MockedClass<typeof GraphQLClient>
    ).mockImplementation(() => mockGraphQLClient);
  });

  describe('Initialization with sync enabled', () => {
    it('should initialize with default configuration when sync is enabled', async () => {
      service = await createServiceWithConfig({ enabled: true });

      expect(service.isSyncEnabled()).toBe(true);
      expect(GraphQLClient).toHaveBeenCalledWith(
        'http://localhost:3000/graphql',
        expect.any(Object)
      );
    });

    it('should use custom configuration values', async () => {
      service = await createServiceWithConfig({
        enabled: true,
        interval_ms: 60000,
        initial_backoff_ms: 500,
        max_backoff_ms: 60000,
      });

      expect(service.isSyncEnabled()).toBe(true);
    });
  });

  describe('Initialization with sync disabled', () => {
    it('should not initialize GraphQL client when sync is disabled', async () => {
      service = await createServiceWithConfig({ enabled: false });

      expect(service.isSyncEnabled()).toBe(false);
      expect(service.getCurrentSnapshot()).toBeNull();
    });
  });

  describe('Happy path sync behavior', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig({ enabled: true });
    });

    it('should fetch and normalize blacklist successfully', async () => {
      mockGraphQLClient.request.mockResolvedValueOnce(mockSuccessResponse);

      // Trigger onModuleInit to perform initial sync
      await service.onModuleInit();

      // Wait a bit for async operation
      await new Promise(resolve => setTimeout(resolve, 100));

      const snapshot = service.getCurrentSnapshot();
      expect(snapshot).not.toBeNull();
      expect(snapshot?.emails.size).toBe(3);
      expect(snapshot?.emails.has('blocked1@example.com')).toBe(true);
      expect(snapshot?.emails.has('blocked2@example.com')).toBe(true);
      expect(snapshot?.emails.has('blocked3@example.com')).toBe(true); // Normalized
      expect(snapshot?.platformId).toBe('test-platform-id');
    });

    it('should deduplicate email addresses', async () => {
      const responseWithDuplicates = {
        platform: {
          id: 'test-platform-id',
          settings: {
            integration: {
              notificationEmailBlacklist: [
                'blocked@example.com',
                'BLOCKED@EXAMPLE.COM',
                'blocked@example.com',
              ],
            },
          },
        },
      };

      mockGraphQLClient.request.mockResolvedValueOnce(responseWithDuplicates);
      await service.onModuleInit();
      await new Promise(resolve => setTimeout(resolve, 100));

      const snapshot = service.getCurrentSnapshot();
      expect(snapshot?.emails.size).toBe(1);
      expect(snapshot?.emails.has('blocked@example.com')).toBe(true);
    });

    it('should handle empty blacklist correctly', async () => {
      const emptyResponse = {
        platform: {
          id: 'test-platform-id',
          settings: {
            integration: {
              notificationEmailBlacklist: [],
            },
          },
        },
      };

      mockGraphQLClient.request.mockResolvedValueOnce(emptyResponse);
      await service.onModuleInit();
      await new Promise(resolve => setTimeout(resolve, 100));

      const snapshot = service.getCurrentSnapshot();
      expect(snapshot).not.toBeNull();
      expect(snapshot?.emails.size).toBe(0);
    });
  });

  describe('Normalization and validation', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig({ enabled: true });
    });

    it('should filter out invalid email addresses', async () => {
      const responseWithInvalidEmails = {
        platform: {
          id: 'test-platform-id',
          settings: {
            integration: {
              notificationEmailBlacklist: [
                'valid@example.com',
                'invalid-email', // No @
                '@no-local-part.com',
                'no-domain@', // No domain
                'no-tld@example',
                '  valid2@example.com  ', // With whitespace (should be trimmed)
              ],
            },
          },
        },
      };

      mockGraphQLClient.request.mockResolvedValueOnce(
        responseWithInvalidEmails
      );
      await service.onModuleInit();
      await new Promise(resolve => setTimeout(resolve, 100));

      const snapshot = service.getCurrentSnapshot();
      expect(snapshot?.emails.size).toBe(2);
      expect(snapshot?.emails.has('valid@example.com')).toBe(true);
      expect(snapshot?.emails.has('valid2@example.com')).toBe(true);
    });

    it('should trim and lowercase all email addresses', async () => {
      const responseWithVariations = {
        platform: {
          id: 'test-platform-id',
          settings: {
            integration: {
              notificationEmailBlacklist: [
                '  USER@EXAMPLE.COM  ',
                'AnotherUser@Example.Com',
              ],
            },
          },
        },
      };

      mockGraphQLClient.request.mockResolvedValueOnce(responseWithVariations);
      await service.onModuleInit();
      await new Promise(resolve => setTimeout(resolve, 100));

      const snapshot = service.getCurrentSnapshot();
      expect(snapshot?.emails.has('user@example.com')).toBe(true);
      expect(snapshot?.emails.has('anotheruser@example.com')).toBe(true);
    });

    it('should enforce 250 entry limit', async () => {
      const largeBlacklist = Array.from(
        { length: 300 },
        (_, i) => `user${i}@example.com`
      );
      const responseWithManyEmails = {
        platform: {
          id: 'test-platform-id',
          settings: {
            integration: {
              notificationEmailBlacklist: largeBlacklist,
            },
          },
        },
      };

      mockGraphQLClient.request.mockResolvedValueOnce(responseWithManyEmails);
      await service.onModuleInit();
      await new Promise(resolve => setTimeout(resolve, 100));

      const snapshot = service.getCurrentSnapshot();
      expect(snapshot?.emails.size).toBe(250);
    });
  });

  describe('Failure scenarios', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig({ enabled: true });
    });

    it('should handle network errors gracefully', async () => {
      mockGraphQLClient.request.mockRejectedValueOnce(
        new Error('Network error')
      );

      await service.onModuleInit();
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not have a snapshot on first failure
      const snapshot = service.getCurrentSnapshot();
      expect(snapshot).toBeNull();
      expect(service.getConsecutiveFailures()).toBeGreaterThan(0);
    });

    it('should retain last successful snapshot on subsequent failures', async () => {
      // First successful sync
      mockGraphQLClient.request.mockResolvedValueOnce(mockSuccessResponse);
      await service.onModuleInit();
      await new Promise(resolve => setTimeout(resolve, 100));

      const firstSnapshot = service.getCurrentSnapshot();
      expect(firstSnapshot).not.toBeNull();
      expect(firstSnapshot?.emails.size).toBe(3);

      // Simulate failure on next sync
      mockGraphQLClient.request.mockRejectedValueOnce(
        new Error('Network error')
      );

      // Manually trigger another sync
      await (service as any).performSync();
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should still have the old snapshot
      const retainedSnapshot = service.getCurrentSnapshot();
      expect(retainedSnapshot).toEqual(firstSnapshot);
      expect(service.getConsecutiveFailures()).toBe(1);
    });

    it('should reset consecutive failures on successful sync after failures', async () => {
      // First failure
      mockGraphQLClient.request.mockRejectedValueOnce(
        new Error('Network error')
      );
      await service.onModuleInit();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(service.getConsecutiveFailures()).toBeGreaterThan(0);

      // Successful sync
      mockGraphQLClient.request.mockResolvedValueOnce(mockSuccessResponse);
      await (service as any).performSync();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(service.getConsecutiveFailures()).toBe(0);
    });

    it('should handle 401 authentication errors', async () => {
      const authError = new Error('Unauthorized');
      (authError as any).response = { status: 401 };

      mockGraphQLClient.request.mockRejectedValueOnce(authError);
      await service.onModuleInit();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(service.getConsecutiveFailures()).toBeGreaterThan(0);
    });
  });

  describe('Module lifecycle', () => {
    it('should start periodic sync on module init', async () => {
      service = await createServiceWithConfig({
        enabled: true,
        interval_ms: 1000,
      });

      mockGraphQLClient.request.mockResolvedValue(mockSuccessResponse);
      await service.onModuleInit();

      // Initial sync should happen
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockGraphQLClient.request).toHaveBeenCalled();
    });

    it('should clean up interval on module destroy', async () => {
      service = await createServiceWithConfig({ enabled: true });
      mockGraphQLClient.request.mockResolvedValue(mockSuccessResponse);
      await service.onModuleInit();

      service.onModuleDestroy();

      // After destroy, periodic sync should stop
      const callCount = mockGraphQLClient.request.mock.calls.length;
      await new Promise(resolve => setTimeout(resolve, 500));
      // Call count should not increase significantly after destroy
      expect(mockGraphQLClient.request.mock.calls.length).toBeLessThanOrEqual(
        callCount + 1
      );
    });
  });
});
