import { SpaceType } from "@alkemio/client-lib";

export type SpacePayload = {
  id: string;
  nameID: string;
  type: SpaceType;
  profile: {
    displayName: string;
    url: string;
  }
  adminURL: string;
};
