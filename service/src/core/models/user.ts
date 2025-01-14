export type User = Contributor & {
  firstName: string;
  lastName: string;
  email: string;
  preferences?: UserPreference[];
  settings?: UserSettings;
};

export type Contributor = {
  id: string;
  nameID: string;
  profile: {
    id: string;
    displayName: string;
    url: string;
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
    url: string;
  };
};

export type PlatformUser = {
  firstName: string;
  lastName: string;
  email: string;
};

export const isExistingAlkemioUser = (
  user: User | PlatformUser
): user is User => {
  return (user as User).nameID !== undefined;
};

export type UserPreference = {
  definition: UserPreferenceDefinition;
  value: string;
};

export type UserSettings = {
  communication: {
    allowOtherUsersToSendMessages: boolean;
  };
};

export type UserPreferenceDefinition = {
  group: string;
  displayName: string;
  description: string;
  valueType: string;
  type: string;
};
