export type SpacePayload = {
  id: string;
  nameID: string;
  type: string;
  profile: {
    displayName: string;
    url: string;
  }
  adminURL: string;
};
