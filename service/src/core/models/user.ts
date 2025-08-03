export type User = Contributor & {
  firstName: string;
  lastName: string;
  email: string;
};

export type Contributor = {
  id: string;
  nameID: string;
  profile: {
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
