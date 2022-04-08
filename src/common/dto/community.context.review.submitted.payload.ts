export type CommunityContextReviewSubmittedPayload = {
  userId: string;
  challengeId: string;
  community: { name: string };
  questions: FeedbackQuestions[];
};

export type FeedbackQuestions = {
  name: string;
  value: string;
  sortOrder: number;
};
