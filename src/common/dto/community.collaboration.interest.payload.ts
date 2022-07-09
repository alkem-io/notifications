export type CommunityCollaborationInterestPayload = {
  userID: string;
  opportunity: {
    id: string;
    name: string;
    communityName: string;
  };
};
