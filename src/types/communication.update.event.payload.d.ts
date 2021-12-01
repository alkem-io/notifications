// toDo: fix this type, it is completely detached from the template and its purpose is to define the template. Derive from base event payload.
export type CommunicationUpdateEventPayload = {
  update: {
    id: string;
    createdBy: string;
  };
  community: {
    name: string;
    type: CommunityType;
  };
  hub: {
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
};
