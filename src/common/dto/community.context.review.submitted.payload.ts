import { BaseEventPayload } from './base.event.payload';

export interface CommunityContextReviewSubmittedPayload
  extends BaseEventPayload {
  userId: string;
  challengeId: string;
  community: { name: string };
  questions: FeedbackQuestions[];
}

export type FeedbackQuestions = {
  name: string;
  value: string;
  sortOrder: number;
};
