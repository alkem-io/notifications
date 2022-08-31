export type HubPayload = {
  // todo remove when BaseEventPayload interface is defined
  id: string;
  nameID: string;
  challenge?: {
    id: string;
    nameID: string;
    opportunity?: {
      nameID: string;
      id: string;
    };
  };
};
