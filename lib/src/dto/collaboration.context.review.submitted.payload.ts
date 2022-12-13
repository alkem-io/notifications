import { JourneyBaseEventPayload } from './journey.base.event.payload';

export interface CollaborationContextReviewSubmittedPayload
  extends JourneyBaseEventPayload {
  questions: FeedbackQuestions[];
}

export type FeedbackQuestions = {
  name: string;
  value: string;
  sortOrder: number;
};
