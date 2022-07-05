export type CommunityCollaborationInterestPayload = {
  userID: string;
  community: {
    name: string;
  };
  opportunity: {
    nameID: string;
  };
};
