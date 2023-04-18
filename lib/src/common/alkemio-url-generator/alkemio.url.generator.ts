import { JourneyPayload } from '@src/dto/journey.payload';
import { JourneyType } from '../enums/journey.type';

export const createJourneyURL = (
  webclientEndpoint: string,
  journey: JourneyPayload
): string => {
  const baseURL = `${webclientEndpoint}/${journey.hubNameID}`;
  switch (journey.type) {
    case JourneyType.HUB:
      return baseURL;
    case JourneyType.CHALLENGE:
      return `${baseURL}/challenges/${journey.challenge?.nameID}`;
    case JourneyType.OPPORTUNITY:
      return `${baseURL}/challenges/${journey.challenge?.nameID}/opportunities/${journey.challenge?.opportunity?.nameID}`;
  }

  return baseURL;
};

export const createJourneyAdminCommunityURL = (
  webclientEndpoint: string,
  journey: JourneyPayload
): string => {
  const baseURL = `${webclientEndpoint}/admin/hubs/${journey.hubNameID}`;
  switch (journey.type) {
    case JourneyType.HUB:
      return `${baseURL}/community`;
    case JourneyType.CHALLENGE:
      return `${baseURL}/challenges/${journey.challenge?.nameID}/community`;
    case JourneyType.OPPORTUNITY:
      return `${baseURL}/challenges/${journey.challenge?.nameID}/opportunities/${journey.challenge?.opportunity?.nameID}/community`;
  }

  return baseURL;
};

export const createUserURL = (
  webclientEndpoint: string,
  userNameID: string
): string => {
  return `${webclientEndpoint}/user/${userNameID}`;
};

export const createCalloutURL = (
  journeyURL: string,
  calloutNameID: string
): string => {
  return `${journeyURL}/collaboration/${calloutNameID}`;
};

export const createCardURL = (
  journeyURL: string,
  calloutNameID: string,
  cardNameID: string
): string => {
  return `${journeyURL}/collaboration/${calloutNameID}/aspects/${cardNameID}`;
};

export const createCanvasURL = (
  journeyURL: string,
  calloutNameID: string,
  canvasNameID: string
): string => {
  return `${journeyURL}/collaboration/${calloutNameID}/canvases/${canvasNameID}`;
};

export const createOrganizationURL = (
  webclientEndpoint: string,
  orgNameID: string
): string => {
  return `${webclientEndpoint}/organization/${orgNameID}`;
};

export const createUserNotificationPreferencesURL = (
  webclientEndpoint: string,
  userNameID: string
): string => {
  return `${webclientEndpoint}/user/${userNameID}/settings/notifications`;
};

export const createCalendarEventURL = (
  journeyURL: string,
  calendarEventNameId: string
): string => {
  return `${journeyURL}/dashboard/calendar/${calendarEventNameId}`;
};
