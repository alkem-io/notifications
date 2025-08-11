import { UserBaseEventPayload } from "./user.base.event.payload";

export interface UserMessageEventPayload extends UserBaseEventPayload {
  message: string;
}
