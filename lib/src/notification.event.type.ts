export enum NotificationEventType {
  COMMUNITY_APPLICATION_CREATED = 'communityApplicationCreated',
  COMMUNITY_NEW_MEMBER = 'communityNewMember',
  COMMUNITY_INVITATION_CREATED = 'communityInvitationCreated',
  COMMUNICATION_COMMENT_SENT = 'communicationCommentSent',
  COMMUNICATION_UPDATE_SENT = 'communicationUpdateSent',
  COMMUNICATION_USER_MESSAGE = 'communicationUserMessage',
  COMMUNICATION_ORGANIZATION_MESSAGE = 'communicationOrganizationMessage',
  COMMUNICATION_COMMUNITY_MESSAGE = 'communicationCommunityMessage',
  COMMUNICATION_USER_MENTION = 'communicationUserMention',
  COMMUNICATION_ORGANIZATION_MENTION = 'communicationOrganizationMention',
  COLLABORATION_INTEREST = 'collaborationInterest',
  COLLABORATION_CONTEXT_REVIEW_SUBMITTED = 'collaborationContextReviewSubmitted',
  COLLABORATION_WHITEBOARD_CREATED = 'collaborationWhiteboardCreated',
  COLLABORATION_POST_CREATED = 'collaborationPostCreated',
  COLLABORATION_POST_COMMENT = 'collaborationPostComment',
  COLLABORATION_DISCUSSION_COMMENT = 'collaborationCommentOnDiscussion',
  COLLABORATION_CALLOUT_PUBLISHED = 'collaborationCalloutPublished',
  PLATFORM_USER_REGISTERED = 'platformUserRegistered',
  PLATFORM_USER_REMOVED = 'platformUserRemoved',
  PLATFORM_FORUM_DISCUSSION_COMMENT = 'platformForumDiscussionComment',
  PLATFORM_FORUM_DISCUSSION_CREATED = 'platformForumDiscussionCreated',
  COMMENT_REPLY = 'commentReply',
}
