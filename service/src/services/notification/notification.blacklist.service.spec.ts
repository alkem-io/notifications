import { Test } from '@nestjs/testing';
import { NotificationBlacklistService } from './notification.blacklist.service';
import { ConfigService } from '@nestjs/config';
import { MockConfigServiceProvider, MockWinstonProvider } from '@test/mocks';
import { User } from '@src/core/models';

describe('NotificationBlacklistService', () => {
  let service: NotificationBlacklistService;

  // Helper function to create mock users
  const createUser = (email: string, id?: string): User => ({
    email,
    id: id || `user-${email}`,
    firstName: 'Test',
    lastName: 'User',
    profile: {
      displayName: 'Test User',
      url: '/user/test',
    },
  });

  // Helper to create service with specific config
  const createServiceWithConfig = async (blacklistConfig: string) => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              email: { blacklist: blacklistConfig },
            }),
          },
        },
        MockWinstonProvider,
        NotificationBlacklistService,
      ],
    }).compile();

    return moduleRef.get<NotificationBlacklistService>(
      NotificationBlacklistService
    );
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MockConfigServiceProvider,
        MockWinstonProvider,
        NotificationBlacklistService,
      ],
    }).compile();

    service = moduleRef.get<NotificationBlacklistService>(
      NotificationBlacklistService
    );
  });

  describe('Empty blacklist configuration', () => {
    it('should allow all recipients when blacklist is empty', async () => {
      service = await createServiceWithConfig('');

      const recipients = [
        createUser('user1@example.com'),
        createUser('user2@example.com'),
      ];

      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(2);
      expect(filtered).toEqual(recipients);
    });

    it('should allow all recipients when blacklist is not configured', async () => {
      service = await createServiceWithConfig('');

      const recipients = [createUser('user1@example.com')];
      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(1);
    });
  });

  describe('Single blacklisted recipient', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig('blocked@example.org');
    });

    it('should block a single blacklisted recipient', () => {
      const recipients = [createUser('blocked@example.org')];
      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(0);
    });

    it('should be case-insensitive', () => {
      const recipients = [
        createUser('BLOCKED@example.org'),
        createUser('Blocked@Example.Org'),
      ];
      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(0);
    });

    it('should allow non-blacklisted recipients', () => {
      const recipients = [
        createUser('allowed@example.com'),
        createUser('another@example.com'),
      ];
      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('Mixed recipients (blacklisted + allowed)', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig(
        'blocked1@example.org,blocked2@example.org'
      );
    });

    it('should filter out blacklisted recipients and keep allowed ones', () => {
      const recipients = [
        createUser('blocked1@example.org'),
        createUser('allowed@example.com'),
        createUser('blocked2@example.org'),
        createUser('another-allowed@example.com'),
      ];

      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(2);
      expect(filtered[0].email).toBe('allowed@example.com');
      expect(filtered[1].email).toBe('another-allowed@example.com');
    });

    it('should handle all recipients being blacklisted', () => {
      const recipients = [
        createUser('blocked1@example.org'),
        createUser('blocked2@example.org'),
      ];

      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Multiple blacklist entries', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig(
        'block1@test.com,block2@test.com,block3@test.com'
      );
    });

    it('should block all configured addresses', () => {
      const recipients = [
        createUser('block1@test.com'),
        createUser('block2@test.com'),
        createUser('block3@test.com'),
      ];

      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(0);
    });

    it('should handle partial matches correctly', () => {
      const recipients = [
        createUser('block1@test.com'), // blocked
        createUser('allowed@test.com'), // allowed
        createUser('block2@test.com'), // blocked
      ];

      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].email).toBe('allowed@test.com');
    });
  });

  describe('Edge cases', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig('blocked@example.org');
    });

    it('should handle recipients with no email address', () => {
      const recipients = [
        createUser('allowed@example.com'),
        {
          id: 'user-no-email',
          firstName: 'No',
          lastName: 'Email',
          profile: { displayName: 'No Email', url: '/user/no-email' },
        } as User,
      ];

      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(2); // Both should be included
    });

    it('should handle empty recipients array', () => {
      const filtered = service.filterRecipients([]);
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Configuration with whitespace and duplicates', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig(
        '  blocked@example.org , blocked@example.org,  another@test.com  '
      );
    });

    it('should handle whitespace in configuration', () => {
      const recipients = [
        createUser('blocked@example.org'),
        createUser('another@test.com'),
      ];

      const filtered = service.filterRecipients(recipients);
      expect(filtered).toHaveLength(0);
    });

    it('should deduplicate blacklist entries', () => {
      // The Set in the service should handle duplicates
      expect(service.getBlacklistSize()).toBe(2); // Only 2 unique emails
    });
  });

  describe('Invalid email formats in configuration', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig(
        'valid@example.com,invalid-email,@invalid.com,no-at-sign'
      );
    });

    it('should ignore invalid email addresses and only block valid ones', () => {
      const recipients = [
        createUser('valid@example.com'), // should be blocked
        createUser('invalid-email'), // should NOT be blocked (invalid format ignored in config)
        createUser('another@example.com'), // should be allowed
      ];

      const filtered = service.filterRecipients(recipients);
      // Only valid@example.com should be blocked
      expect(filtered).toHaveLength(2);
      expect(
        filtered.find(u => u.email === 'valid@example.com')
      ).toBeUndefined();
    });
  });

  describe('isBlacklisted method', () => {
    beforeEach(async () => {
      service = await createServiceWithConfig(
        'blocked@example.org,another@test.com'
      );
    });

    it('should return true for blacklisted email', () => {
      expect(service.isBlacklisted('blocked@example.org')).toBe(true);
      expect(service.isBlacklisted('another@test.com')).toBe(true);
    });

    it('should return false for non-blacklisted email', () => {
      expect(service.isBlacklisted('allowed@example.com')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(service.isBlacklisted('BLOCKED@example.org')).toBe(true);
      expect(service.isBlacklisted('Another@Test.Com')).toBe(true);
    });

    it('should return false for empty email', () => {
      expect(service.isBlacklisted('')).toBe(false);
    });

    it('should handle null/undefined gracefully', () => {
      expect(service.isBlacklisted(null as any)).toBe(false);
      expect(service.isBlacklisted(undefined as any)).toBe(false);
    });
  });

  describe('getBlacklistSize method', () => {
    it('should return 0 for empty blacklist', async () => {
      service = await createServiceWithConfig('');

      expect(service.getBlacklistSize()).toBe(0);
    });

    it('should return correct count for single entry', async () => {
      service = await createServiceWithConfig('blocked@example.org');

      expect(service.getBlacklistSize()).toBe(1);
    });

    it('should return correct count for multiple entries', async () => {
      service = await createServiceWithConfig(
        'one@test.com,two@test.com,three@test.com'
      );

      expect(service.getBlacklistSize()).toBe(3);
    });
  });
});
