import { ContributorPayload } from "./contributor.payload";

export interface UserPayload extends ContributorPayload {
  firstName: string;
  lastName: string;
  email: string;
};
