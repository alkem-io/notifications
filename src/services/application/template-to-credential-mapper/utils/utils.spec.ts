import { AuthorizationCredential } from '@alkemio/client-lib';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';
import { getResourceId, getResourceIdByRole, ruleToCredential } from './utils';

describe('ruleToCredential', () => {
  it('returns undefined resource_id on unsupported role or missing data', () => {
    const payload = {
      hub: {
        id: 'hub',
      },
    } as ApplicationCreatedEventPayload;
    expect(
      ruleToCredential(
        {
          rule: {
            type: AuthorizationCredential.GlobalAdminCommunity,
            resource_id: '<>',
          },
        },
        payload
      )
    ).toEqual({
      type: AuthorizationCredential.GlobalAdminCommunity,
      resource_id: undefined,
    });
    expect(
      ruleToCredential(
        {
          rule: {
            type: AuthorizationCredential.ChallengeAdmin,
            resource_id: '<>',
          },
        },
        payload
      )
    ).toEqual({
      type: AuthorizationCredential.ChallengeAdmin,
      resource_id: undefined,
    });
  });
  it('returns correct response', () => {
    const payload = {
      hub: {
        id: 'hub',
      },
    } as ApplicationCreatedEventPayload;
    expect(
      ruleToCredential(
        {
          rule: {
            type: AuthorizationCredential.EcoverseAdmin,
            resource_id: '<>',
          },
        },
        payload
      )
    ).toEqual({
      type: AuthorizationCredential.EcoverseAdmin,
      resource_id: '<>',
    });
  });
  it('returns correct response on global admin', () => {
    const payload = {
      hub: {
        id: 'hub',
      },
    } as ApplicationCreatedEventPayload;
    expect(
      ruleToCredential(
        {
          rule: {
            type: AuthorizationCredential.GlobalAdmin,
            resource_id: '<>',
          },
        },
        payload
      )
    ).toEqual({
      type: AuthorizationCredential.GlobalAdmin,
      resource_id: '<>',
    });
  });
});

describe('getResourceId', () => {
  it('returns undefined on  global admin', () => {
    const payload = {
      hub: { id: 'hub' },
    } as ApplicationCreatedEventPayload;
    expect(
      getResourceId(AuthorizationCredential.GlobalAdmin, '<>', payload)
    ).toBeUndefined();
  });
  it('returns null on missing data', () => {
    const payload = {
      hub: { id: 'hub' },
    } as ApplicationCreatedEventPayload;
    expect(
      getResourceId(AuthorizationCredential.ChallengeAdmin, '<>', payload)
    ).toBeNull();
  });
  it('returns null on not supported role', () => {
    const payload = {
      hub: { id: 'hub' },
    } as ApplicationCreatedEventPayload;
    expect(
      getResourceId(AuthorizationCredential.GlobalAdminCommunity, '<>', payload)
    ).toBeNull();
  });
  describe('fill pattern', () => {
    it('returns id from payload on fill pattern', () => {
      const payload = {
        hub: {
          id: 'hub',
          challenge: {
            id: 'ch',
            opportunity: {
              id: 'opp',
            },
          },
        },
      } as ApplicationCreatedEventPayload;

      expect(
        getResourceId(AuthorizationCredential.EcoverseAdmin, '<>', payload)
      ).toEqual('hub');
      expect(
        getResourceId(AuthorizationCredential.ChallengeAdmin, '<>', payload)
      ).toEqual('ch');
      expect(
        getResourceId(AuthorizationCredential.OpportunityAdmin, '<>', payload)
      ).toEqual('opp');
    });
  });
  describe('non fill pattern', () => {
    it('returns id from template if exist on non fill pattern', () => {
      const payload = {
        hub: {
          id: 'hub',
          challenge: {
            id: 'ch',
            opportunity: {
              id: 'opp',
            },
          },
        },
      } as ApplicationCreatedEventPayload;

      expect(
        getResourceId(AuthorizationCredential.EcoverseAdmin, 'hub', payload)
      ).toEqual('hub');
    });
    it('returns null if id does not exist on non fill pattern', () => {
      const payload = {
        hub: {
          id: 'hub',
          challenge: {
            id: 'ch',
            opportunity: {
              id: 'opp',
            },
          },
        },
      } as ApplicationCreatedEventPayload;

      expect(
        getResourceId(
          AuthorizationCredential.EcoverseAdmin,
          'template-id',
          payload
        )
      ).toBeNull();
    });
  });
});

describe('getResourceIdByRole', () => {
  it('throws on missing hub id', () => {
    const payload = {} as ApplicationCreatedEventPayload;
    expect(() =>
      getResourceIdByRole(AuthorizationCredential.EcoverseAdmin, payload)
    ).toThrowError('"id" field of "hub" not found in the payload');
  });
  it('return undefined on global admin', () => {
    const payload = {
      hub: { id: 'hub' },
    } as ApplicationCreatedEventPayload;
    expect(
      getResourceIdByRole(AuthorizationCredential.GlobalAdmin, payload)
    ).toBeUndefined();
  });
  describe('return null on missing data in payload', () => {
    it('missing challenge', () => {
      const payload = {
        hub: { id: 'hub' },
      } as ApplicationCreatedEventPayload;
      expect(
        getResourceIdByRole(AuthorizationCredential.ChallengeAdmin, payload)
      ).toBeNull();
    });
    it('missing opportunity', () => {
      const payload = {
        hub: { id: 'hub' },
      } as ApplicationCreatedEventPayload;
      expect(
        getResourceIdByRole(AuthorizationCredential.OpportunityAdmin, payload)
      ).toBeNull();
    });
  });
  it('return null on not supported role', () => {
    const payload = {
      hub: { id: 'hub' },
    } as ApplicationCreatedEventPayload;
    expect(
      getResourceIdByRole(AuthorizationCredential.GlobalAdminCommunity, payload)
    ).toBeNull();
  });
  describe('returns correct resourceId', () => {
    it('hub', () => {
      const payload = {
        hub: {
          id: 'hub-id',
        },
      } as ApplicationCreatedEventPayload;
      expect(
        getResourceIdByRole(AuthorizationCredential.EcoverseAdmin, payload)
      ).toEqual('hub-id');
    });
    it('challenge', () => {
      const payload = {
        hub: {
          id: 'hub',
          challenge: {
            id: 'challenge-id',
          },
        },
      } as ApplicationCreatedEventPayload;
      expect(
        getResourceIdByRole(AuthorizationCredential.ChallengeAdmin, payload)
      ).toEqual('challenge-id');
    });
    it('opportunity', () => {
      const payload = {
        hub: {
          id: 'hub',
          challenge: {
            opportunity: {
              id: 'opportunity-id',
            },
          },
        },
      } as ApplicationCreatedEventPayload;
      expect(
        getResourceIdByRole(AuthorizationCredential.OpportunityAdmin, payload)
      ).toEqual('opportunity-id');
    });
    it('applicant', () => {
      const payload = {
        applicantID: 'applicant',
        hub: {
          id: 'hub',
        },
      } as ApplicationCreatedEventPayload;
      expect(
        getResourceIdByRole(AuthorizationCredential.UserSelfManagement, payload)
      ).toEqual('applicant');
    });
  });
});
