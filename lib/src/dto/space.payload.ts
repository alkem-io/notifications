import { SpaceLevel } from "@alkemio/client-lib";

export type SpacePayload = {
  id: string;
  nameID: string;
  level: SpaceLevel;
  profile: {
    displayName: string;
    url: string;
  }
  adminURL: string;
};
