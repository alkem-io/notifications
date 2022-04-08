export type HubPayload = {
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
