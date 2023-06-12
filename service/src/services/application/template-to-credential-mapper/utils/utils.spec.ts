describe.skip('ruleToCredentialCriteria', () => {
  it('returns undefined resource_id on unsupported role or missing data', () => {
    // const payload = {
    //   space: {
    //     id: 'space',
    //   },
    // } as ApplicationCreatedEventPayload;
    // expect(
    //   ruleToCredentialCriteria(
    //     {
    //       rule: {
    //         type: AuthorizationCredential.GlobalAdminCommunity,
    //         resource_id: '<>',
    //       },
    //     },
    //     payload
    //   )
    // ).toEqual({
    //   type: AuthorizationCredential.GlobalAdminCommunity,
    //   resource_id: undefined,
    // });
    // expect(
    //   ruleToCredentialCriteria(
    //     {
    //       rule: {
    //         type: AuthorizationCredential.ChallengeAdmin,
    //         resource_id: '<>',
    //       },
    //     },
    //     payload
    //   )
    // ).toEqual({
    //   type: AuthorizationCredential.ChallengeAdmin,
    //   resource_id: undefined,
    // });
  });
  it('returns correct response', () => {
    // const payload = {
    //   space: {
    //     id: 'space',
    //   },
    // } as ApplicationCreatedEventPayload;
    // expect(
    //   ruleToCredentialCriteria(
    //     {
    //       rule: {
    //         type: AuthorizationCredential.HubAdmin,
    //         resource_id: '<>',
    //       },
    //     },
    //     payload
    //   )
    // ).toEqual({
    //   type: AuthorizationCredential.HubAdmin,
    //   resource_id: '<>',
    // });
  });
  it('returns correct response on global admin', () => {
    // const payload = {
    //   space: {
    //     id: 'space',
    //   },
    // } as ApplicationCreatedEventPayload;
    // expect(
    //   ruleToCredentialCriteria(
    //     {
    //       rule: {
    //         type: AuthorizationCredential.GlobalAdmin,
    //         resource_id: '<>',
    //       },
    //     },
    //     payload
    //   )
    // ).toEqual({
    //   type: AuthorizationCredential.GlobalAdmin,
    //   resource_id: '<>',
    // });
  });
});

// describe.skip('getResourceId', () => {
//   it('returns undefined on  global admin', () => {
//     const payload = {
//       space: { id: 'space' },
//     } as ApplicationCreatedEventPayload;
//     expect(
//       getResourceId(AuthorizationCredential.GlobalAdmin, '<>', payload)
//     ).toBeUndefined();
//   });
//   it('returns null on missing data', () => {
//     const payload = {
//       space: { id: 'space' },
//     } as ApplicationCreatedEventPayload;
//     expect(
//       getResourceId(AuthorizationCredential.ChallengeAdmin, '<>', payload)
//     ).toBeNull();
//   });
//   it('returns null on not supported role', () => {
//     const payload = {
//       space: { id: 'space' },
//     } as ApplicationCreatedEventPayload;
//     expect(
//       getResourceId(AuthorizationCredential.GlobalAdminCommunity, '<>', payload)
//     ).toBeNull();
//   });
//   describe.skip('fill pattern', () => {
//     it('returns id from payload on fill pattern', () => {
//       const payload = {
//         space: {
//           id: 'space',
//           challenge: {
//             id: 'ch',
//             opportunity: {
//               id: 'opp',
//             },
//           },
//         },
//       } as ApplicationCreatedEventPayload;
//       expect(
//         getResourceId(AuthorizationCredential.HubAdmin, '<>', payload)
//       ).toEqual('space');
//       expect(
//         getResourceId(AuthorizationCredential.ChallengeAdmin, '<>', payload)
//       ).toEqual('ch');
//       expect(
//         getResourceId(AuthorizationCredential.OpportunityAdmin, '<>', payload)
//       ).toEqual('opp');
//     });
//   });
//   describe.skip('non fill pattern', () => {
//     it('returns id from template if exist on non fill pattern', () => {
//       const payload = {
//         space: {
//           id: 'space',
//           challenge: {
//             id: 'ch',
//             opportunity: {
//               id: 'opp',
//             },
//           },
//         },
//       } as ApplicationCreatedEventPayload;
//       expect(
//         getResourceId(AuthorizationCredential.HubAdmin, 'space', payload)
//       ).toEqual('space');
//     });
//     it('returns null if id does not exist on non fill pattern', () => {
//       const payload = {
//         space: {
//           id: 'space',
//           challenge: {
//             id: 'ch',
//             opportunity: {
//               id: 'opp',
//             },
//           },
//         },
//       } as ApplicationCreatedEventPayload;
//       expect(
//         getResourceId(
//           AuthorizationCredential.HubAdmin,
//           'template-id',
//           payload
//         )
//       ).toBeNull();
//     });
//   });
// });

