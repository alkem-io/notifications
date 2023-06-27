import { JourneyType } from "@src/common/enums/journey.type";

export type JourneyPayload = {
  spaceID: string;
  spaceNameID: string;
  displayName: string;
  type: JourneyType;
  challenge?: {
    id: string;
    nameID: string;
    opportunity?: {
      nameID: string;
      id: string;
    };
  };
};
