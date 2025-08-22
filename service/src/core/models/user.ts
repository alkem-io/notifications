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
