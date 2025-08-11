import { OrganizationBaseEventPayload } from "./organization.base.event.payload";

export interface OrganizationMessageEventPayload
  extends OrganizationBaseEventPayload {
  message: string;
}
