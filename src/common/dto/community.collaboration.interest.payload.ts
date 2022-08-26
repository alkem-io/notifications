export type CommunityCollaborationInterestPayload = {
  userID: string;
  opportunity: {
    id: string;
    name: string;
    communityName: string | undefined;
  };
  relation: {
    role: string;
    description: string;
  };
};
