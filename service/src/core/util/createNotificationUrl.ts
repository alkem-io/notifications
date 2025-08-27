import { PlatformUser, User } from '../models/user';

export const isExistingAlkemioUser = (
  user: User | PlatformUser
): user is User => {
  return (user as User).id !== undefined;
};

export const createUserNotificationPreferencesURL = (
  user: User | PlatformUser
): string => {
  if (!isExistingAlkemioUser(user)) {
    return '';
  }
  const userProfileURL = (user as User).profile.url;
  return `${userProfileURL}/settings/notifications`;
};