// describe.skip('getResourceIdByRole', () => {
//   it('throws on missing hub id', () => {
//     const payload = {} as ApplicationCreatedEventPayload;
//     expect(() =>
//       getResourceId(AuthorizationCredential.HubAdmin, payload)
//     ).toThrowError('"id" field of "space" not found in the payload');
//   });
//   it('return undefined on global admin', () => {
//     const payload = {
//       space: { id: 'space' },
//     } as ApplicationCreatedEventPayload;
//     expect(
//       getResourceId(AuthorizationCredential.GlobalAdmin, payload)
//     ).toBeUndefined();
//   });
//   describe.skip('return null on missing data in payload', () => {
//     it('missing challenge', () => {
//       const payload = {
//         space: { id: 'space' },
//       } as ApplicationCreatedEventPayload;
//       expect(
//         getResourceId(AuthorizationCredential.ChallengeAdmin, payload)
//       ).toBeNull();
//     });
//     it('missing opportunity', () => {
//       const payload = {
//         space: { id: 'space' },
//       } as ApplicationCreatedEventPayload;
//       expect(
//         getResourceId(AuthorizationCredential.OpportunityAdmin, payload)
//       ).toBeNull();
//     });
//   });
//   it('return null on not supported role', () => {
//     const payload = {
//       space: { id: 'space' },
//     } as ApplicationCreatedEventPayload;
//     expect(
//       getResourceId(AuthorizationCredential.GlobalAdminCommunity, payload)
//     ).toBeNull();
//   });
//   describe.skip('returns correct resourceId', () => {
//     it('space', () => {
//       const payload = {
//         space: {
//           id: 'hub-id',
//         },
//       } as ApplicationCreatedEventPayload;
//       expect(
//         getResourceId(AuthorizationCredential.HubAdmin, payload)
//       ).toEqual('hub-id');
//     });
//     it('challenge', () => {
//       const payload = {
//         space: {
//           id: 'space',
//           challenge: {
//             id: 'challenge-id',
//           },
//         },
//       } as ApplicationCreatedEventPayload;
//       expect(
//         getResourceId(AuthorizationCredential.ChallengeAdmin, payload)
//       ).toEqual('challenge-id');
//     });
//     it('opportunity', () => {
//       const payload = {
//         space: {
//           id: 'space',
//           challenge: {
//             opportunity: {
//               id: 'opportunity-id',
//             },
//           },
//         },
//       } as ApplicationCreatedEventPayload;
//       expect(
//         getResourceId(AuthorizationCredential.OpportunityAdmin, payload)
//       ).toEqual('opportunity-id');
//     });
//     it('applicant', () => {
//       const payload = {
//         applicantID: 'applicant',
//         space: {
//           id: 'space',
//         },
//       } as ApplicationCreatedEventPayload;
//       expect(
//         getResourceId(AuthorizationCredential.UserSelfManagement, payload)
//       ).toEqual('applicant');
//     });
//   });
// });
