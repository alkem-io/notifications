import { SpaceType } from "@src/common/enums/space.type";

export type ContributorPayload = {
  id: string;
  nameID: string;
  profile: {
    displayName: string;
    url: string;
  }
};
