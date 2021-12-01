// toDo: fix this type, it is completely detached from the template and its purpose is to define the template. Derive from base event payload.
export type CommunicationDiscussionCreatedEventPayload = {
  discussion: {
    id: string;
    createdBy: string;
  };
  community: {
    name: string;
    type: CommunityType;
  };
  hub: {
    id: string;
    nameeID: string;
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
