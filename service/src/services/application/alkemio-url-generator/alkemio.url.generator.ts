import { Injectable } from '@nestjs/common';
import { PlatformUser, User, isExistingAlkemioUser } from '@src/core/models';

@Injectable()
export class AlkemioUrlGenerator {
  createUserNotificationPreferencesURL(user: User | PlatformUser): string {
    if (!isExistingAlkemioUser(user)) {
      return '';
    }
    const userProfileURL = (user as User).profile.url;
    return `${userProfileURL}/settings/notifications`;
  }
}
