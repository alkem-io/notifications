export type User = {
  id: string;
  nameID: string;
  firstName: string;
  lastName: string;
  email: string;
  preferences?: UserPreference[];
  profile: {
    id: string;
    displayName: string;
  };
};

export type InternalUser = {
  id: string;
  nameID: string;
  firstName: string;
  lastName: string;
  email: string;
  preferences?: UserPreference[];
  profile: {
    id: string;
    displayName: string;
  };
};

export type ExternalUser = {
  firstName: string;
  lastName: string;
  email: string;
};

export const isUser = (user: User | ExternalUser): user is User => {
  return (user as User).nameID !== undefined;
};

export type UserPreference = {
  definition: UserPreferenceDefinition;
  value: string;
};

export type UserPreferenceDefinition = {
  group: string;
  displayName: string;
  description: string;
  valueType: string;
  type: string;
};
