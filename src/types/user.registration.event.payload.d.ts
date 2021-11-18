// toDo: fix this type, it is completely detached from the template and its purpose is to define the template. Derive from base event payload.
export type UserRegistrationEventPayload = {
  userID: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
};
