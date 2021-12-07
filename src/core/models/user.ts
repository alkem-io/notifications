export type User = {
  id: string;
  nameID: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  preferences?: UserPreference[];
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
