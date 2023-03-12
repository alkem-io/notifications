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
