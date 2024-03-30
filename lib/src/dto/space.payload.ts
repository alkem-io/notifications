import { SpaceType } from "@src/common/enums/space.type";

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
