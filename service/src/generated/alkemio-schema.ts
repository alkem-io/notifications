import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */

export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DID: { input: string; output: string };
  DateTime: { input: Date; output: Date };
  Emoji: { input: any; output: any };
  JSON: { input: string; output: string };
  LifecycleDefinition: { input: any; output: any };
  Markdown: { input: any; output: any };
  MemoContent: { input: any; output: any };
  MessageID: { input: any; output: any };
  NameID: { input: string; output: string };
  SearchCursor: { input: any; output: any };
  UUID: { input: string; output: string };
  Upload: { input: any; output: any };
  WhiteboardContent: { input: any; output: any };
};

export type Apm = {
  /** Endpoint where events are sent. */
  endpoint: Scalars['String']['output'];
  /** Flag indicating if real user monitoring is enabled. */
  rumEnabled: Scalars['Boolean']['output'];
};

export type Account = {
  /** The Agent representing this Account. */
  agent: Agent;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The external subscription ID for this Account. */
  externalSubscriptionID?: Maybe<Scalars['String']['output']>;
  /** The Account host. */
  host?: Maybe<Contributor>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The InnovationHubs for this Account. */
  innovationHubs: Array<InnovationHub>;
  /** The InnovationPacks for this Account. */
  innovationPacks: Array<InnovationPack>;
  /** The License operating on this Account. */
  license: License;
  /** The Spaces within this Account. */
  spaces: Array<Space>;
  /** The StorageAggregator in use by this Account */
  storageAggregator: StorageAggregator;
  /** The subscriptions active for this Account. */
  subscriptions: Array<AccountSubscription>;
  /** A type of entity that this Account is being used with. */
  type?: Maybe<AccountType>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The virtual contributors for this Account. */
  virtualContributors: Array<VirtualContributor>;
};

export type AccountAuthorizationResetInput = {
  /** The identifier of the Account whose Authorization Policy should be reset. */
  accountID: Scalars['UUID']['input'];
};

export type AccountLicenseResetInput = {
  /** The identifier of the Account whose License and Entitlements should be reset. */
  accountID: Scalars['UUID']['input'];
};

export type AccountSubscription = {
  /** The expiry date of this subscription, null if it does never expire. */
  expires?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the Subscription. */
  name: LicensingCredentialBasedCredentialType;
};

export enum AccountType {
  Organization = 'ORGANIZATION',
  User = 'USER',
}

export type ActivityCreatedSubscriptionInput = {
  /** The collaboration on which to subscribe for new activity */
  collaborationID: Scalars['UUID']['input'];
  /** Include activities happened on child Collaborations. */
  includeChild?: InputMaybe<Scalars['Boolean']['input']>;
  /** Which activity types to include in the results. Returns all by default. */
  types?: InputMaybe<Array<ActivityEventType>>;
};

export type ActivityCreatedSubscriptionResult = {
  /** The newly created activity */
  activity: ActivityLogEntry;
};

export enum ActivityEventType {
  CalendarEventCreated = 'CALENDAR_EVENT_CREATED',
  CalloutLinkCreated = 'CALLOUT_LINK_CREATED',
  CalloutPostComment = 'CALLOUT_POST_COMMENT',
  CalloutPostCreated = 'CALLOUT_POST_CREATED',
  CalloutPublished = 'CALLOUT_PUBLISHED',
  CalloutWhiteboardContentModified = 'CALLOUT_WHITEBOARD_CONTENT_MODIFIED',
  CalloutWhiteboardCreated = 'CALLOUT_WHITEBOARD_CREATED',
  DiscussionComment = 'DISCUSSION_COMMENT',
  MemberJoined = 'MEMBER_JOINED',
  SubspaceCreated = 'SUBSPACE_CREATED',
  UpdateSent = 'UPDATE_SENT',
}

export type ActivityFeed = {
  activityFeed: Array<ActivityLogEntry>;
  pageInfo: PageInfo;
  total: Scalars['Float']['output'];
};

export type ActivityFeedGroupedQueryArgs = {
  /** What events to exclude. */
  excludeTypes?: InputMaybe<Array<ActivityEventType>>;
  /** Number of activities to return. */
  limit?: InputMaybe<Scalars['Float']['input']>;
  /** Returns only events that the current user triggered; Includes all by default. */
  myActivity?: InputMaybe<Scalars['Boolean']['input']>;
  /** Activity from which Spaces to include; Includes all by default. */
  roles?: InputMaybe<Array<ActivityFeedRoles>>;
  /** Activity from which Spaces to include; Includes all by default. */
  spaceIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** What events to include; Includes all by default. */
  types?: InputMaybe<Array<ActivityEventType>>;
};

export type ActivityFeedQueryArgs = {
  /** What events to exclude. */
  excludeTypes?: InputMaybe<Array<ActivityEventType>>;
  /** Returns only events that the current user triggered; Includes all by default. */
  myActivity?: InputMaybe<Scalars['Boolean']['input']>;
  /** Activity from which Spaces to include; Includes all by default. */
  roles?: InputMaybe<Array<ActivityFeedRoles>>;
  /** Activity from which Spaces to include; Includes all by default. */
  spaceIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** What events to include; Includes all by default. */
  types?: InputMaybe<Array<ActivityEventType>>;
};

export enum ActivityFeedRoles {
  Admin = 'ADMIN',
  Lead = 'LEAD',
  Member = 'MEMBER',
}

export type ActivityLogEntry = {
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
};

export type ActivityLogEntryCalendarEventCreated = ActivityLogEntry & {
  /** The Calendar in which the CalendarEvent was created. */
  calendar: Calendar;
  /** The CalendarEvent that was created. */
  calendarEvent: CalendarEvent;
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
};

export type ActivityLogEntryCalloutDiscussionComment = ActivityLogEntry & {
  /** The Callout in which the comment was added. */
  callout: Callout;
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
};

export type ActivityLogEntryCalloutLinkCreated = ActivityLogEntry & {
  /** The Callout in which the Link was created. */
  callout: Callout;
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The Link that was created. */
  link: Link;
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
};

export type ActivityLogEntryCalloutPostComment = ActivityLogEntry & {
  /** The Callout in which the Post was commented. */
  callout: Callout;
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Post that was commented on. */
  post: Post;
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
};

export type ActivityLogEntryCalloutPostCreated = ActivityLogEntry & {
  /** The Callout in which the Post was created. */
  callout: Callout;
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Post that was created. */
  post: Post;
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
};

export type ActivityLogEntryCalloutPublished = ActivityLogEntry & {
  /** The Callout that was published. */
  callout: Callout;
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
};

export type ActivityLogEntryCalloutWhiteboardContentModified =
  ActivityLogEntry & {
    /** The Callout in which the Whiteboard was updated. */
    callout: Callout;
    /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
    child: Scalars['Boolean']['output'];
    /** The id of the Collaboration entity within which the Activity was generated. */
    collaborationID: Scalars['UUID']['output'];
    /** The timestamp for the Activity. */
    createdDate: Scalars['DateTime']['output'];
    /** The text details for this Activity. */
    description: Scalars['String']['output'];
    id: Scalars['UUID']['output'];
    /** The display name of the parent */
    parentDisplayName: Scalars['String']['output'];
    /** The Space where the activity happened */
    space?: Maybe<Space>;
    /** The user that triggered this Activity. */
    triggeredBy: User;
    /** The event type for this Activity. */
    type: ActivityEventType;
    /** The Whiteboard that was updated. */
    whiteboard: Whiteboard;
  };

export type ActivityLogEntryCalloutWhiteboardCreated = ActivityLogEntry & {
  /** The Callout in which the Whiteboard was created. */
  callout: Callout;
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
  /** The Whiteboard that was created. */
  whiteboard: Whiteboard;
};

export type ActivityLogEntryMemberJoined = ActivityLogEntry & {
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The community that was joined. */
  community: Community;
  /** The Contributor that joined the Community. */
  contributor: Contributor;
  /** The type of the Contributor that joined the Community. */
  contributorType: RoleSetContributorType;
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
};

export type ActivityLogEntrySubspaceCreated = ActivityLogEntry & {
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The Subspace that was created. */
  subspace: Space;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
};

export type ActivityLogEntryUpdateSent = ActivityLogEntry & {
  /** Indicates if this Activity happened on a child Collaboration. Child results can be included via the "includeChild" parameter. */
  child: Scalars['Boolean']['output'];
  /** The id of the Collaboration entity within which the Activity was generated. */
  collaborationID: Scalars['UUID']['output'];
  /** The timestamp for the Activity. */
  createdDate: Scalars['DateTime']['output'];
  /** The text details for this Activity. */
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** The url to the Journey. */
  journeyUrl: Scalars['String']['output'];
  /** The Message that been sent to this Community. */
  message: Scalars['String']['output'];
  /** The display name of the parent */
  parentDisplayName: Scalars['String']['output'];
  /** The Space where the activity happened */
  space?: Maybe<Space>;
  /** The user that triggered this Activity. */
  triggeredBy: User;
  /** The event type for this Activity. */
  type: ActivityEventType;
  /** The Updates for this Community. */
  updates: Room;
};

export type ActivityLogInput = {
  /** Display the activityLog results for the specified Collaboration. */
  collaborationID: Scalars['UUID']['input'];
  /** Include entries happened on child Collaborations. */
  includeChild?: InputMaybe<Scalars['Boolean']['input']>;
  /** The number of ActivityLog entries to return; if omitted return all. */
  limit?: InputMaybe<Scalars['Float']['input']>;
  /** Which activity types to include in the results. Returns all by default. */
  types?: InputMaybe<Array<ActivityEventType>>;
};

export type Agent = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The Credentials held by this Agent. */
  credentials?: Maybe<Array<Credential>>;
  /** The Decentralized Identifier (DID) for this Agent. */
  did?: Maybe<Scalars['DID']['output']>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** A type of entity that this Agent is being used with. */
  type: AgentType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The Verfied Credentials for this Agent. */
  verifiedCredentials?: Maybe<Array<VerifiedCredential>>;
};

export type AgentBeginVerifiedCredentialOfferOutput = {
  /** The token containing the information about issuer, callback endpoint and the credentials offered */
  jwt: Scalars['String']['output'];
  /** The QR Code Image to be offered on the client for scanning by a mobile wallet */
  qrCodeImg: Scalars['String']['output'];
};

export type AgentBeginVerifiedCredentialRequestOutput = {
  /** The token containing the information about issuer, callback endpoint and the credentials offered */
  jwt: Scalars['String']['output'];
  /** The QR Code Image to be offered on the client for scanning by a mobile wallet */
  qrCodeImg: Scalars['String']['output'];
};

export enum AgentType {
  Account = 'ACCOUNT',
  Organization = 'ORGANIZATION',
  Space = 'SPACE',
  User = 'USER',
  VirtualContributor = 'VIRTUAL_CONTRIBUTOR',
}

export type AiPersona = {
  /** The ID of the AiPersonaService. */
  aiPersonaServiceID?: Maybe<Scalars['String']['output']>;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** A overview of knowledge provided by this AI Persona. */
  bodyOfKnowledge?: Maybe<Scalars['Markdown']['output']>;
  /** The body of knowledge ID used for the AI Persona. */
  bodyOfKnowledgeID?: Maybe<Scalars['String']['output']>;
  /** The body of knowledge type used for the AI Persona. */
  bodyOfKnowledgeType?: Maybe<AiPersonaBodyOfKnowledgeType>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The type of context sharing that are supported by this AI Persona when used. */
  dataAccessMode: AiPersonaDataAccessMode;
  /** The description for this AI Persona. */
  description?: Maybe<Scalars['Markdown']['output']>;
  /** The engine powering the AiPersona. */
  engine: AiPersonaEngine;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The type of interactions that are supported by this AI Persona when used. */
  interactionModes: Array<AiPersonaInteractionMode>;
  /** The model card information about this AI Persona. */
  modelCard: AiPersonaModelCard;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export enum AiPersonaBodyOfKnowledgeType {
  AlkemioKnowledgeBase = 'ALKEMIO_KNOWLEDGE_BASE',
  AlkemioSpace = 'ALKEMIO_SPACE',
  None = 'NONE',
  Other = 'OTHER',
  Website = 'WEBSITE',
}

export enum AiPersonaDataAccessMode {
  None = 'NONE',
  SpaceProfile = 'SPACE_PROFILE',
  SpaceProfileAndContents = 'SPACE_PROFILE_AND_CONTENTS',
}

export enum AiPersonaEngine {
  CommunityManager = 'COMMUNITY_MANAGER',
  Expert = 'EXPERT',
  GenericOpenai = 'GENERIC_OPENAI',
  Guidance = 'GUIDANCE',
  LibraFlow = 'LIBRA_FLOW',
  OpenaiAssistant = 'OPENAI_ASSISTANT',
}

export enum AiPersonaInteractionMode {
  DiscussionTagging = 'DISCUSSION_TAGGING',
}

export type AiPersonaModelCard = {
  /** The model card information about the AI Engine behind the AI Persona. */
  aiEngine?: Maybe<ModelCardAiEngineResult>;
  /** The model card information about the monitoring that is done on usage. */
  monitoring?: Maybe<ModelCardMonitoringResult>;
  /** The Model Card details related to usage of the Ai Persona within a Space. */
  spaceUsage?: Maybe<Array<ModelCardSpaceUsageResult>>;
};

export enum AiPersonaModelCardEntry {
  SpaceCapabilities = 'SPACE_CAPABILITIES',
  SpaceDataAccess = 'SPACE_DATA_ACCESS',
  SpaceRoleRequired = 'SPACE_ROLE_REQUIRED',
}

export enum AiPersonaModelCardEntryFlagName {
  SpaceCapabilityCommunityManagement = 'SPACE_CAPABILITY_COMMUNITY_MANAGEMENT',
  SpaceCapabilityCreateContent = 'SPACE_CAPABILITY_CREATE_CONTENT',
  SpaceCapabilityTagging = 'SPACE_CAPABILITY_TAGGING',
  SpaceDataAccessAbout = 'SPACE_DATA_ACCESS_ABOUT',
  SpaceDataAccessContent = 'SPACE_DATA_ACCESS_CONTENT',
  SpaceDataAccessSubspaces = 'SPACE_DATA_ACCESS_SUBSPACES',
  SpaceRoleAdmin = 'SPACE_ROLE_ADMIN',
  SpaceRoleMember = 'SPACE_ROLE_MEMBER',
}

export type AiPersonaModelCardFlag = {
  /** Is this model card entry flag enabled? */
  enabled: Scalars['Boolean']['output'];
  /** The name of the Model Card Entry flag */
  name: AiPersonaModelCardEntryFlagName;
};

export type AiPersonaService = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The body of knowledge ID used for the AI Persona Service */
  bodyOfKnowledgeID?: Maybe<Scalars['UUID']['output']>;
  /** When wat the body of knowledge of the VC last updated. */
  bodyOfKnowledgeLastUpdated?: Maybe<Scalars['DateTime']['output']>;
  /** The body of knowledge type used for the AI Persona Service */
  bodyOfKnowledgeType: AiPersonaBodyOfKnowledgeType;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The required data access by the Virtual Persona */
  dataAccessMode: AiPersonaDataAccessMode;
  /** The AI Persona Engine being used by this AI Persona. */
  engine: AiPersonaEngine;
  /** The ExternalConfig for this Virtual. */
  externalConfig?: Maybe<ExternalConfig>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The prompt used by this Virtual Persona */
  prompt: Array<Scalars['String']['output']>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type AiServer = {
  /** A particular AiPersonaService */
  aiPersonaService: AiPersonaService;
  /** The AiPersonaServices on this aiServer */
  aiPersonaServices: Array<AiPersonaService>;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The default AiPersonaService in use on the aiServer. */
  defaultAiPersonaService: AiPersonaService;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type AiServerAiPersonaServiceArgs = {
  ID: Scalars['UUID']['input'];
};

export type Application = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The User for this Application. */
  contributor: Contributor;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Is this lifecycle in a final state (done). */
  isFinalized: Scalars['Boolean']['output'];
  lifecycle: Lifecycle;
  /** The next events of this Lifecycle. */
  nextEvents: Array<Scalars['String']['output']>;
  /** The Questions for this application. */
  questions: Array<Question>;
  /** The current state of this Lifecycle. */
  state: Scalars['String']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type ApplicationEventInput = {
  applicationID: Scalars['UUID']['input'];
  eventName: Scalars['String']['input'];
};

export type ApplyForEntryRoleOnRoleSetInput = {
  questions: Array<CreateNvpInput>;
  roleSetID: Scalars['UUID']['input'];
};

export type AssignLicensePlanToAccount = {
  /** The ID of the Account to assign the LicensePlan to. */
  accountID: Scalars['UUID']['input'];
  /** The ID of the LicensePlan to assign. */
  licensePlanID: Scalars['UUID']['input'];
  /** The ID of the Licensing to use. */
  licensingID?: InputMaybe<Scalars['UUID']['input']>;
};

export type AssignLicensePlanToSpace = {
  /** The ID of the LicensePlan to assign. */
  licensePlanID: Scalars['UUID']['input'];
  /** The ID of the Licensing to use. */
  licensingID?: InputMaybe<Scalars['UUID']['input']>;
  /** The ID of the Space to assign the LicensePlan to. */
  spaceID: Scalars['UUID']['input'];
};

export type AssignPlatformRoleInput = {
  contributorID: Scalars['UUID']['input'];
  role: RoleName;
};

export type AssignRoleOnRoleSetToOrganizationInput = {
  contributorID: Scalars['UUID']['input'];
  role: RoleName;
  roleSetID: Scalars['UUID']['input'];
};

export type AssignRoleOnRoleSetToUserInput = {
  contributorID: Scalars['UUID']['input'];
  role: RoleName;
  roleSetID: Scalars['UUID']['input'];
};

export type AssignRoleOnRoleSetToVirtualContributorInput = {
  contributorID: Scalars['UUID']['input'];
  role: RoleName;
  roleSetID: Scalars['UUID']['input'];
};

export type AssignUserGroupMemberInput = {
  groupID: Scalars['UUID']['input'];
  userID: Scalars['UUID']['input'];
};

export type AuthenticationConfig = {
  /** Alkemio Authentication Providers Config. */
  providers: Array<AuthenticationProviderConfig>;
};

export type AuthenticationProviderConfig = {
  /** Configuration of the authentication provider */
  config: AuthenticationProviderConfigUnion;
  /** Is the authentication provider enabled? */
  enabled: Scalars['Boolean']['output'];
  /** CDN location of an icon of the authentication provider login button. */
  icon: Scalars['String']['output'];
  /** Label of the authentication provider. */
  label: Scalars['String']['output'];
  /** Name of the authentication provider. */
  name: Scalars['String']['output'];
};

export type AuthenticationProviderConfigUnion = OryConfig;

export enum AuthenticationType {
  Email = 'EMAIL',
  Linkedin = 'LINKEDIN',
  Microsoft = 'MICROSOFT',
  Unknown = 'UNKNOWN',
}

export type Authorization = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The set of credential rules that are contained by this Authorization Policy. */
  credentialRules?: Maybe<Array<AuthorizationPolicyRuleCredential>>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The privileges granted to the current user based on this Authorization Policy. */
  myPrivileges?: Maybe<Array<AuthorizationPrivilege>>;
  /** The set of privilege rules that are contained by this Authorization Policy. */
  privilegeRules?: Maybe<Array<AuthorizationPolicyRulePrivilege>>;
  /** A type of entity that this Authorization Policy is being used with. */
  type?: Maybe<AuthorizationPolicyType>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The set of verified credential rules that are contained by this Authorization Policy. */
  verifiedCredentialRules?: Maybe<
    Array<AuthorizationPolicyRuleVerifiedCredential>
  >;
};

export enum AuthorizationCredential {
  AccountAdmin = 'ACCOUNT_ADMIN',
  BetaTester = 'BETA_TESTER',
  GlobalAdmin = 'GLOBAL_ADMIN',
  GlobalAnonymous = 'GLOBAL_ANONYMOUS',
  GlobalCommunityRead = 'GLOBAL_COMMUNITY_READ',
  GlobalLicenseManager = 'GLOBAL_LICENSE_MANAGER',
  GlobalPlatformManager = 'GLOBAL_PLATFORM_MANAGER',
  GlobalRegistered = 'GLOBAL_REGISTERED',
  GlobalSpacesReader = 'GLOBAL_SPACES_READER',
  GlobalSupport = 'GLOBAL_SUPPORT',
  GlobalSupportManager = 'GLOBAL_SUPPORT_MANAGER',
  OrganizationAdmin = 'ORGANIZATION_ADMIN',
  OrganizationAssociate = 'ORGANIZATION_ASSOCIATE',
  OrganizationOwner = 'ORGANIZATION_OWNER',
  SpaceAdmin = 'SPACE_ADMIN',
  SpaceLead = 'SPACE_LEAD',
  SpaceMember = 'SPACE_MEMBER',
  SpaceMemberInvitee = 'SPACE_MEMBER_INVITEE',
  SpaceSubspaceAdmin = 'SPACE_SUBSPACE_ADMIN',
  UserGroupMember = 'USER_GROUP_MEMBER',
  UserSelfManagement = 'USER_SELF_MANAGEMENT',
  VcCampaign = 'VC_CAMPAIGN',
}

export type AuthorizationPolicyRuleCredential = {
  cascade: Scalars['Boolean']['output'];
  criterias: Array<CredentialDefinition>;
  grantedPrivileges: Array<AuthorizationPrivilege>;
  name?: Maybe<Scalars['String']['output']>;
};

export type AuthorizationPolicyRulePrivilege = {
  grantedPrivileges: Array<AuthorizationPrivilege>;
  name?: Maybe<Scalars['String']['output']>;
  sourcePrivilege: AuthorizationPrivilege;
};

export type AuthorizationPolicyRuleVerifiedCredential = {
  claimRule: Scalars['String']['output'];
  credentialName: Scalars['String']['output'];
  grantedPrivileges: Array<AuthorizationPrivilege>;
};

export enum AuthorizationPolicyType {
  Account = 'ACCOUNT',
  Agent = 'AGENT',
  AiPersona = 'AI_PERSONA',
  AiPersonaService = 'AI_PERSONA_SERVICE',
  AiServer = 'AI_SERVER',
  Application = 'APPLICATION',
  Calendar = 'CALENDAR',
  CalendarEvent = 'CALENDAR_EVENT',
  Callout = 'CALLOUT',
  CalloutsSet = 'CALLOUTS_SET',
  CalloutContribution = 'CALLOUT_CONTRIBUTION',
  CalloutFraming = 'CALLOUT_FRAMING',
  Classification = 'CLASSIFICATION',
  Collaboration = 'COLLABORATION',
  Communication = 'COMMUNICATION',
  Community = 'COMMUNITY',
  CommunityGuidelines = 'COMMUNITY_GUIDELINES',
  Discussion = 'DISCUSSION',
  Document = 'DOCUMENT',
  Forum = 'FORUM',
  InnovationFlow = 'INNOVATION_FLOW',
  InnovationFlowState = 'INNOVATION_FLOW_STATE',
  InnovationHub = 'INNOVATION_HUB',
  InnovationPack = 'INNOVATION_PACK',
  Invitation = 'INVITATION',
  InMemory = 'IN_MEMORY',
  KnowledgeBase = 'KNOWLEDGE_BASE',
  Library = 'LIBRARY',
  License = 'LICENSE',
  LicensePolicy = 'LICENSE_POLICY',
  Licensing = 'LICENSING',
  Link = 'LINK',
  Memo = 'MEMO',
  Organization = 'ORGANIZATION',
  OrganizationVerification = 'ORGANIZATION_VERIFICATION',
  Platform = 'PLATFORM',
  Post = 'POST',
  Profile = 'PROFILE',
  Reference = 'REFERENCE',
  RoleSet = 'ROLE_SET',
  Room = 'ROOM',
  Space = 'SPACE',
  SpaceAbout = 'SPACE_ABOUT',
  StorageAggregator = 'STORAGE_AGGREGATOR',
  StorageBucket = 'STORAGE_BUCKET',
  Tagset = 'TAGSET',
  Template = 'TEMPLATE',
  TemplatesManager = 'TEMPLATES_MANAGER',
  TemplatesSet = 'TEMPLATES_SET',
  TemplateContentSpace = 'TEMPLATE_CONTENT_SPACE',
  TemplateDefault = 'TEMPLATE_DEFAULT',
  Timeline = 'TIMELINE',
  Unknown = 'UNKNOWN',
  User = 'USER',
  UserGroup = 'USER_GROUP',
  UserSettings = 'USER_SETTINGS',
  VirtualContributor = 'VIRTUAL_CONTRIBUTOR',
  Visual = 'VISUAL',
  Whiteboard = 'WHITEBOARD',
}

export enum AuthorizationPrivilege {
  AccessInteractiveGuidance = 'ACCESS_INTERACTIVE_GUIDANCE',
  AccountLicenseManage = 'ACCOUNT_LICENSE_MANAGE',
  AuthorizationReset = 'AUTHORIZATION_RESET',
  CommunityAssignVcFromAccount = 'COMMUNITY_ASSIGN_VC_FROM_ACCOUNT',
  Contribute = 'CONTRIBUTE',
  Create = 'CREATE',
  CreateCallout = 'CREATE_CALLOUT',
  CreateDiscussion = 'CREATE_DISCUSSION',
  CreateInnovationHub = 'CREATE_INNOVATION_HUB',
  CreateInnovationPack = 'CREATE_INNOVATION_PACK',
  CreateMessage = 'CREATE_MESSAGE',
  CreateMessageReaction = 'CREATE_MESSAGE_REACTION',
  CreateMessageReply = 'CREATE_MESSAGE_REPLY',
  CreateOrganization = 'CREATE_ORGANIZATION',
  CreatePost = 'CREATE_POST',
  CreateSpace = 'CREATE_SPACE',
  CreateSubspace = 'CREATE_SUBSPACE',
  CreateVirtualContributor = 'CREATE_VIRTUAL_CONTRIBUTOR',
  CreateWhiteboard = 'CREATE_WHITEBOARD',
  Delete = 'DELETE',
  FileDelete = 'FILE_DELETE',
  FileUpload = 'FILE_UPLOAD',
  Grant = 'GRANT',
  GrantGlobalAdmins = 'GRANT_GLOBAL_ADMINS',
  LicenseReset = 'LICENSE_RESET',
  MoveContribution = 'MOVE_CONTRIBUTION',
  MovePost = 'MOVE_POST',
  PlatformAdmin = 'PLATFORM_ADMIN',
  PlatformSettingsAdmin = 'PLATFORM_SETTINGS_ADMIN',
  Read = 'READ',
  ReadAbout = 'READ_ABOUT',
  ReadLicense = 'READ_LICENSE',
  ReadUsers = 'READ_USERS',
  ReadUserPii = 'READ_USER_PII',
  ReadUserSettings = 'READ_USER_SETTINGS',
  ReceiveNotifications = 'RECEIVE_NOTIFICATIONS',
  ReceiveNotificationsAdmin = 'RECEIVE_NOTIFICATIONS_ADMIN',
  ReceiveNotificationsInApp = 'RECEIVE_NOTIFICATIONS_IN_APP',
  RolesetEntryRoleApply = 'ROLESET_ENTRY_ROLE_APPLY',
  RolesetEntryRoleAssign = 'ROLESET_ENTRY_ROLE_ASSIGN',
  RolesetEntryRoleAssignOrganization = 'ROLESET_ENTRY_ROLE_ASSIGN_ORGANIZATION',
  RolesetEntryRoleInvite = 'ROLESET_ENTRY_ROLE_INVITE',
  RolesetEntryRoleInviteAccept = 'ROLESET_ENTRY_ROLE_INVITE_ACCEPT',
  RolesetEntryRoleJoin = 'ROLESET_ENTRY_ROLE_JOIN',
  TransferResourceAccept = 'TRANSFER_RESOURCE_ACCEPT',
  TransferResourceOffer = 'TRANSFER_RESOURCE_OFFER',
  Update = 'UPDATE',
  UpdateCalloutPublisher = 'UPDATE_CALLOUT_PUBLISHER',
  UpdateContent = 'UPDATE_CONTENT',
  UpdateInnovationFlow = 'UPDATE_INNOVATION_FLOW',
}

export type Calendar = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** A single CalendarEvent */
  event?: Maybe<CalendarEvent>;
  /** The list of CalendarEvents for this Calendar. */
  events: Array<CalendarEvent>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type CalendarEventArgs = {
  ID: Scalars['UUID']['input'];
};

export type CalendarEvent = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The comments for this CalendarEvent */
  comments: Room;
  /** The user that created this CalendarEvent */
  createdBy?: Maybe<User>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The length of the event in days. */
  durationDays?: Maybe<Scalars['Float']['output']>;
  /** The length of the event in minutes. */
  durationMinutes: Scalars['Float']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Flag to indicate if this event is for multiple days. */
  multipleDays: Scalars['Boolean']['output'];
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The Profile for this Post. */
  profile: Profile;
  /** The start time for this CalendarEvent. */
  startDate?: Maybe<Scalars['DateTime']['output']>;
  /** Which Subspace is this event part of. Only applicable if the Space has this option enabled. */
  subspace?: Maybe<Space>;
  /** The event type, e.g. webinar, meetup etc. */
  type: CalendarEventType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** Is the event visible on the parent calendar. */
  visibleOnParentCalendar: Scalars['Boolean']['output'];
  /** Flag to indicate if this event is for a whole day. */
  wholeDay: Scalars['Boolean']['output'];
};

export enum CalendarEventType {
  Deadline = 'DEADLINE',
  Event = 'EVENT',
  Meeting = 'MEETING',
  Milestone = 'MILESTONE',
  Other = 'OTHER',
  Training = 'TRAINING',
}

export type Callout = {
  /** The activity for this Callout. The number of Contributions if the callout allows contributions, or the number of comments if it does not. */
  activity: Scalars['Float']['output'];
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The comments for this Callout. */
  classification?: Maybe<Classification>;
  /** The comments for this Callout. */
  comments?: Maybe<Room>;
  /** The Contribution Defaults for this Callout. */
  contributionDefaults: CalloutContributionDefaults;
  /** The Contributions that have been made to this Callout. */
  contributions: Array<CalloutContribution>;
  /** The user that created this Callout */
  createdBy?: Maybe<User>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The Callout Framing associated with this Callout. */
  framing: CalloutFraming;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Whether this callout is a Template or not. */
  isTemplate: Scalars['Boolean']['output'];
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The Posts associated with this Callout. */
  posts?: Maybe<Array<Post>>;
  /** The user that published this Callout */
  publishedBy?: Maybe<User>;
  /** The timestamp for the publishing of this Callout. */
  publishedDate?: Maybe<Scalars['Float']['output']>;
  /** The Callout Settings associated with this Callout. */
  settings: CalloutSettings;
  /** The sorting order for this Callout. */
  sortOrder: Scalars['Float']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type CalloutContributionsArgs = {
  IDs?: InputMaybe<Array<Scalars['UUID']['input']>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  shuffle?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum CalloutAllowedContributors {
  Admins = 'ADMINS',
  Members = 'MEMBERS',
  None = 'NONE',
}

export type CalloutContribution = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The user that created this Document */
  createdBy?: Maybe<User>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The Link that was contributed. */
  link?: Maybe<Link>;
  /** The Post that was contributed. */
  post?: Maybe<Post>;
  /** The sorting order for this Contribution. */
  sortOrder: Scalars['Float']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The Whiteboard that was contributed. */
  whiteboard?: Maybe<Whiteboard>;
};

export type CalloutContributionDefaults = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The default title to use for new contributions. */
  defaultDisplayName?: Maybe<Scalars['String']['output']>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The default description to use for new contributions. */
  postDescription?: Maybe<Scalars['Markdown']['output']>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The default whiteboard content for whiteboard responses. */
  whiteboardContent?: Maybe<Scalars['WhiteboardContent']['output']>;
};

export enum CalloutContributionType {
  Link = 'LINK',
  Post = 'POST',
  Whiteboard = 'WHITEBOARD',
}

export type CalloutFraming = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The Link for framing the associated Callout. */
  link?: Maybe<Link>;
  /** The Memo for framing the associated Callout. */
  memo?: Maybe<Memo>;
  /** The Profile for framing the associated Callout. */
  profile: Profile;
  /** The type of the Callout Framing, the additional content attached to this callout */
  type: CalloutFramingType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The Whiteboard for framing the associated Callout. */
  whiteboard?: Maybe<Whiteboard>;
};

export enum CalloutFramingType {
  Link = 'LINK',
  Memo = 'MEMO',
  None = 'NONE',
  Whiteboard = 'WHITEBOARD',
}

export type CalloutPostCreated = {
  /** The identifier of the Callout on which the post was created. */
  calloutID: Scalars['String']['output'];
  /** The identifier of the Contribution. */
  contributionID: Scalars['String']['output'];
  /** The Post that has been created. */
  post: Post;
  /** The sorting order for this Contribution. */
  sortOrder: Scalars['Float']['output'];
};

export type CalloutSettings = {
  /** Callout Contribution Settings. */
  contribution: CalloutSettingsContribution;
  /** Callout Framing Settings. */
  framing: CalloutSettingsFraming;
  /** Callout Visibility. */
  visibility: CalloutVisibility;
};

export type CalloutSettingsContribution = {
  /** The allowed contribution types for this callout. */
  allowedTypes: Array<CalloutContributionType>;
  /** Indicate who can add more contributions to the callout. */
  canAddContributions: CalloutAllowedContributors;
  /** Can comment to contributions callout. */
  commentsEnabled: Scalars['Boolean']['output'];
  /** Can add contributions to the Callout. Allowed Contribution types is going to be readOnly, so this field can be used to enable or disable the contribution temporarily instead of setting allowedTypes to None. */
  enabled: Scalars['Boolean']['output'];
};

export type CalloutSettingsFraming = {
  /** Can comment to callout framing. */
  commentsEnabled: Scalars['Boolean']['output'];
};

export enum CalloutVisibility {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
}

export type CalloutsSet = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The list of Callouts for this CalloutsSet object. */
  callouts: Array<Callout>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The tagset templates on this CalloutsSet. */
  tagsetTemplates?: Maybe<Array<TagsetTemplate>>;
  /** The set of CalloutGroups in use in this CalloutsSet. */
  type: CalloutsSetType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type CalloutsSetCalloutsArgs = {
  IDs?: InputMaybe<Array<Scalars['UUID']['input']>>;
  classificationTagsets?: InputMaybe<Array<TagsetArgs>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  shuffle?: InputMaybe<Scalars['Boolean']['input']>;
  sortByActivity?: InputMaybe<Scalars['Boolean']['input']>;
  withContributionTypes?: InputMaybe<Array<CalloutContributionType>>;
};

export enum CalloutsSetType {
  Collaboration = 'COLLABORATION',
  KnowledgeBase = 'KNOWLEDGE_BASE',
}

export type ChatGuidanceAnswerRelevanceInput = {
  /** The answer id. */
  id: Scalars['String']['input'];
  /** Is the answer relevant or not. */
  relevant: Scalars['Boolean']['input'];
};

export type ChatGuidanceInput = {
  /** The language of the answer. */
  language?: InputMaybe<Scalars['String']['input']>;
  /** The question that is being asked. */
  question: Scalars['String']['input'];
};

export type Classification = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The default or named tagset. */
  tagset?: Maybe<Tagset>;
  /** The classification tagsets. */
  tagsets?: Maybe<Array<Tagset>>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type ClassificationTagsetArgs = {
  tagsetName: TagsetReservedName;
};

export type Collaboration = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The calloutsSet with Callouts in use by this Space */
  calloutsSet: CalloutsSet;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The InnovationFlow for the Collaboration. */
  innovationFlow: InnovationFlow;
  /** Whether this Collaboration is a Template or not. */
  isTemplate: Scalars['Boolean']['output'];
  /** The License operating on this Collaboration. */
  license: License;
  /** The timeline with events in use by this Space */
  timeline: Timeline;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type Communication = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The updates on this Communication. */
  updates: Room;
};

export type CommunicationAdminEnsureAccessInput = {
  communityID: Scalars['UUID']['input'];
};

export type CommunicationAdminMembershipInput = {
  communityID: Scalars['UUID']['input'];
};

export type CommunicationAdminMembershipResult = {
  /** Display name of the result */
  displayName: Scalars['String']['output'];
  /** A unique identifier for this comunication room membership result. */
  id: Scalars['String']['output'];
  /** Rooms in this Communication */
  rooms: Array<CommunicationAdminRoomMembershipResult>;
};

export type CommunicationAdminOrphanedUsageResult = {
  /** Rooms in the Communication platform that are not used */
  rooms: Array<CommunicationAdminRoomResult>;
};

export type CommunicationAdminRemoveOrphanedRoomInput = {
  roomID: Scalars['String']['input'];
};

export type CommunicationAdminRoomMembershipResult = {
  /** Display name of the entity */
  displayName: Scalars['String']['output'];
  /** Members of the room that are not members of the Community. */
  extraMembers: Array<Scalars['String']['output']>;
  /** A unique identifier for this membership result. */
  id: Scalars['String']['output'];
  /** The access mode for the room. */
  joinRule: Scalars['String']['output'];
  /** Name of the room */
  members: Array<Scalars['String']['output']>;
  /** Members of the community that are missing from the room */
  missingMembers: Array<Scalars['String']['output']>;
  /** The matrix room ID */
  roomID: Scalars['String']['output'];
};

export type CommunicationAdminRoomResult = {
  /** Display name of the result */
  displayName: Scalars['String']['output'];
  /** The identifier for the orphaned room. */
  id: Scalars['String']['output'];
  /** The members of the orphaned room */
  members: Array<Scalars['String']['output']>;
};

export type CommunicationAdminUpdateRoomStateInput = {
  isPublic: Scalars['Boolean']['input'];
  isWorldVisible: Scalars['Boolean']['input'];
  roomID: Scalars['String']['input'];
};

export type CommunicationRoom = {
  /** The display name of the room */
  displayName: Scalars['String']['output'];
  /** The identifier of the room */
  id: Scalars['String']['output'];
  /** The messages that have been sent to the Room. */
  messages: Array<Message>;
};

export type CommunicationSendMessageToCommunityLeadsInput = {
  /** The Community the message is being sent to */
  communityId: Scalars['UUID']['input'];
  /** The message being sent */
  message: Scalars['String']['input'];
};

export type CommunicationSendMessageToOrganizationInput = {
  /** The message being sent */
  message: Scalars['String']['input'];
  /** The Organization the message is being sent to */
  organizationId: Scalars['UUID']['input'];
};

export type CommunicationSendMessageToUserInput = {
  /** The message being sent */
  message: Scalars['String']['input'];
  /** All Users the message is being sent to */
  receiverIds: Array<Scalars['UUID']['input']>;
};

export type Community = Groupable & {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The Communications for this Community. */
  communication: Communication;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The user group with the specified id anywhere in the space */
  group: UserGroup;
  /** Groups of users related to a Community. */
  groups: Array<UserGroup>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The RoleSet for this Community. */
  roleSet: RoleSet;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type CommunityGroupArgs = {
  ID: Scalars['UUID']['input'];
};

export type CommunityApplicationForRoleResult = {
  /** ID for the community */
  communityID: Scalars['UUID']['output'];
  /** Date of creation */
  createdDate: Scalars['DateTime']['output'];
  /** Display name of the community */
  displayName: Scalars['String']['output'];
  /** ID for the application */
  id: Scalars['UUID']['output'];
  /** ID for the ultimate containing Space */
  spaceID: Scalars['UUID']['output'];
  /** Nesting level of the Space */
  spaceLevel: Scalars['Float']['output'];
  /** The current state of the application. */
  state: Scalars['String']['output'];
  /** Date of last update */
  updatedDate: Scalars['DateTime']['output'];
};

export type CommunityApplicationResult = {
  /** The application itself */
  application: Application;
  /** ID for the pending membership */
  id: Scalars['UUID']['output'];
  /** The key information for the Space that the application/invitation is for */
  spacePendingMembershipInfo: SpacePendingMembershipInfo;
};

export type CommunityGuidelines = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The details of the guidelines */
  profile: Profile;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type CommunityInvitationForRoleResult = {
  /** ID for the community */
  communityID: Scalars['UUID']['output'];
  /** ID for Contrbutor that is being invited to a community */
  contributorID: Scalars['UUID']['output'];
  /** The Type of the Contrbutor that is being invited to a community */
  contributorType: RoleSetContributorType;
  /** ID for the user that created the invitation. */
  createdBy: Scalars['UUID']['output'];
  /** Date of creation */
  createdDate: Scalars['DateTime']['output'];
  /** Display name of the community */
  displayName: Scalars['String']['output'];
  /** ID for the Invitation */
  id: Scalars['UUID']['output'];
  /** ID for the ultimate containing Space */
  spaceID: Scalars['UUID']['output'];
  /** Nesting level of the Space */
  spaceLevel: Scalars['Float']['output'];
  /** The current state of the invitation. */
  state: Scalars['String']['output'];
  /** Date of last update */
  updatedDate: Scalars['DateTime']['output'];
  /** The welcome message of the invitation */
  welcomeMessage?: Maybe<Scalars['UUID']['output']>;
};

export type CommunityInvitationResult = {
  /** ID for the pending membership */
  id: Scalars['UUID']['output'];
  /** The invitation itself */
  invitation: Invitation;
  /** The key information for the Space that the application/invitation is for */
  spacePendingMembershipInfo: SpacePendingMembershipInfo;
};

export enum CommunityMembershipPolicy {
  Applications = 'APPLICATIONS',
  Invitations = 'INVITATIONS',
  Open = 'OPEN',
}

export type CommunityMembershipResult = {
  /** The child community memberships */
  childMemberships: Array<CommunityMembershipResult>;
  /** ID for the membership */
  id: Scalars['UUID']['output'];
  /** The space for the membership is for */
  space: Space;
};

export enum CommunityMembershipStatus {
  ApplicationPending = 'APPLICATION_PENDING',
  InvitationPending = 'INVITATION_PENDING',
  Member = 'MEMBER',
  NotMember = 'NOT_MEMBER',
}

export type Config = {
  /** Elastic APM (RUM & performance monitoring) related configuration. */
  apm: Apm;
  /** Authentication configuration. */
  authentication: AuthenticationConfig;
  /** Visual constraints for the given type */
  defaultVisualTypeConstraints: VisualConstraints;
  /** The feature flags for the platform */
  featureFlags: Array<PlatformFeatureFlag>;
  /** Integration with a 3rd party Geo information service */
  geo: Geo;
  /** Platform related locations. */
  locations: PlatformLocations;
  /** Sentry (client monitoring) related configuration. */
  sentry: Sentry;
  /** Configuration for storage providers, e.g. file */
  storage: StorageConfig;
};

export type ConfigDefaultVisualTypeConstraintsArgs = {
  type: VisualType;
};

export enum ContentUpdatePolicy {
  Admins = 'ADMINS',
  Contributors = 'CONTRIBUTORS',
  Owner = 'OWNER',
}

export type Contributor = {
  /** The Agent for the Contributor. */
  agent: Agent;
  /** The authorization rules for the Contributor */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the Contributor */
  id: Scalars['UUID']['output'];
  /** A name identifier of the Contributor, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The profile for the Contributor. */
  profile: Profile;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type ContributorFilterInput = {
  /** Return contributors with credentials in the provided list */
  credentials?: InputMaybe<Array<AuthorizationCredential>>;
};

export type ContributorRolePolicy = {
  /** Maximum number of Contributors in this role */
  maximum: Scalars['Float']['output'];
  /** Minimum number of Contributors in this role */
  minimum: Scalars['Float']['output'];
};

export type ContributorRoles = {
  /** The applications for the specified user; only accessible for platform admins */
  applications: Array<CommunityApplicationForRoleResult>;
  id: Scalars['UUID']['output'];
  /** The invitations for the specified user; only accessible for platform admins */
  invitations: Array<CommunityInvitationForRoleResult>;
  /** Details of the roles the contributor has in Organizations */
  organizations: Array<RolesResultOrganization>;
  /** Details of Spaces the User or Organization is a member of, with child memberships - if Space is accessible for the current user. */
  spaces: Array<RolesResultSpace>;
};

export type ContributorRolesApplicationsArgs = {
  states?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ContributorRolesInvitationsArgs = {
  states?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ConversionVcSpaceToVcKnowledgeBaseInput = {
  /** The Virtual Contributor to be converted. */
  virtualContributorID: Scalars['UUID']['input'];
};

export type ConvertSpaceL1ToSpaceL0Input = {
  /** The Space L1 to be promoted to be a new Space L0.  */
  spaceL1ID: Scalars['UUID']['input'];
};

export type ConvertSpaceL1ToSpaceL2Input = {
  /** The Space L1 to be the parent of the Space L1 when it is moved to be L2.  */
  parentSpaceL1ID: Scalars['UUID']['input'];
  /** The Space L1 to be moved to be a child of another Space L. Both the L1 Space and the parent Space must be in the same L0 Space.  */
  spaceL1ID: Scalars['UUID']['input'];
};

export type ConvertSpaceL2ToSpaceL1Input = {
  /** The Space L2 to be promoted.  */
  spaceL2ID: Scalars['UUID']['input'];
};

export type CreateAiPersonaInput = {
  aiPersonaService?: InputMaybe<CreateAiPersonaServiceInput>;
  aiPersonaServiceID?: InputMaybe<Scalars['UUID']['input']>;
  bodyOfKnowledge?: InputMaybe<Scalars['Markdown']['input']>;
  description?: InputMaybe<Scalars['Markdown']['input']>;
};

export type CreateAiPersonaServiceInput = {
  bodyOfKnowledgeID?: InputMaybe<Scalars['UUID']['input']>;
  bodyOfKnowledgeType?: InputMaybe<AiPersonaBodyOfKnowledgeType>;
  dataAccessMode?: InputMaybe<AiPersonaDataAccessMode>;
  engine?: InputMaybe<AiPersonaEngine>;
  externalConfig?: InputMaybe<ExternalConfigInput>;
  prompt?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateCalendarEventOnCalendarInput = {
  calendarID: Scalars['UUID']['input'];
  /** The length of the event in days. */
  durationDays?: InputMaybe<Scalars['Float']['input']>;
  /** The length of the event in minutes. */
  durationMinutes: Scalars['Float']['input'];
  /** Flag to indicate if this event is for multiple days. */
  multipleDays: Scalars['Boolean']['input'];
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  profileData: CreateProfileInput;
  /** The start date for the event. */
  startDate: Scalars['DateTime']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  type: CalendarEventType;
  /** Is the event visible on the parent calendar. */
  visibleOnParentCalendar: Scalars['Boolean']['input'];
  /** Flag to indicate if this event is for a whole day. */
  wholeDay: Scalars['Boolean']['input'];
};

export type CreateCalloutContributionData = {
  link?: Maybe<CreateLinkData>;
  post?: Maybe<CreatePostData>;
  /** The sort order to assign to this Contribution. */
  sortOrder?: Maybe<Scalars['Float']['output']>;
  whiteboard?: Maybe<CreateWhiteboardData>;
};

export type CreateCalloutContributionDefaultsData = {
  /** The default title to use for new contributions. */
  defaultDisplayName?: Maybe<Scalars['String']['output']>;
  /** The default description to use for new Post contributions. */
  postDescription?: Maybe<Scalars['Markdown']['output']>;
  whiteboardContent?: Maybe<Scalars['WhiteboardContent']['output']>;
};

export type CreateCalloutContributionDefaultsInput = {
  /** The default title to use for new contributions. */
  defaultDisplayName?: InputMaybe<Scalars['String']['input']>;
  /** The default description to use for new Post contributions. */
  postDescription?: InputMaybe<Scalars['Markdown']['input']>;
  whiteboardContent?: InputMaybe<Scalars['WhiteboardContent']['input']>;
};

export type CreateCalloutContributionInput = {
  link?: InputMaybe<CreateLinkInput>;
  post?: InputMaybe<CreatePostInput>;
  /** The sort order to assign to this Contribution. */
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
  whiteboard?: InputMaybe<CreateWhiteboardInput>;
};

export type CreateCalloutData = {
  classification?: Maybe<CreateClassificationData>;
  contributionDefaults?: Maybe<CreateCalloutContributionDefaultsData>;
  /** Contributions to be created with this Callout. */
  contributions?: Maybe<Array<CreateCalloutContributionData>>;
  framing: CreateCalloutFramingData;
  /** A readable identifier, unique within the containing scope. */
  nameID?: Maybe<Scalars['NameID']['output']>;
  /** Send notification if this flag is true and visibility is PUBLISHED. Defaults to false. */
  sendNotification?: Maybe<Scalars['Boolean']['output']>;
  settings?: Maybe<CreateCalloutSettingsData>;
  /** The sort order to assign to this Callout. */
  sortOrder?: Maybe<Scalars['Float']['output']>;
};

export type CreateCalloutFramingData = {
  link?: Maybe<CreateLinkData>;
  memo?: Maybe<CreateMemoData>;
  profile: CreateProfileData;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** The type of additional content attached to the framing of the callout. Defaults to None. */
  type?: Maybe<CalloutFramingType>;
  whiteboard?: Maybe<CreateWhiteboardData>;
};

export type CreateCalloutFramingInput = {
  link?: InputMaybe<CreateLinkInput>;
  memo?: InputMaybe<CreateMemoInput>;
  profile: CreateProfileInput;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The type of additional content attached to the framing of the callout. Defaults to None. */
  type?: InputMaybe<CalloutFramingType>;
  whiteboard?: InputMaybe<CreateWhiteboardInput>;
};

export type CreateCalloutInput = {
  classification?: InputMaybe<CreateClassificationInput>;
  contributionDefaults?: InputMaybe<CreateCalloutContributionDefaultsInput>;
  /** Contributions to be created with this Callout. */
  contributions?: InputMaybe<Array<CreateCalloutContributionInput>>;
  framing: CreateCalloutFramingInput;
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** Send notification if this flag is true and visibility is PUBLISHED. Defaults to false. */
  sendNotification?: InputMaybe<Scalars['Boolean']['input']>;
  settings?: InputMaybe<CreateCalloutSettingsInput>;
  /** The sort order to assign to this Callout. */
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateCalloutOnCalloutsSetInput = {
  calloutsSetID: Scalars['UUID']['input'];
  classification?: InputMaybe<CreateClassificationInput>;
  contributionDefaults?: InputMaybe<CreateCalloutContributionDefaultsInput>;
  /** Contributions to be created with this Callout. */
  contributions?: InputMaybe<Array<CreateCalloutContributionInput>>;
  framing: CreateCalloutFramingInput;
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** Send notification if this flag is true and visibility is PUBLISHED. Defaults to false. */
  sendNotification?: InputMaybe<Scalars['Boolean']['input']>;
  settings?: InputMaybe<CreateCalloutSettingsInput>;
  /** The sort order to assign to this Callout. */
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateCalloutSettingsContributionData = {
  /** Allowed Contribution types. */
  allowedTypes?: Maybe<Array<CalloutContributionType>>;
  /** Indicate who can add more contributions to the callout. */
  canAddContributions?: Maybe<CalloutAllowedContributors>;
  /** Can comment to contributions callout. */
  commentsEnabled?: Maybe<Scalars['Boolean']['output']>;
  /** Can add contributions to the Callout. Allowed Contribution types is going to be readOnly, so this field can be used to enable or disable the contribution temporarily instead of setting allowedTypes to None. */
  enabled?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateCalloutSettingsContributionInput = {
  /** Allowed Contribution types. */
  allowedTypes?: InputMaybe<Array<CalloutContributionType>>;
  /** Indicate who can add more contributions to the callout. */
  canAddContributions?: InputMaybe<CalloutAllowedContributors>;
  /** Can comment to contributions callout. */
  commentsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Can add contributions to the Callout. Allowed Contribution types is going to be readOnly, so this field can be used to enable or disable the contribution temporarily instead of setting allowedTypes to None. */
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateCalloutSettingsData = {
  contribution?: Maybe<CreateCalloutSettingsContributionData>;
  framing?: Maybe<CreateCalloutSettingsFramingData>;
  /** Visibility of the Callout. Defaults to PUBLISHED. */
  visibility?: Maybe<CalloutVisibility>;
};

export type CreateCalloutSettingsFramingData = {
  /** Can comment to callout framing. */
  commentsEnabled?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateCalloutSettingsFramingInput = {
  /** Can comment to callout framing. */
  commentsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateCalloutSettingsInput = {
  contribution?: InputMaybe<CreateCalloutSettingsContributionInput>;
  framing?: InputMaybe<CreateCalloutSettingsFramingInput>;
  /** Visibility of the Callout. Defaults to PUBLISHED. */
  visibility?: InputMaybe<CalloutVisibility>;
};

export type CreateCalloutsSetData = {
  /** The Callouts to add to this Collaboration. */
  calloutsData?: Maybe<Array<CreateCalloutData>>;
};

export type CreateCalloutsSetInput = {
  /** The Callouts to add to this Collaboration. */
  calloutsData?: InputMaybe<Array<CreateCalloutInput>>;
};

export type CreateClassificationData = {
  tagsets: Array<CreateTagsetData>;
};

export type CreateClassificationInput = {
  tagsets: Array<CreateTagsetInput>;
};

export type CreateCollaborationData = {
  /** The CalloutsSet to use for this Collaboration. */
  calloutsSetData: CreateCalloutsSetData;
  /** The InnovationFlow Template to use for this Collaboration. */
  innovationFlowData?: Maybe<CreateInnovationFlowData>;
};

export type CreateCollaborationInput = {
  /** The CalloutsSet to use for this Collaboration. */
  calloutsSetData: CreateCalloutsSetInput;
  /** The InnovationFlow Template to use for this Collaboration. */
  innovationFlowData?: InputMaybe<CreateInnovationFlowInput>;
};

export type CreateCollaborationOnSpaceInput = {
  /** Add callouts from the template to the Collaboration; defaults to true. */
  addCallouts?: InputMaybe<Scalars['Boolean']['input']>;
  /** Add tutorial callouts to the Collaboration; defaults to false. */
  addTutorialCallouts?: InputMaybe<Scalars['Boolean']['input']>;
  /** The CalloutsSet to use for this Collaboration. */
  calloutsSetData: CreateCalloutsSetInput;
  /** The InnovationFlow Template to use for this Collaboration. */
  innovationFlowData?: InputMaybe<CreateInnovationFlowInput>;
};

export type CreateCommunityGuidelinesData = {
  profile: CreateProfileData;
};

export type CreateCommunityGuidelinesInput = {
  profile: CreateProfileInput;
};

export type CreateContributionOnCalloutInput = {
  calloutID: Scalars['UUID']['input'];
  link?: InputMaybe<CreateLinkInput>;
  post?: InputMaybe<CreatePostInput>;
  /** The sort order to assign to this Contribution. */
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
  whiteboard?: InputMaybe<CreateWhiteboardInput>;
};

export type CreateInnovationFlowData = {
  profile: CreateProfileData;
  states: Array<CreateInnovationFlowStateData>;
};

export type CreateInnovationFlowInput = {
  profile: CreateProfileInput;
  states: Array<CreateInnovationFlowStateInput>;
};

export type CreateInnovationFlowStateData = {
  /** The explanation text to clarify the State. */
  description?: Maybe<Scalars['Markdown']['output']>;
  /** The display name for the State */
  displayName: Scalars['String']['output'];
  settings?: Maybe<CreateInnovationFlowStateSettingsData>;
  /** The sort order for the State; if not specified, it will be set to the next highest order. */
  sortOrder?: Maybe<Scalars['Float']['output']>;
};

export type CreateInnovationFlowStateInput = {
  /** The explanation text to clarify the State. */
  description?: InputMaybe<Scalars['Markdown']['input']>;
  /** The display name for the State */
  displayName: Scalars['String']['input'];
  settings?: InputMaybe<CreateInnovationFlowStateSettingsInput>;
  /** The sort order for the State; if not specified, it will be set to the next highest order. */
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateInnovationFlowStateSettingsData = {
  /** The flag to set. */
  allowNewCallouts: Scalars['Boolean']['output'];
};

export type CreateInnovationFlowStateSettingsInput = {
  /** The flag to set. */
  allowNewCallouts: Scalars['Boolean']['input'];
};

export type CreateInnovationHubOnAccountInput = {
  /** The Account where the InnovationHub is to be created. */
  accountID: Scalars['UUID']['input'];
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  profileData: CreateProfileInput;
  /** A list of Spaces to include in this Innovation Hub. Only valid when type 'list' is used. */
  spaceListFilter?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** Spaces with which visibility this Innovation Hub will display. Only valid when type 'visibility' is used. */
  spaceVisibilityFilter?: InputMaybe<SpaceVisibility>;
  /** The subdomain to associate the Innovation Hub with. */
  subdomain: Scalars['String']['input'];
  /** The type of Innovation Hub. */
  type: InnovationHubType;
};

export type CreateInnovationPackOnAccountInput = {
  /** The Account where the InnovationPack is to be created. */
  accountID: Scalars['UUID']['input'];
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  profileData: CreateProfileInput;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateKnowledgeBaseInput = {
  /** The CalloutsSet to use for this KnowledgeBase. */
  calloutsSetData?: InputMaybe<CreateCalloutsSetInput>;
  /** The Profile to use for this KnowledgeBase. */
  profile: CreateProfileInput;
};

export type CreateLicensePlanOnLicensingFrameworkInput = {
  /** Assign this plan to all new Organization accounts */
  assignToNewOrganizationAccounts: Scalars['Boolean']['input'];
  /** Assign this plan to all new User accounts */
  assignToNewUserAccounts: Scalars['Boolean']['input'];
  /** Is this plan enabled? */
  enabled: Scalars['Boolean']['input'];
  /** Is this plan free? */
  isFree: Scalars['Boolean']['input'];
  /** The credential to represent this plan */
  licenseCredential: LicensingCredentialBasedCredentialType;
  licensingFrameworkID: Scalars['UUID']['input'];
  /** The name of the License Plan */
  name: Scalars['String']['input'];
  /** The price per month of this plan. */
  pricePerMonth?: InputMaybe<Scalars['Float']['input']>;
  /** Does this plan require contact support */
  requiresContactSupport: Scalars['Boolean']['input'];
  /** Does this plan require a payment method? */
  requiresPaymentMethod: Scalars['Boolean']['input'];
  /** The sorting order for this Plan. */
  sortOrder: Scalars['Float']['input'];
  /** Is there a trial period enabled */
  trialEnabled: Scalars['Boolean']['input'];
  /** The type of this License Plan. */
  type: LicensingCredentialBasedPlanType;
};

export type CreateLinkData = {
  profile: CreateProfileData;
  uri?: Maybe<Scalars['String']['output']>;
};

export type CreateLinkInput = {
  profile: CreateProfileInput;
  uri?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLocationData = {
  addressLine1?: Maybe<Scalars['String']['output']>;
  addressLine2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  stateOrProvince?: Maybe<Scalars['String']['output']>;
};

export type CreateLocationInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  stateOrProvince?: InputMaybe<Scalars['String']['input']>;
};

export type CreateMemoData = {
  profile?: Maybe<CreateProfileData>;
};

export type CreateMemoInput = {
  profile?: InputMaybe<CreateProfileInput>;
};

export type CreateNvpInput = {
  name: Scalars['String']['input'];
  sortOrder: Scalars['Float']['input'];
  value: Scalars['String']['input'];
};

export type CreateOrganizationInput = {
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  legalEntityName?: InputMaybe<Scalars['String']['input']>;
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  profileData: CreateProfileInput;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePostData = {
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export type CreatePostInput = {
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  profileData: CreateProfileInput;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateProfileData = {
  description?: Maybe<Scalars['Markdown']['output']>;
  /** The display name for the entity. */
  displayName: Scalars['String']['output'];
  location?: Maybe<CreateLocationData>;
  referencesData?: Maybe<Array<CreateReferenceData>>;
  /** A memorable short description for this entity. */
  tagline?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  tagsets?: Maybe<Array<CreateTagsetData>>;
  /** The visuals URLs */
  visuals?: Maybe<Array<CreateVisualOnProfileData>>;
};

export type CreateProfileInput = {
  description?: InputMaybe<Scalars['Markdown']['input']>;
  /** The display name for the entity. */
  displayName: Scalars['String']['input'];
  location?: InputMaybe<CreateLocationInput>;
  referencesData?: InputMaybe<Array<CreateReferenceInput>>;
  /** A memorable short description for this entity. */
  tagline?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  tagsets?: InputMaybe<Array<CreateTagsetInput>>;
  /** The visuals URLs */
  visuals?: InputMaybe<Array<CreateVisualOnProfileInput>>;
};

export type CreateReferenceData = {
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uri?: Maybe<Scalars['String']['output']>;
};

export type CreateReferenceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  uri?: InputMaybe<Scalars['String']['input']>;
};

export type CreateReferenceOnProfileInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  profileID: Scalars['UUID']['input'];
  uri?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSpaceAboutInput = {
  /** The CommunityGuidelines for the Space */
  guidelines?: InputMaybe<CreateCommunityGuidelinesInput>;
  profileData: CreateProfileInput;
  who?: InputMaybe<Scalars['Markdown']['input']>;
  why?: InputMaybe<Scalars['Markdown']['input']>;
};

export type CreateSpaceOnAccountInput = {
  about: CreateSpaceAboutInput;
  /** The Account where the Space is to be created. */
  accountID: Scalars['UUID']['input'];
  collaborationData: CreateCollaborationOnSpaceInput;
  /** The license plan the user wishes to use when creating the space. */
  licensePlanID?: InputMaybe<Scalars['UUID']['input']>;
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  settings?: InputMaybe<CreateSpaceSettingsInput>;
  /** The Template to use for instantiating the Collaboration. */
  spaceTemplateID?: InputMaybe<Scalars['UUID']['input']>;
};

export type CreateSpaceSettingsCollaborationInput = {
  /** Flag to control if events from Subspaces are visible on this Space calendar as well. */
  allowEventsFromSubspaces: Scalars['Boolean']['input'];
  /** Flag to control if members can create callouts. */
  allowMembersToCreateCallouts: Scalars['Boolean']['input'];
  /** Flag to control if members can create subspaces. */
  allowMembersToCreateSubspaces: Scalars['Boolean']['input'];
  /** Flag to control if ability to contribute is inherited from parent Space. */
  inheritMembershipRights: Scalars['Boolean']['input'];
};

export type CreateSpaceSettingsInput = {
  collaboration?: InputMaybe<CreateSpaceSettingsCollaborationInput>;
  membership?: InputMaybe<CreateSpaceSettingsMembershipInput>;
  privacy?: InputMaybe<CreateSpaceSettingsPrivacyInput>;
};

export type CreateSpaceSettingsMembershipInput = {
  /** Flag to control if Subspace admins can invite for this Space. */
  allowSubspaceAdminsToInviteMembers: Scalars['Boolean']['input'];
  /** The membership policy in usage for this Space */
  policy: CommunityMembershipPolicy;
  /** The organizations that are trusted to Join as members for this Space */
  trustedOrganizations: Array<Scalars['UUID']['input']>;
};

export type CreateSpaceSettingsPrivacyInput = {
  /** Flag to control if Platform Support has admin rights. */
  allowPlatformSupportAsAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  mode?: InputMaybe<SpacePrivacyMode>;
};

export type CreateStateOnInnovationFlowInput = {
  /** The explanation text to clarify the State. */
  description?: InputMaybe<Scalars['Markdown']['input']>;
  /** The display name for the State */
  displayName: Scalars['String']['input'];
  innovationFlowID: Scalars['UUID']['input'];
  settings?: InputMaybe<CreateInnovationFlowStateSettingsInput>;
  /** The sort order for the State; if not specified, it will be set to the next highest order. */
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateSubspaceInput = {
  about: CreateSpaceAboutInput;
  collaborationData: CreateCollaborationOnSpaceInput;
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  settings?: InputMaybe<CreateSpaceSettingsInput>;
  spaceID: Scalars['UUID']['input'];
  /** The Template to use for instantiating the Collaboration. */
  spaceTemplateID?: InputMaybe<Scalars['UUID']['input']>;
};

export type CreateTagsetData = {
  name: Scalars['String']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  type?: Maybe<TagsetType>;
};

export type CreateTagsetInput = {
  name: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<TagsetType>;
};

export type CreateTagsetOnProfileInput = {
  name: Scalars['String']['input'];
  profileID?: InputMaybe<Scalars['UUID']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<TagsetType>;
};

export type CreateTemplateContentSpaceInput = {
  about: CreateSpaceAboutInput;
  collaborationData: CreateCollaborationInput;
  level: SpaceLevel;
  /** Create the settings for the Space. */
  settings: CreateSpaceSettingsInput;
  subspaces?: InputMaybe<Array<CreateTemplateContentSpaceInput>>;
};

export type CreateTemplateFromContentSpaceOnTemplatesSetInput = {
  /** The ID of the ContentSpace to use as for the Template. */
  contentSpaceID: Scalars['UUID']['input'];
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  profileData: CreateProfileInput;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  templatesSetID: Scalars['UUID']['input'];
};

export type CreateTemplateFromSpaceOnTemplatesSetInput = {
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  profileData: CreateProfileInput;
  /** Whether to reproduce the hierarchy or just the space. */
  recursive?: InputMaybe<Scalars['Boolean']['input']>;
  /** The ID of the Space to use as the content for the Template. */
  spaceID: Scalars['UUID']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  templatesSetID: Scalars['UUID']['input'];
};

export type CreateTemplateOnTemplatesSetInput = {
  /** The Callout to associate with this template. */
  calloutData?: InputMaybe<CreateCalloutInput>;
  /** The Community guidelines to associate with this template. */
  communityGuidelinesData?: InputMaybe<CreateCommunityGuidelinesInput>;
  /** The Template Content for a Space to associate with this template. */
  contentSpaceData?: InputMaybe<CreateTemplateContentSpaceInput>;
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** Post Template: The default description to be pre-filled. */
  postDefaultDescription?: InputMaybe<Scalars['Markdown']['input']>;
  profileData: CreateProfileInput;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  templatesSetID: Scalars['UUID']['input'];
  /** The type of the Template to be created. */
  type: TemplateType;
  /** The Whiteboard to associate with this template. */
  whiteboard?: InputMaybe<CreateWhiteboardInput>;
};

export type CreateUserGroupInput = {
  parentID: Scalars['UUID']['input'];
  profile: CreateProfileInput;
};

export type CreateUserInput = {
  accountUpn?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  profileData: CreateProfileInput;
};

export type CreateVirtualContributorOnAccountInput = {
  /** The Account where the VirtualContributor is to be created. */
  accountID: Scalars['UUID']['input'];
  /** Data used to create the AI Persona */
  aiPersona: CreateAiPersonaInput;
  /** The KnowledgeBase to use for this Collaboration. */
  knowledgeBaseData?: InputMaybe<CreateKnowledgeBaseInput>;
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  profileData: CreateProfileInput;
};

export type CreateVisualOnProfileData = {
  /** The type of visual. */
  name: VisualType;
  /** The URI of the image. Needs to be a url inside Alkemio already uploaded to a StorageBucket. It will be then copied to the Profile holding this Visual. */
  uri: Scalars['String']['output'];
};

export type CreateVisualOnProfileInput = {
  /** The type of visual. */
  name: VisualType;
  /** The URI of the image. Needs to be a url inside Alkemio already uploaded to a StorageBucket. It will be then copied to the Profile holding this Visual. */
  uri: Scalars['String']['input'];
};

export type CreateWhiteboardData = {
  content?: Maybe<Scalars['WhiteboardContent']['output']>;
  /** A readable identifier, unique within the containing scope. */
  nameID?: Maybe<Scalars['NameID']['output']>;
  profile?: Maybe<CreateProfileData>;
};

export type CreateWhiteboardInput = {
  content?: InputMaybe<Scalars['WhiteboardContent']['input']>;
  /** A readable identifier, unique within the containing scope. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  profile?: InputMaybe<CreateProfileInput>;
};

export type Credential = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The timestamp for the expiry of this credential. */
  expires?: Maybe<Scalars['Float']['output']>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The User issuing the credential */
  issuer?: Maybe<Scalars['UUID']['output']>;
  resourceID: Scalars['String']['output'];
  type: CredentialType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type CredentialDefinition = {
  /** The resourceID for this CredentialDefinition */
  resourceID: Scalars['String']['output'];
  /** The type for this CredentialDefinition */
  type: Scalars['String']['output'];
};

export type CredentialMetadataOutput = {
  /** A json description of what the claim contains and schema validation definition */
  context: Scalars['String']['output'];
  /** The purpose of the credential */
  description: Scalars['String']['output'];
  /** The display name of the credential */
  name: Scalars['String']['output'];
  /** The schema that the credential will be validated against */
  schema: Scalars['String']['output'];
  /** The credential types that are associated with this credential */
  types: Array<Scalars['String']['output']>;
  /** System recognized unique type for the credential */
  uniqueType: Scalars['String']['output'];
};

export enum CredentialType {
  AccountAdmin = 'ACCOUNT_ADMIN',
  AccountLicensePlus = 'ACCOUNT_LICENSE_PLUS',
  BetaTester = 'BETA_TESTER',
  GlobalAdmin = 'GLOBAL_ADMIN',
  GlobalAnonymous = 'GLOBAL_ANONYMOUS',
  GlobalCommunityRead = 'GLOBAL_COMMUNITY_READ',
  GlobalLicenseManager = 'GLOBAL_LICENSE_MANAGER',
  GlobalPlatformManager = 'GLOBAL_PLATFORM_MANAGER',
  GlobalRegistered = 'GLOBAL_REGISTERED',
  GlobalSpacesReader = 'GLOBAL_SPACES_READER',
  GlobalSupport = 'GLOBAL_SUPPORT',
  GlobalSupportManager = 'GLOBAL_SUPPORT_MANAGER',
  OrganizationAdmin = 'ORGANIZATION_ADMIN',
  OrganizationAssociate = 'ORGANIZATION_ASSOCIATE',
  OrganizationOwner = 'ORGANIZATION_OWNER',
  SpaceAdmin = 'SPACE_ADMIN',
  SpaceFeatureMemoMultiUser = 'SPACE_FEATURE_MEMO_MULTI_USER',
  SpaceFeatureSaveAsTemplate = 'SPACE_FEATURE_SAVE_AS_TEMPLATE',
  SpaceFeatureVirtualContributors = 'SPACE_FEATURE_VIRTUAL_CONTRIBUTORS',
  SpaceFeatureWhiteboardMultiUser = 'SPACE_FEATURE_WHITEBOARD_MULTI_USER',
  SpaceLead = 'SPACE_LEAD',
  SpaceLicenseEnterprise = 'SPACE_LICENSE_ENTERPRISE',
  SpaceLicenseFree = 'SPACE_LICENSE_FREE',
  SpaceLicensePlus = 'SPACE_LICENSE_PLUS',
  SpaceLicensePremium = 'SPACE_LICENSE_PREMIUM',
  SpaceMember = 'SPACE_MEMBER',
  SpaceMemberInvitee = 'SPACE_MEMBER_INVITEE',
  SpaceSubspaceAdmin = 'SPACE_SUBSPACE_ADMIN',
  UserGroupMember = 'USER_GROUP_MEMBER',
  UserSelfManagement = 'USER_SELF_MANAGEMENT',
  VcCampaign = 'VC_CAMPAIGN',
}

export type DeleteAiPersonaServiceInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteApplicationInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteCalendarEventInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteCalloutInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteDiscussionInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteDocumentInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteInnovationHubInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteInnovationPackInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteInvitationInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteLicensePlanInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteLinkInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteMemoInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteOrganizationInput = {
  ID: Scalars['UUID']['input'];
};

export type DeletePlatformInvitationInput = {
  ID: Scalars['UUID']['input'];
};

export type DeletePostInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteReferenceInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteSpaceInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteStateOnInnovationFlowInput = {
  ID: Scalars['UUID']['input'];
  innovationFlowID: Scalars['UUID']['input'];
};

export type DeleteStorageBuckeetInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteTemplateInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteUserGroupInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteUserInput = {
  ID: Scalars['UUID']['input'];
  deleteIdentity?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeleteVirtualContributorInput = {
  ID: Scalars['UUID']['input'];
};

export type DeleteWhiteboardInput = {
  ID: Scalars['UUID']['input'];
};

export type DirectRoom = {
  /** The display name of the room */
  displayName: Scalars['String']['output'];
  /** The identifier of the room */
  id: Scalars['String']['output'];
  /** The messages that have been sent to the Room. */
  messages: Array<Message>;
  /** The recipient userID */
  receiverID?: Maybe<Scalars['String']['output']>;
};

export type Discussion = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The category assigned to this Discussion. */
  category: ForumDiscussionCategory;
  /** The comments for this Discussion. */
  comments: Room;
  /** The id of the user that created this discussion */
  createdBy?: Maybe<Scalars['UUID']['output']>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** Privacy mode for the Discussion. Note: this is not yet implemented in the authorization policy. */
  privacy: ForumDiscussionPrivacy;
  /** The Profile for this Discussion. */
  profile: Profile;
  /** The timestamp for the creation of this Discussion. */
  timestamp?: Maybe<Scalars['Float']['output']>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type DiscussionsInput = {
  /** The number of Discussion entries to return; if omitted return all Discussions. */
  limit?: InputMaybe<Scalars['Float']['input']>;
  /** The sort order of the Discussions to return. */
  orderBy?: InputMaybe<DiscussionsOrderBy>;
};

export enum DiscussionsOrderBy {
  DiscussionsCreatedateAsc = 'DISCUSSIONS_CREATEDATE_ASC',
  DiscussionsCreatedateDesc = 'DISCUSSIONS_CREATEDATE_DESC',
}

export type Document = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The user that created this Document */
  createdBy?: Maybe<User>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The display name. */
  displayName: Scalars['String']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Mime type for this Document. */
  mimeType: MimeType;
  /** Size of the Document. */
  size: Scalars['Float']['output'];
  /** The tagset in use on this Document. */
  tagset: Tagset;
  /** Whether this Document is in its end location or not. */
  temporaryLocation: Scalars['Boolean']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The uploaded date of this Document */
  uploadedDate: Scalars['DateTime']['output'];
  /** The URL to be used to retrieve the Document */
  url: Scalars['String']['output'];
};

export type ExploreSpacesInput = {
  /** Take into account only the activity in the past X days. */
  daysOld?: InputMaybe<Scalars['Float']['input']>;
  /** Amount of Spaces returned. */
  limit?: InputMaybe<Scalars['Float']['input']>;
};

export type ExternalConfig = {
  /** The API key for the external LLM provider. */
  apiKey?: Maybe<Scalars['String']['output']>;
  /** The assistant ID backing the service in OpenAI`s assistant API */
  assistantId?: Maybe<Scalars['String']['output']>;
  /** The OpenAI model to use for the service */
  model: OpenAiModel;
};

export type ExternalConfigInput = {
  /** The API key for the external LLM provider. */
  apiKey?: InputMaybe<Scalars['String']['input']>;
  /** The assistant ID backing the service in OpenAI`s assistant API */
  assistantId?: InputMaybe<Scalars['String']['input']>;
  /** The OpenAI model to use for the service */
  model?: OpenAiModel;
};

export type FileStorageConfig = {
  /** Max file size, in bytes. */
  maxFileSize: Scalars['Float']['output'];
};

export type Form = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** A description of the purpose of this Form. */
  description?: Maybe<Scalars['Markdown']['output']>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The set of Questions in this Form. */
  questions: Array<FormQuestion>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type FormQuestion = {
  /** The explation text to clarify the question. */
  explanation: Scalars['String']['output'];
  /** The maxiumum length of the answer, in characters, up to a limit of 512. */
  maxLength: Scalars['Float']['output'];
  /** The question to be answered */
  question: Scalars['String']['output'];
  /** Whether this Question requires an answer or not. */
  required: Scalars['Boolean']['output'];
  /** The sort order of this question in a wider set of questions. */
  sortOrder: Scalars['Float']['output'];
};

export type Forum = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** A particular Discussions active in this Forum. */
  discussion?: Maybe<Discussion>;
  discussionCategories: Array<ForumDiscussionCategory>;
  /** The Discussions active in this Forum. */
  discussions?: Maybe<Array<Discussion>>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type ForumDiscussionArgs = {
  ID: Scalars['UUID']['input'];
};

export type ForumDiscussionsArgs = {
  queryData?: InputMaybe<DiscussionsInput>;
};

export type ForumCreateDiscussionInput = {
  /** The category for the Discussion */
  category: ForumDiscussionCategory;
  /** The identifier for the Forum entity the Discussion is being created on. */
  forumID: Scalars['UUID']['input'];
  profile: CreateProfileInput;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum ForumDiscussionCategory {
  ChallengeCentric = 'CHALLENGE_CENTRIC',
  CommunityBuilding = 'COMMUNITY_BUILDING',
  Help = 'HELP',
  Other = 'OTHER',
  PlatformFunctionalities = 'PLATFORM_FUNCTIONALITIES',
  Releases = 'RELEASES',
}

export enum ForumDiscussionPrivacy {
  Authenticated = 'AUTHENTICATED',
  Author = 'AUTHOR',
  Public = 'PUBLIC',
}

export type Geo = {
  /** Endpoint where geo information is consumed from. */
  endpoint: Scalars['String']['output'];
};

export type GeoLocation = {
  /** The Latitude for this Location, derived from (City, Country) if those are set. */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** The Longitude for this Location, derived from (City, Country) if those are set. */
  longitude?: Maybe<Scalars['Float']['output']>;
};

export type GrantAuthorizationCredentialInput = {
  /** The resource to which this credential is tied. */
  resourceID?: InputMaybe<Scalars['UUID']['input']>;
  type: AuthorizationCredential;
  /** The user to whom the credential is being granted. */
  userID: Scalars['UUID']['input'];
};

export type GrantOrganizationAuthorizationCredentialInput = {
  /** The Organization to whom the credential is being granted. */
  organizationID: Scalars['UUID']['input'];
  /** The resource to which this credential is tied. */
  resourceID?: InputMaybe<Scalars['UUID']['input']>;
  type: AuthorizationCredential;
};

export type Groupable = {
  /** The groups contained by this entity. */
  groups?: Maybe<Array<UserGroup>>;
};

export type ISearchCategoryResult = {
  /** Provide this with your next search query to fetch the next set of results. */
  cursor?: Maybe<Scalars['SearchCursor']['output']>;
  /** The ranked search results for this category, sorted by relevance */
  results: Array<SearchResult>;
  /** The total number of search results. Not implemented yet. */
  total: Scalars['Float']['output'];
};

export type ISearchResults = {
  /** The search results for Callouts. */
  calloutResults: ISearchCategoryResult;
  /** The search results for contributions (Posts, Whiteboards etc). */
  contributionResults: ISearchCategoryResult;
  /** The search results for contributors (Users, Organizations). */
  contributorResults: ISearchCategoryResult;
  /** The search results for Spaces / Subspaces. */
  spaceResults: ISearchCategoryResult;
};

/** An in-app notification type. To not be queried directly */
export type InAppNotification = {
  /** Which category (role) is this notification targeted to. */
  category: InAppNotificationCategory;
  id: Scalars['UUID']['output'];
  /** The receiver of the notification. */
  receiver: Contributor;
  /** The current state of the notification */
  state: InAppNotificationState;
  /** When (UTC) was the notification sent. */
  triggeredAt: Scalars['DateTime']['output'];
  /** The Contributor who triggered the notification. */
  triggeredBy?: Maybe<Contributor>;
  /** The type of the notification */
  type: NotificationEvent;
};

export type InAppNotificationCalloutPublished = InAppNotification & {
  /** The Callout that was published. */
  callout?: Maybe<Callout>;
  /** Which category (role) is this notification targeted to. */
  category: InAppNotificationCategory;
  id: Scalars['UUID']['output'];
  /** The receiver of the notification. */
  receiver: Contributor;
  /** Where the callout is located. */
  space?: Maybe<Space>;
  /** The current state of the notification */
  state: InAppNotificationState;
  /** When (UTC) was the notification sent. */
  triggeredAt: Scalars['DateTime']['output'];
  /** The Contributor who triggered the notification. */
  triggeredBy?: Maybe<Contributor>;
  /** The type of the notification */
  type: NotificationEvent;
};

/** Which category (role) is this notification targeted to. */
export enum InAppNotificationCategory {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Self = 'SELF',
}

export type InAppNotificationCommunityNewMember = InAppNotification & {
  /** The Contributor that joined. */
  actor?: Maybe<Contributor>;
  /** Which category (role) is this notification targeted to. */
  category: InAppNotificationCategory;
  /** The type of the Contributor that joined. */
  contributorType: RoleSetContributorType;
  id: Scalars['UUID']['output'];
  /** The receiver of the notification. */
  receiver: Contributor;
  /** The Space that was joined. */
  space?: Maybe<Space>;
  /** The current state of the notification */
  state: InAppNotificationState;
  /** When (UTC) was the notification sent. */
  triggeredAt: Scalars['DateTime']['output'];
  /** The Contributor who triggered the notification. */
  triggeredBy?: Maybe<Contributor>;
  /** The type of the notification */
  type: NotificationEvent;
};

export enum InAppNotificationState {
  Archived = 'ARCHIVED',
  Read = 'READ',
  Unread = 'UNREAD',
}

export type InAppNotificationUserMentioned = InAppNotification & {
  /** Which category (role) is this notification targeted to. */
  category: InAppNotificationCategory;
  /** The comment that the contributor was mentioned in. */
  comment: Scalars['String']['output'];
  /** The display name of the resource where the comment was created. */
  commentOriginName: Scalars['String']['output'];
  /** The url of the resource where the comment was created. */
  commentUrl: Scalars['String']['output'];
  /** The type of the Contributor that joined. */
  contributorType: RoleSetContributorType;
  id: Scalars['UUID']['output'];
  /** The receiver of the notification. */
  receiver: Contributor;
  /** The current state of the notification */
  state: InAppNotificationState;
  /** When (UTC) was the notification sent. */
  triggeredAt: Scalars['DateTime']['output'];
  /** The Contributor who triggered the notification. */
  triggeredBy?: Maybe<Contributor>;
  /** The type of the notification */
  type: NotificationEvent;
};

export type InnovationFlow = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The currently selected State in this Flow. */
  currentState?: Maybe<InnovationFlowState>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The Profile for this InnovationFlow. */
  profile: Profile;
  /** The settings for this InnovationFlow. */
  settings: InnovationFlowSettings;
  /** The States for this InnovationFlow. */
  states: Array<InnovationFlowState>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type InnovationFlowSettings = {
  /** The maximum number of allowed states. */
  maximumNumberOfStates: Scalars['Float']['output'];
  /** The minimum number of allowed states */
  minimumNumberOfStates: Scalars['Float']['output'];
};

export type InnovationFlowState = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The explanation text to clarify the state. */
  description?: Maybe<Scalars['Markdown']['output']>;
  /** The display name for the State */
  displayName: Scalars['String']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The Settings associated with this InnovationFlowState. */
  settings: InnovationFlowStateSettings;
  /** The sorting order for this State. */
  sortOrder: Scalars['Float']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type InnovationFlowStateSettings = {
  /** Whether new callouts can be added to this State. */
  allowNewCallouts: Scalars['Boolean']['output'];
};

export type InnovationHub = {
  /** The Innovation Hub account. */
  account: Account;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Flag to control if this InnovationHub is listed in the platform store. */
  listedInStore: Scalars['Boolean']['output'];
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The Innovation Hub profile. */
  profile: Profile;
  /** The InnovationHub provider. */
  provider: Contributor;
  /** Visibility of the InnovationHub in searches. */
  searchVisibility: SearchVisibility;
  spaceListFilter?: Maybe<Array<Space>>;
  /** If defined, what type of visibility to filter the Spaces on. You can have only one type of filter active at any given time. */
  spaceVisibilityFilter?: Maybe<SpaceVisibility>;
  /** The subdomain associated with this Innovation Hub. */
  subdomain: Scalars['String']['output'];
  /** Type of Innovation Hub */
  type: InnovationHubType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export enum InnovationHubType {
  List = 'LIST',
  Visibility = 'VISIBILITY',
}

export type InnovationPack = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Flag to control if this InnovationPack is listed in the platform store. */
  listedInStore: Scalars['Boolean']['output'];
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The Profile for this InnovationPack. */
  profile: Profile;
  /** The InnovationPack provider. */
  provider: Contributor;
  /** Visibility of the InnovationPack in searches. */
  searchVisibility: SearchVisibility;
  /** The templatesSet in use by this InnovationPack */
  templatesSet?: Maybe<TemplatesSet>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type InnovationPacksInput = {
  /** The number of Discussion entries to return; if omitted return all InnovationPacks. */
  limit?: InputMaybe<Scalars['Float']['input']>;
  /** The sort order of the InnovationPacks to return. Defaults to number of templates Descending. */
  orderBy?: InputMaybe<InnovationPacksOrderBy>;
};

export enum InnovationPacksOrderBy {
  NumberOfTemplatesAsc = 'NUMBER_OF_TEMPLATES_ASC',
  NumberOfTemplatesDesc = 'NUMBER_OF_TEMPLATES_DESC',
  Random = 'RANDOM',
}

export type InputCreatorQueryResults = {
  /** Create an input based on the provided Callout */
  callout?: Maybe<CreateCalloutData>;
  /** Create an input based on the provided Collaboration */
  collaboration?: Maybe<CreateCollaborationData>;
  /** Create an input based on the provided Community Guidelines */
  communityGuidelines?: Maybe<CreateCommunityGuidelinesData>;
  /** Create an input based on the provided InnovationFlow */
  innovationFlow?: Maybe<CreateInnovationFlowData>;
  /** Create an input based on the provided Whiteboard */
  whiteboard?: Maybe<CreateWhiteboardData>;
};

export type InputCreatorQueryResultsCalloutArgs = {
  ID: Scalars['UUID']['input'];
};

export type InputCreatorQueryResultsCollaborationArgs = {
  ID: Scalars['UUID']['input'];
};

export type InputCreatorQueryResultsCommunityGuidelinesArgs = {
  ID: Scalars['UUID']['input'];
};

export type InputCreatorQueryResultsInnovationFlowArgs = {
  ID: Scalars['UUID']['input'];
};

export type InputCreatorQueryResultsWhiteboardArgs = {
  ID: Scalars['UUID']['input'];
};

export type Invitation = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The Contributor who is invited. */
  contributor: Contributor;
  /** The type of contributor that is invited. */
  contributorType: RoleSetContributorType;
  /** The User who triggered the invitation. */
  createdBy?: Maybe<User>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** Additional roles to assign to the Contributor, in addition to the entry Role. */
  extraRoles: Array<RoleName>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Whether to also add the invited contributor to the parent community. */
  invitedToParent: Scalars['Boolean']['output'];
  /** Is this lifecycle in a final state (done). */
  isFinalized: Scalars['Boolean']['output'];
  lifecycle: Lifecycle;
  /** The next events of this Lifecycle. */
  nextEvents: Array<Scalars['String']['output']>;
  /** The current state of this Lifecycle. */
  state: Scalars['String']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  welcomeMessage?: Maybe<Scalars['String']['output']>;
};

export type InvitationEventInput = {
  eventName: Scalars['String']['input'];
  invitationID: Scalars['UUID']['input'];
};

export type InviteForEntryRoleOnRoleSetInput = {
  /** Additional roles to assign in addition to the entry Role. */
  extraRoles: Array<RoleName>;
  /** The identifiers for the contributors being invited. */
  invitedContributorIDs: Array<Scalars['UUID']['input']>;
  invitedUserEmails: Array<Scalars['String']['input']>;
  roleSetID: Scalars['UUID']['input'];
  /** The welcome message to send */
  welcomeMessage?: InputMaybe<Scalars['String']['input']>;
};

export type JoinAsEntryRoleOnRoleSetInput = {
  roleSetID: Scalars['UUID']['input'];
};

export type KnowledgeBase = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The calloutsSet with Callouts in use by this KnowledgeBase */
  calloutsSet: CalloutsSet;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The Profile for describing this KnowledgeBase. */
  profile: Profile;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type LatestReleaseDiscussion = {
  /** Id of the latest release discussion. */
  id: Scalars['String']['output'];
  /** NameID of the latest release discussion. */
  nameID: Scalars['String']['output'];
};

export type Library = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The InnovationHub listed on this platform */
  innovationHubs: Array<InnovationHub>;
  /** The Innovation Packs in the platform Innovation Library. */
  innovationPacks: Array<InnovationPack>;
  /** The Templates in the Innovation Library, together with information about the InnovationPack. */
  templates: Array<TemplateResult>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The VirtualContributors listed on this platform */
  virtualContributors: Array<VirtualContributor>;
};

export type LibraryInnovationPacksArgs = {
  queryData?: InputMaybe<InnovationPacksInput>;
};

export type LibraryTemplatesArgs = {
  filter?: InputMaybe<LibraryTemplatesFilterInput>;
};

export type LibraryTemplatesFilterInput = {
  /** Return Templates within the Library matching the specified Template Types. */
  types?: InputMaybe<Array<TemplateType>>;
};

export type License = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The set of License Entitlement Types on that entity. */
  availableEntitlements?: Maybe<Array<LicenseEntitlementType>>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The set of Entitlements associated with the License applicable to this entity. */
  entitlements: Array<LicenseEntitlement>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The type of entity that this License is being used with. */
  type?: Maybe<LicenseType>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type LicenseEntitlement = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** Data type of the entitlement, e.g. Limit, Feature flag etc. */
  dataType: LicenseEntitlementDataType;
  /** If the Entitlement is enabled */
  enabled: Scalars['Boolean']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Whether the specified entitlement is available. */
  isAvailable: Scalars['Boolean']['output'];
  /** Limit of the entitlement */
  limit: Scalars['Float']['output'];
  /** Type of the entitlement, e.g. Space, Whiteboard contributors etc. */
  type: LicenseEntitlementType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The amount of the spcified entitlement used. */
  usage: Scalars['Float']['output'];
};

export enum LicenseEntitlementDataType {
  Flag = 'FLAG',
  Limit = 'LIMIT',
}

export enum LicenseEntitlementType {
  AccountInnovationHub = 'ACCOUNT_INNOVATION_HUB',
  AccountInnovationPack = 'ACCOUNT_INNOVATION_PACK',
  AccountSpaceFree = 'ACCOUNT_SPACE_FREE',
  AccountSpacePlus = 'ACCOUNT_SPACE_PLUS',
  AccountSpacePremium = 'ACCOUNT_SPACE_PREMIUM',
  AccountVirtualContributor = 'ACCOUNT_VIRTUAL_CONTRIBUTOR',
  SpaceFlagMemoMultiUser = 'SPACE_FLAG_MEMO_MULTI_USER',
  SpaceFlagSaveAsTemplate = 'SPACE_FLAG_SAVE_AS_TEMPLATE',
  SpaceFlagVirtualContributorAccess = 'SPACE_FLAG_VIRTUAL_CONTRIBUTOR_ACCESS',
  SpaceFlagWhiteboardMultiUser = 'SPACE_FLAG_WHITEBOARD_MULTI_USER',
  SpaceFree = 'SPACE_FREE',
  SpacePlus = 'SPACE_PLUS',
  SpacePremium = 'SPACE_PREMIUM',
}

export type LicensePlan = {
  /** Assign this plan to all new Organization accounts */
  assignToNewOrganizationAccounts: Scalars['Boolean']['output'];
  /** Assign this plan to all new User accounts */
  assignToNewUserAccounts: Scalars['Boolean']['output'];
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** Is this plan enabled? */
  enabled: Scalars['Boolean']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Is this plan free? */
  isFree: Scalars['Boolean']['output'];
  /** The credential to represent this plan */
  licenseCredential: LicensingCredentialBasedCredentialType;
  /** The name of the License Plan */
  name: Scalars['String']['output'];
  /** The price per month of this plan. */
  pricePerMonth?: Maybe<Scalars['Float']['output']>;
  /** Does this plan require contact support */
  requiresContactSupport: Scalars['Boolean']['output'];
  /** Does this plan require a payment method? */
  requiresPaymentMethod: Scalars['Boolean']['output'];
  /** The sorting order for this Plan. */
  sortOrder: Scalars['Float']['output'];
  /** Is there a trial period enabled */
  trialEnabled: Scalars['Boolean']['output'];
  /** The type of this License Plan. */
  type: LicensingCredentialBasedPlanType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type LicensePolicy = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The set of credential rules that are contained by this License Policy. */
  credentialRules: Array<LicensingCredentialBasedPolicyCredentialRule>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export enum LicenseType {
  Account = 'ACCOUNT',
  Collaboration = 'COLLABORATION',
  Roleset = 'ROLESET',
  Space = 'SPACE',
  TemplateContentSpace = 'TEMPLATE_CONTENT_SPACE',
  Whiteboard = 'WHITEBOARD',
}

export type Licensing = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The License Plans in use on the platform. */
  plans: Array<LicensePlan>;
  /** The LicensePolicy in use by the Licensing setup. */
  policy: LicensePolicy;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export enum LicensingCredentialBasedCredentialType {
  AccountLicensePlus = 'ACCOUNT_LICENSE_PLUS',
  SpaceFeatureMemoMultiUser = 'SPACE_FEATURE_MEMO_MULTI_USER',
  SpaceFeatureSaveAsTemplate = 'SPACE_FEATURE_SAVE_AS_TEMPLATE',
  SpaceFeatureVirtualContributors = 'SPACE_FEATURE_VIRTUAL_CONTRIBUTORS',
  SpaceFeatureWhiteboardMultiUser = 'SPACE_FEATURE_WHITEBOARD_MULTI_USER',
  SpaceLicenseEnterprise = 'SPACE_LICENSE_ENTERPRISE',
  SpaceLicenseFree = 'SPACE_LICENSE_FREE',
  SpaceLicensePlus = 'SPACE_LICENSE_PLUS',
  SpaceLicensePremium = 'SPACE_LICENSE_PREMIUM',
}

export enum LicensingCredentialBasedPlanType {
  AccountFeatureFlag = 'ACCOUNT_FEATURE_FLAG',
  AccountPlan = 'ACCOUNT_PLAN',
  SpaceFeatureFlag = 'SPACE_FEATURE_FLAG',
  SpacePlan = 'SPACE_PLAN',
}

export type LicensingCredentialBasedPolicyCredentialRule = {
  credentialType: LicensingCredentialBasedCredentialType;
  grantedEntitlements: Array<LicensingGrantedEntitlement>;
  name?: Maybe<Scalars['String']['output']>;
};

export type LicensingGrantedEntitlement = {
  limit: Scalars['Float']['output'];
  /** The entitlement that is granted. */
  type: LicenseEntitlementType;
};

export type Lifecycle = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type Link = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The Profile for framing the associated Link Contribution. */
  profile: Profile;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** URI of the Link */
  uri: Scalars['String']['output'];
};

export type Location = {
  addressLine1?: Maybe<Scalars['String']['output']>;
  addressLine2?: Maybe<Scalars['String']['output']>;
  /** City of the location. */
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The GeoLocation for this Location, derived from (City, Country) if those are set. */
  geoLocation: GeoLocation;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  postalCode?: Maybe<Scalars['String']['output']>;
  stateOrProvince?: Maybe<Scalars['String']['output']>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type LookupByNameQueryResults = {
  /** Lookup the ID of the specified InnovationHub using a NameID */
  innovationHub?: Maybe<Scalars['String']['output']>;
  /** Lookup the ID of the specified InnovationPack using a NameID */
  innovationPack?: Maybe<Scalars['String']['output']>;
  /** Lookup the ID of the specified Organization using a NameID */
  organization?: Maybe<Scalars['String']['output']>;
  /** Lookup a Space using a NameID */
  space?: Maybe<Space>;
  /** Lookup the ID of the specified Template using a templatesSetId and the template NameID */
  template?: Maybe<Scalars['String']['output']>;
  /** Lookup the ID of the specified User using a NameID */
  user?: Maybe<Scalars['String']['output']>;
  /** Lookup the ID of the specified Virtual Contributor using a NameID */
  virtualContributor?: Maybe<Scalars['String']['output']>;
};

export type LookupByNameQueryResultsInnovationHubArgs = {
  NAMEID: Scalars['NameID']['input'];
};

export type LookupByNameQueryResultsInnovationPackArgs = {
  NAMEID: Scalars['NameID']['input'];
};

export type LookupByNameQueryResultsOrganizationArgs = {
  NAMEID: Scalars['NameID']['input'];
};

export type LookupByNameQueryResultsSpaceArgs = {
  NAMEID: Scalars['NameID']['input'];
};

export type LookupByNameQueryResultsTemplateArgs = {
  NAMEID: Scalars['NameID']['input'];
  templatesSetID: Scalars['UUID']['input'];
};

export type LookupByNameQueryResultsUserArgs = {
  NAMEID: Scalars['NameID']['input'];
};

export type LookupByNameQueryResultsVirtualContributorArgs = {
  NAMEID: Scalars['NameID']['input'];
};

export type LookupMyPrivilegesQueryResults = {
  /** Lookup myPrivileges on the specified Account */
  account?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Application */
  application?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Calendar */
  calendar?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified CalendarEvent */
  calendarEvent?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Callout */
  callout?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Collaboration */
  collaboration?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Community */
  community?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Community guidelines */
  communityGuidelines?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Document */
  document?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified InnovationFlow */
  innovationFlow?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified InnovationHub */
  innovationHub?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified InnovationPack */
  innovationPack?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Invitation */
  invitation?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified License */
  license?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Post */
  post?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Profile */
  profile?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified RoleSet */
  roleSet?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Room */
  room?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Space */
  space?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified SpaceAbout */
  spaceAbout?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified StorageAggregator */
  storageAggregator?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified StorageBucket */
  storageBucket?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Template */
  template?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified TemplatesManager */
  templatesManager?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified TemplatesSet */
  templatesSet?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified User */
  user?: Maybe<Array<AuthorizationPrivilege>>;
  /** A particular VirtualContributor */
  virtualContributor?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup myPrivileges on the specified Whiteboard */
  whiteboard?: Maybe<Array<AuthorizationPrivilege>>;
};

export type LookupMyPrivilegesQueryResultsAccountArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsApplicationArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsCalendarArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsCalendarEventArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsCalloutArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsCollaborationArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsCommunityArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsCommunityGuidelinesArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsDocumentArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsInnovationFlowArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsInnovationHubArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsInnovationPackArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsInvitationArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsLicenseArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsPostArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsProfileArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsRoleSetArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsRoomArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsSpaceArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsSpaceAboutArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsStorageAggregatorArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsStorageBucketArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsTemplateArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsTemplatesManagerArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsTemplatesSetArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsUserArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsVirtualContributorArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupMyPrivilegesQueryResultsWhiteboardArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResults = {
  /** Lookup the specified SpaceAbout */
  about?: Maybe<SpaceAbout>;
  /** Lookup the specified Account */
  account?: Maybe<Account>;
  /** Lookup the specified Application */
  application?: Maybe<Application>;
  /** Lookup the specified Authorization Policy */
  authorizationPolicy?: Maybe<Authorization>;
  /** The privileges granted to the specified user based on this Authorization Policy. */
  authorizationPrivilegesForUser?: Maybe<Array<AuthorizationPrivilege>>;
  /** Lookup the specified Calendar */
  calendar?: Maybe<Calendar>;
  /** Lookup the specified CalendarEvent */
  calendarEvent?: Maybe<CalendarEvent>;
  /** Lookup the specified Callout */
  callout?: Maybe<Callout>;
  /** Lookup the specified CalloutsSet */
  calloutsSet?: Maybe<CalloutsSet>;
  /** Lookup the specified Collaboration */
  collaboration?: Maybe<Collaboration>;
  /** Lookup the specified Community */
  community?: Maybe<Community>;
  /** Lookup the specified Community guidelines */
  communityGuidelines?: Maybe<CommunityGuidelines>;
  /** Lookup the specified Document */
  document?: Maybe<Document>;
  /** Lookup the specified InnovationFlow */
  innovationFlow?: Maybe<InnovationFlow>;
  /** Lookup the specified InnovationHub */
  innovationHub?: Maybe<InnovationHub>;
  /** Lookup the specified InnovationPack */
  innovationPack?: Maybe<InnovationPack>;
  /** Lookup the specified Invitation */
  invitation?: Maybe<Invitation>;
  /** Lookup as specific KnowledgeBase */
  knowledgeBase: KnowledgeBase;
  /** Lookup the specified License */
  license?: Maybe<License>;
  /** Lookup the specified Memo */
  memo?: Maybe<Memo>;
  /** Lookup myPrivileges on the specified entity. */
  myPrivileges?: Maybe<LookupMyPrivilegesQueryResults>;
  /** Lookup the specified Organization using a ID */
  organization?: Maybe<Organization>;
  /** Lookup the specified PlatformInvitation */
  platformInvitation?: Maybe<PlatformInvitation>;
  /** Lookup the specified Post */
  post?: Maybe<Post>;
  /** Lookup the specified Profile */
  profile?: Maybe<Profile>;
  /** Lookup the specified RoleSet */
  roleSet?: Maybe<RoleSet>;
  /** Lookup the specified Room */
  room?: Maybe<Room>;
  /** Lookup the specified Space */
  space?: Maybe<Space>;
  /** Lookup the specified StorageAggregator */
  storageAggregator?: Maybe<StorageAggregator>;
  /** Lookup the specified StorageBucket */
  storageBucket?: Maybe<StorageBucket>;
  /** Lookup the specified Template */
  template?: Maybe<Template>;
  /** Lookup the specified Space Content Template */
  templateContentSpace?: Maybe<TemplateContentSpace>;
  /** Lookup the specified TemplatesManager */
  templatesManager?: Maybe<TemplatesManager>;
  /** Lookup the specified TemplatesSet */
  templatesSet?: Maybe<TemplatesSet>;
  /** A particular User */
  user?: Maybe<User>;
  /** A particular VirtualContributor */
  virtualContributor?: Maybe<VirtualContributor>;
  /** Lookup the specified Whiteboard */
  whiteboard?: Maybe<Whiteboard>;
};

export type LookupQueryResultsAboutArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsAccountArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsApplicationArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsAuthorizationPolicyArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsAuthorizationPrivilegesForUserArgs = {
  authorizationPolicyID: Scalars['UUID']['input'];
  userID: Scalars['UUID']['input'];
};

export type LookupQueryResultsCalendarArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsCalendarEventArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsCalloutArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsCalloutsSetArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsCollaborationArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsCommunityArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsCommunityGuidelinesArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsDocumentArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsInnovationFlowArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsInnovationHubArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsInnovationPackArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsInvitationArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsKnowledgeBaseArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsLicenseArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsMemoArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsOrganizationArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsPlatformInvitationArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsPostArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsProfileArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsRoleSetArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsRoomArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsSpaceArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsStorageAggregatorArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsStorageBucketArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsTemplateArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsTemplateContentSpaceArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsTemplatesManagerArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsTemplatesSetArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsUserArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsVirtualContributorArgs = {
  ID: Scalars['UUID']['input'];
};

export type LookupQueryResultsWhiteboardArgs = {
  ID: Scalars['UUID']['input'];
};

export type MeQueryResults = {
  /** The community applications current authenticated user can act on. */
  communityApplications: Array<CommunityApplicationResult>;
  /** The invitations the current authenticated user can act on. */
  communityInvitations: Array<CommunityInvitationResult>;
  /** The number of invitations the current authenticated user can act on. */
  communityInvitationsCount: Scalars['Float']['output'];
  /** The query id */
  id: Scalars['String']['output'];
  /** The Spaces I am contributing to */
  mySpaces: Array<MySpaceResults>;
  /** The Spaces the current user is a member of as a flat list. */
  spaceMembershipsFlat: Array<CommunityMembershipResult>;
  /** The hierarchy of the Spaces the current user is a member. */
  spaceMembershipsHierarchical: Array<CommunityMembershipResult>;
  /** The current authenticated User;  null if not yet registered on the platform */
  user?: Maybe<User>;
};

export type MeQueryResultsCommunityApplicationsArgs = {
  states?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type MeQueryResultsCommunityInvitationsArgs = {
  states?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type MeQueryResultsCommunityInvitationsCountArgs = {
  states?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type MeQueryResultsMySpacesArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
};

export type MeQueryResultsSpaceMembershipsHierarchicalArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
};

export type Memo = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The binary state V2 of the Yjs document, used to collaborate on the Memo, represented in base64. */
  content?: Maybe<Scalars['String']['output']>;
  /** The policy governing who can update the Memo content. */
  contentUpdatePolicy: ContentUpdatePolicy;
  /** The user that created this Memo */
  createdBy?: Maybe<User>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Whether the Memo is multi-user enabled on Space level. */
  isMultiUser: Scalars['Boolean']['output'];
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The Profile for this Memo. */
  profile: Profile;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

/** A message that was sent either as an Update or as part of a Discussion. */
export type Message = {
  /** The id for the message event. */
  id: Scalars['MessageID']['output'];
  /** The message being sent */
  message: Scalars['Markdown']['output'];
  /** Reactions on this message */
  reactions: Array<Reaction>;
  /** The User or Virtual Contributor that created this Message */
  sender?: Maybe<Contributor>;
  /** The message being replied to */
  threadID?: Maybe<Scalars['String']['output']>;
  /** The server timestamp in UTC */
  timestamp: Scalars['Float']['output'];
};

/** A detailed answer to a question, typically from an AI service. */
export type MessageAnswerQuestion = {
  /** Error message if an error occurred */
  error?: Maybe<Scalars['String']['output']>;
  /** The id of the answer; null if an error was returned */
  id?: Maybe<Scalars['String']['output']>;
  /** The original question */
  question: Scalars['String']['output'];
  /** Message successfully sent. If false, error will have the reason. */
  success: Scalars['Boolean']['output'];
};

export type Metadata = {
  /** Collection of metadata about Alkemio services. */
  services: Array<ServiceMetadata>;
};

export type MigrateEmbeddings = {
  /** Result from the mutation execution. */
  success: Scalars['Boolean']['output'];
};

export enum MimeType {
  Avif = 'AVIF',
  Bmp = 'BMP',
  Doc = 'DOC',
  Docx = 'DOCX',
  Gif = 'GIF',
  Jpeg = 'JPEG',
  Jpg = 'JPG',
  Odp = 'ODP',
  Ods = 'ODS',
  Odt = 'ODT',
  Pdf = 'PDF',
  Png = 'PNG',
  Potm = 'POTM',
  Potx = 'POTX',
  Ppsm = 'PPSM',
  Ppsx = 'PPSX',
  Ppt = 'PPT',
  Pptm = 'PPTM',
  Pptx = 'PPTX',
  Svg = 'SVG',
  Webp = 'WEBP',
  Xls = 'XLS',
  Xlsx = 'XLSX',
  Xpng = 'XPNG',
}

export type ModelCardAiEngineResult = {
  /** Access to detailed information on the underlying models specifications */
  additionalTechnicalDetails: Scalars['String']['output'];
  /** Is the VC prompted to limit the responses to a specific body of knowledge? */
  areAnswersRestrictedToBodyOfKnowledge: Scalars['String']['output'];
  /** Can the VC access or search the web? */
  canAccessWebWhenAnswering: Scalars['Boolean']['output'];
  /** Where is the AI service hosted? */
  hostingLocation: Scalars['String']['output'];
  /** Is the AI Persona using an AI Engine not provided by Alkemio? */
  isExternal: Scalars['Boolean']['output'];
  /** Is interaction data used in any way for model training? Null means Unknown. */
  isInteractionDataUsedForTraining?: Maybe<Scalars['Boolean']['output']>;
  /** Does the VC use an open-weight model? */
  isUsingOpenWeightsModel: Scalars['Boolean']['output'];
};

export type ModelCardMonitoringResult = {
  /** Since Alkemio facilitates the interaction with the external provider, it holds an operational responsibility to monitor the service. As with all data and interactions on the platform, these are governed by our <a href="https://welcome.alkem.io/legal/#tc" target="_blank" ref="noreferer">Terms & Conditions</a>. */
  isUsageMonitoredByAlkemio: Scalars['Boolean']['output'];
};

export type ModelCardSpaceUsageResult = {
  /** The Flags for this Model Card Entry. */
  flags: Array<AiPersonaModelCardFlag>;
  /** The Model Card Entry type. */
  modelCardEntry: AiPersonaModelCardEntry;
};

export type MoveCalloutContributionInput = {
  /** ID of the Callout to move the Contribution to. */
  calloutID: Scalars['UUID']['input'];
  /** ID of the Contribution to move. */
  contributionID: Scalars['UUID']['input'];
};

export type Mutation = {
  /** Adds an Iframe Allowed URL to the Platform Settings */
  addIframeAllowedURL: Array<Scalars['String']['output']>;
  /** Add a reaction to a message from the specified Room. */
  addReactionToMessageInRoom: Reaction;
  /** Ensure all community members are registered for communications. */
  adminCommunicationEnsureAccessToCommunications: Scalars['Boolean']['output'];
  /** Remove an orphaned room from messaging platform. */
  adminCommunicationRemoveOrphanedRoom: Scalars['Boolean']['output'];
  /** Allow updating the state flags of a particular rule. */
  adminCommunicationUpdateRoomState: Scalars['Boolean']['output'];
  /** Ingests new data into Elasticsearch from scratch. This will delete all existing data and ingest new data from the source. This is an admin only operation. */
  adminSearchIngestFromScratch: Scalars['String']['output'];
  /** Update the Avatar on the Profile with the spedified profileID to be stored as a Document. */
  adminUpdateContributorAvatars: Profile;
  /** Updates the GeoLocation data where required on the platform. */
  adminUpdateGeoLocationData: Scalars['Boolean']['output'];
  /** Remove the Kratos account associated with the specified User. Note: the Users profile on the platform is not deleted. */
  adminUserAccountDelete: User;
  /** Create a test customer on wingback. */
  adminWingbackCreateTestCustomer: Scalars['String']['output'];
  /** Get wingback customer entitlements. */
  adminWingbackGetCustomerEntitlements: Array<LicensingGrantedEntitlement>;
  /** Reset the Authorization Policy on the specified AiServer. */
  aiServerAuthorizationPolicyReset: AiServer;
  /** Creates a new AiPersonaService on the aiServer. */
  aiServerCreateAiPersonaService: AiPersonaService;
  /** Deletes the specified AiPersonaService. */
  aiServerDeleteAiPersonaService: AiPersonaService;
  /** Updates the specified AI Persona. */
  aiServerUpdateAiPersonaService: AiPersonaService;
  /** Apply to join the specified RoleSet in the entry Role. */
  applyForEntryRoleOnRoleSet: Application;
  /** Ask the chat engine for guidance. */
  askChatGuidanceQuestion: MessageAnswerQuestion;
  /** Assign the specified LicensePlan to an Account. */
  assignLicensePlanToAccount: Account;
  /** Assign the specified LicensePlan to a Space. */
  assignLicensePlanToSpace: Space;
  /** Assigns a User to a role on the Platform. */
  assignPlatformRoleToUser: User;
  /** Assigns an Organization a Role in the specified Community. */
  assignRoleToOrganization: Organization;
  /** Assigns a User to a role in the specified Community. */
  assignRoleToUser: User;
  /** Assigns a Virtual Contributor to a role in the specified Community. */
  assignRoleToVirtualContributor: VirtualContributor;
  /** Assigns a User as a member of the specified User Group. */
  assignUserToGroup: UserGroup;
  /** Reset the Authorization Policy on all entities */
  authorizationPolicyResetAll: Scalars['String']['output'];
  /** Reset the Authorization Policy on the specified Account. */
  authorizationPolicyResetOnAccount: Account;
  /** Reset the Authorization Policy on the specified Organization. */
  authorizationPolicyResetOnOrganization: Organization;
  /** Reset the Authorization Policy on the specified Platform. */
  authorizationPolicyResetOnPlatform: Platform;
  /** Reset the Authorization policy on the specified User. */
  authorizationPolicyResetOnUser: User;
  /** Reset the specified Authorization Policy to global admin privileges */
  authorizationPolicyResetToGlobalAdminsAccess: Authorization;
  /** Generate Alkemio user credential offer */
  beginAlkemioUserVerifiedCredentialOfferInteraction: AgentBeginVerifiedCredentialOfferOutput;
  /** Generate community member credential offer */
  beginCommunityMemberVerifiedCredentialOfferInteraction: AgentBeginVerifiedCredentialOfferOutput;
  /** Generate verified credential share request */
  beginVerifiedCredentialRequestInteraction: AgentBeginVerifiedCredentialRequestOutput;
  /** Deletes collections nameID-... */
  cleanupCollections: MigrateEmbeddings;
  /** Move an L1 Space up in the hierarchy, to be a L0 Space. */
  convertSpaceL1ToSpaceL0: Space;
  /** Move an L1 Space down in the hierarchy within the same L0 Space, to be a L2 Space.       Restrictions: the Space L1 must remain within the same L0 Space.       Roles: all user, organization and virtual contributor role assignments are removed, with       the exception of Admin role assignments for Users. */
  convertSpaceL1ToSpaceL2: Space;
  /** Move an L2 Space up in the hierarchy, to be a L1 Space. */
  convertSpaceL2ToSpaceL1: Space;
  /** Convert a VC of type ALKEMIO_SPACE to be of type KNOWLEDGE_BASE. All Callouts from the Space currently being used are moved to the Knowledge Base. Note: only allowed for VCs using a Space within the same Account. */
  convertVirtualContributorToUseKnowledgeBase: VirtualContributor;
  /** Create a new Callout on the CalloutsSet. */
  createCalloutOnCalloutsSet: Callout;
  /** Create a guidance chat room. */
  createChatGuidanceRoom?: Maybe<Room>;
  /** Create a new Contribution on the Callout. */
  createContributionOnCallout: CalloutContribution;
  /** Creates a new Discussion as part of this Forum. */
  createDiscussion: Discussion;
  /** Create a new CalendarEvent on the Calendar. */
  createEventOnCalendar: CalendarEvent;
  /** Creates a new User Group in the specified Community. */
  createGroupOnCommunity: UserGroup;
  /** Creates a new User Group for the specified Organization. */
  createGroupOnOrganization: UserGroup;
  /** Create an Innovation Hub on the specified account */
  createInnovationHub: InnovationHub;
  /** Creates a new InnovationPack on an Account. */
  createInnovationPack: InnovationPack;
  /** Create a new LicensePlan on the Licensing. */
  createLicensePlan: LicensePlan;
  /** Creates a new Organization on the platform. */
  createOrganization: Organization;
  /** Creates a new Reference on the specified Profile. */
  createReferenceOnProfile: Reference;
  /** Creates a new Level Zero Space within the specified Account. */
  createSpace: Space;
  /** Create a new State on the InnovationFlow. */
  createStateOnInnovationFlow: InnovationFlowState;
  /** Creates a new Subspace within the specified Space. */
  createSubspace: Space;
  /** Creates a new Tagset on the specified Profile */
  createTagsetOnProfile: Tagset;
  /** Creates a new Template on the specified TemplatesSet. */
  createTemplate: Template;
  /** Creates a new Template on the specified TemplatesSet using the provided ContentSpace as content. */
  createTemplateFromContentSpace: Template;
  /** Creates a new Template on the specified TemplatesSet using the provided Space as content. */
  createTemplateFromSpace: Template;
  /** Creates a new User on the platform. */
  createUser: User;
  /** Creates a new User profile on the platform for a user that has a valid Authentication session. */
  createUserNewRegistration: User;
  /** Creates a new VirtualContributor on an Account. */
  createVirtualContributor: VirtualContributor;
  /** Creates an account in Wingback */
  createWingbackAccount: Scalars['String']['output'];
  /** Deletes the specified CalendarEvent. */
  deleteCalendarEvent: CalendarEvent;
  /** Delete a Callout. */
  deleteCallout: Callout;
  /** Deletes a contribution. */
  deleteContribution: CalloutContribution;
  /** Deletes the specified Discussion. */
  deleteDiscussion: Discussion;
  /** Deletes the specified Document. */
  deleteDocument: Document;
  /** Delete Innovation Hub. */
  deleteInnovationHub: InnovationHub;
  /** Deletes the specified InnovationPack. */
  deleteInnovationPack: InnovationPack;
  /** Removes the specified User invitation. */
  deleteInvitation: Invitation;
  /** Deletes the specified LicensePlan. */
  deleteLicensePlan: LicensePlan;
  /** Deletes the specified Link. */
  deleteLink: Link;
  /** Deletes the specified Memo. */
  deleteMemo: Memo;
  /** Deletes the specified Organization. */
  deleteOrganization: Organization;
  /** Removes the specified User platformInvitation. */
  deletePlatformInvitation: PlatformInvitation;
  /** Deletes the specified Post. */
  deletePost: Post;
  /** Deletes the specified Reference. */
  deleteReference: Reference;
  /** Deletes the specified Space. */
  deleteSpace: Space;
  /** Delete a  State on the InnovationFlow. */
  deleteStateOnInnovationFlow: InnovationFlowState;
  /** Deletes a Storage Bucket */
  deleteStorageBucket: StorageBucket;
  /** Deletes the specified Template. */
  deleteTemplate: Template;
  /** Deletes the specified User. */
  deleteUser: User;
  /** Removes the specified User Application. */
  deleteUserApplication: Application;
  /** Deletes the specified User Group. */
  deleteUserGroup: UserGroup;
  /** Deletes the specified VirtualContributor. */
  deleteVirtualContributor: VirtualContributor;
  /** Deletes the specified Whiteboard. */
  deleteWhiteboard: Whiteboard;
  /** Trigger an event on the Application. */
  eventOnApplication: Application;
  /** Trigger an event on the Invitation. */
  eventOnInvitation: Invitation;
  /** Trigger an event on the Organization Verification. */
  eventOnOrganizationVerification: OrganizationVerification;
  /** Grants an authorization credential to an Organization. */
  grantCredentialToOrganization: Organization;
  /** Grants an authorization credential to a User. */
  grantCredentialToUser: User;
  /** Invite new Contributors or users by email to join the specified RoleSet in the Entry Role. */
  inviteForEntryRoleOnRoleSet: Array<RoleSetInvitationResult>;
  /** Join the specified RoleSet using the entry Role, without going through an approval process. */
  joinRoleSet: RoleSet;
  /** Reset the License with Entitlements on the specified Account. */
  licenseResetOnAccount: Account;
  /** Mark multiple notifications as read. */
  markNotificationsAsRead: Scalars['Boolean']['output'];
  /** Mark multiple notifications as unread. */
  markNotificationsAsUnread: Scalars['Boolean']['output'];
  /** Sends a message on the specified User`s behalf and returns the room id */
  messageUser: Scalars['String']['output'];
  /** Moves the specified Contribution to another Callout. */
  moveContributionToCallout: CalloutContribution;
  /** Refresh the Bodies of Knowledge on All VCs */
  refreshAllBodiesOfKnowledge: Scalars['Boolean']['output'];
  /** Triggers a request to the backing AI Service to refresh the knowledge that is available to it. */
  refreshVirtualContributorBodyOfKnowledge: Scalars['Boolean']['output'];
  /** Empties the CommunityGuidelines. */
  removeCommunityGuidelinesContent: CommunityGuidelines;
  /** Removes an Iframe Allowed URL from the Platform Settings */
  removeIframeAllowedURL: Array<Scalars['String']['output']>;
  /** Removes a message. */
  removeMessageOnRoom: Scalars['MessageID']['output'];
  /** Removes a User from a Role on the Platform. */
  removePlatformRoleFromUser: User;
  /** Remove a reaction on a message from the specified Room. */
  removeReactionToMessageInRoom: Scalars['Boolean']['output'];
  /** Removes an Organization from a Role in the specified Community. */
  removeRoleFromOrganization: Organization;
  /** Removes a User from a Role in the specified Community. */
  removeRoleFromUser: User;
  /** Removes a Virtual from a Role in the specified Community. */
  removeRoleFromVirtualContributor: VirtualContributor;
  /** Removes the specified User from specified user group */
  removeUserFromGroup: UserGroup;
  /** Resets the interaction with the chat engine. */
  resetChatGuidance: Scalars['Boolean']['output'];
  /** Reset all license plans on Accounts */
  resetLicenseOnAccounts: Space;
  /** Removes an authorization credential from an Organization. */
  revokeCredentialFromOrganization: Organization;
  /** Removes an authorization credential from a User. */
  revokeCredentialFromUser: User;
  /** Revokes the specified LicensePlan on an Account. */
  revokeLicensePlanFromAccount: Account;
  /** Revokes the specified LicensePlan on a Space. */
  revokeLicensePlanFromSpace: Space;
  /** Sends a reply to a message from the specified Room. */
  sendMessageReplyToRoom: Message;
  /** Send message to Community Leads. */
  sendMessageToCommunityLeads: Scalars['Boolean']['output'];
  /** Send message to an Organization. */
  sendMessageToOrganization: Scalars['Boolean']['output'];
  /** Sends an comment message. Returns the id of the new Update message. */
  sendMessageToRoom: Message;
  /** Send message to a User. */
  sendMessageToUser: Scalars['Boolean']['output'];
  /** Transfer the specified Callout from its current CalloutsSet to the target CalloutsSet. Note: this is experimental, and only for GlobalAdmins. The user that executes the transfer becomes the creator of the Callout. */
  transferCallout: Callout;
  /** Transfer the specified InnovationHub to another Account. */
  transferInnovationHubToAccount: InnovationHub;
  /** Transfer the specified Innovation Pack to another Account. */
  transferInnovationPackToAccount: InnovationPack;
  /** Transfer the specified Space to another Account. */
  transferSpaceToAccount: Space;
  /** Transfer the specified Virtual Contributor to another Account. */
  transferVirtualContributorToAccount: InnovationPack;
  /** Updates the specified AiPersona. */
  updateAiPersona: AiPersona;
  /** User vote if a specific answer is relevant. */
  updateAnswerRelevance: Scalars['Boolean']['output'];
  /** Update the Application Form used by this RoleSet. */
  updateApplicationFormOnRoleSet: RoleSet;
  /** Updates the specified CalendarEvent. */
  updateCalendarEvent: CalendarEvent;
  /** Update a Callout. */
  updateCallout: Callout;
  /** Update the information describing the publishing of the specified Callout. */
  updateCalloutPublishInfo: Callout;
  /** Update the visibility of the specified Callout. */
  updateCalloutVisibility: Callout;
  /** Update the sortOrder field of the supplied Callouts to increase as per the order that they are provided in. */
  updateCalloutsSortOrder: Array<Callout>;
  /** Updates a Tagset on a Classification. */
  updateClassificationTagset: Tagset;
  /** Updates a Collaboration, including InnovationFlow states, using the Space content from the specified Template. */
  updateCollaborationFromSpaceTemplate: Collaboration;
  /** Updates the CommunityGuidelines. */
  updateCommunityGuidelines: CommunityGuidelines;
  /** Update the sortOrder field of the Contributions of s Callout. */
  updateContributionsSortOrder: Array<CalloutContribution>;
  /** Updates the specified Discussion. */
  updateDiscussion: Discussion;
  /** Updates the specified Document. */
  updateDocument: Document;
  /** Updates the InnovationFlow. */
  updateInnovationFlow: InnovationFlow;
  /** Updates the InnovationFlow. */
  updateInnovationFlowCurrentState: InnovationFlow;
  /** Updates the specified InnovationFlowState. */
  updateInnovationFlowState: InnovationFlowState;
  /** Update the sortOrder field of the supplied InnovationFlowStates to increase as per the order that they are provided in. */
  updateInnovationFlowStatesSortOrder: Array<InnovationFlowState>;
  /** Update Innovation Hub. */
  updateInnovationHub: InnovationHub;
  /** Updates the InnovationPack. */
  updateInnovationPack: InnovationPack;
  /** Updates the LicensePlan. */
  updateLicensePlan: LicensePlan;
  /** Updates the specified Link. */
  updateLink: Link;
  /** Updates the specified Memo. */
  updateMemo: Memo;
  /** Update notification state and return the notification. */
  updateNotificationState: InAppNotificationState;
  /** Updates the specified Organization. */
  updateOrganization: Organization;
  /** Updates the specified Organization platform settings. */
  updateOrganizationPlatformSettings: Organization;
  /** Updates one of the Setting on an Organization */
  updateOrganizationSettings: Organization;
  /** Updates one of the Setting on the Platform */
  updatePlatformSettings: PlatformSettings;
  /** Updates the specified Post. */
  updatePost: Post;
  /** Updates the specified Profile. */
  updateProfile: Profile;
  /** Updates the specified Reference. */
  updateReference: Reference;
  /** Updates the Space. */
  updateSpace: Space;
  /** Update the platform settings, such as nameID, of the specified Space. */
  updateSpacePlatformSettings: Space;
  /** Updates one of the Setting on a Space */
  updateSpaceSettings: Space;
  /** Updates the specified Tagset. */
  updateTagset: Tagset;
  /** Updates the specified Template. */
  updateTemplate: Template;
  /** Updates the TemplateContentSpace. */
  updateTemplateContentSpace: TemplateContentSpace;
  /** Updates the specified Template Defaults. */
  updateTemplateDefault: TemplateDefault;
  /** Updates the specified Space Content Template using the provided Space. */
  updateTemplateFromSpace: Template;
  /** Updates the User. */
  updateUser: User;
  /** Updates the specified User Group. */
  updateUserGroup: UserGroup;
  /** Update the platform settings, such as nameID, email, for the specified User. */
  updateUserPlatformSettings: User;
  /** Updates one of the Setting on a User */
  updateUserSettings: User;
  /** Updates the specified VirtualContributor. */
  updateVirtualContributor: VirtualContributor;
  /** Updates one of the Setting on an Organization */
  updateVirtualContributorSettings: VirtualContributor;
  /** Updates the image URI for the specified Visual. */
  updateVisual: Visual;
  /** Updates the specified Whiteboard. */
  updateWhiteboard: Whiteboard;
  /** Create a new Document on the Storage and return the value as part of the returned Link. */
  uploadFileOnLink: Link;
  /** Create a new Document on the Storage and return the value as part of the returned Reference. */
  uploadFileOnReference: Reference;
  /** Create a new Document on the Storage and return the public Url. */
  uploadFileOnStorageBucket: Scalars['String']['output'];
  /** Uploads and sets an image for the specified Visual. */
  uploadImageOnVisual: Visual;
};

export type MutationAddIframeAllowedUrlArgs = {
  whitelistedURL: Scalars['String']['input'];
};

export type MutationAddReactionToMessageInRoomArgs = {
  reactionData: RoomAddReactionToMessageInput;
};

export type MutationAdminCommunicationEnsureAccessToCommunicationsArgs = {
  communicationData: CommunicationAdminEnsureAccessInput;
};

export type MutationAdminCommunicationRemoveOrphanedRoomArgs = {
  orphanedRoomData: CommunicationAdminRemoveOrphanedRoomInput;
};

export type MutationAdminCommunicationUpdateRoomStateArgs = {
  roomStateData: CommunicationAdminUpdateRoomStateInput;
};

export type MutationAdminUpdateContributorAvatarsArgs = {
  profileID: Scalars['UUID']['input'];
};

export type MutationAdminUserAccountDeleteArgs = {
  userID: Scalars['UUID']['input'];
};

export type MutationAdminWingbackGetCustomerEntitlementsArgs = {
  customerID: Scalars['String']['input'];
};

export type MutationAiServerCreateAiPersonaServiceArgs = {
  aiPersonaServiceData: CreateAiPersonaServiceInput;
};

export type MutationAiServerDeleteAiPersonaServiceArgs = {
  deleteData: DeleteAiPersonaServiceInput;
};

export type MutationAiServerUpdateAiPersonaServiceArgs = {
  aiPersonaServiceData: UpdateAiPersonaServiceInput;
};

export type MutationApplyForEntryRoleOnRoleSetArgs = {
  applicationData: ApplyForEntryRoleOnRoleSetInput;
};

export type MutationAskChatGuidanceQuestionArgs = {
  chatData: ChatGuidanceInput;
};

export type MutationAssignLicensePlanToAccountArgs = {
  planData: AssignLicensePlanToAccount;
};

export type MutationAssignLicensePlanToSpaceArgs = {
  planData: AssignLicensePlanToSpace;
};

export type MutationAssignPlatformRoleToUserArgs = {
  roleData: AssignPlatformRoleInput;
};

export type MutationAssignRoleToOrganizationArgs = {
  roleData: AssignRoleOnRoleSetToOrganizationInput;
};

export type MutationAssignRoleToUserArgs = {
  roleData: AssignRoleOnRoleSetToUserInput;
};

export type MutationAssignRoleToVirtualContributorArgs = {
  roleData: AssignRoleOnRoleSetToVirtualContributorInput;
};

export type MutationAssignUserToGroupArgs = {
  membershipData: AssignUserGroupMemberInput;
};

export type MutationAuthorizationPolicyResetOnAccountArgs = {
  authorizationResetData: AccountAuthorizationResetInput;
};

export type MutationAuthorizationPolicyResetOnOrganizationArgs = {
  authorizationResetData: OrganizationAuthorizationResetInput;
};

export type MutationAuthorizationPolicyResetOnUserArgs = {
  authorizationResetData: UserAuthorizationResetInput;
};

export type MutationAuthorizationPolicyResetToGlobalAdminsAccessArgs = {
  authorizationID: Scalars['String']['input'];
};

export type MutationBeginCommunityMemberVerifiedCredentialOfferInteractionArgs =
  {
    communityID: Scalars['String']['input'];
  };

export type MutationBeginVerifiedCredentialRequestInteractionArgs = {
  types: Array<Scalars['String']['input']>;
};

export type MutationConvertSpaceL1ToSpaceL0Args = {
  convertData: ConvertSpaceL1ToSpaceL0Input;
};

export type MutationConvertSpaceL1ToSpaceL2Args = {
  convertData: ConvertSpaceL1ToSpaceL2Input;
};

export type MutationConvertSpaceL2ToSpaceL1Args = {
  convertData: ConvertSpaceL2ToSpaceL1Input;
};

export type MutationConvertVirtualContributorToUseKnowledgeBaseArgs = {
  conversionData: ConversionVcSpaceToVcKnowledgeBaseInput;
};

export type MutationCreateCalloutOnCalloutsSetArgs = {
  calloutData: CreateCalloutOnCalloutsSetInput;
};

export type MutationCreateContributionOnCalloutArgs = {
  contributionData: CreateContributionOnCalloutInput;
};

export type MutationCreateDiscussionArgs = {
  createData: ForumCreateDiscussionInput;
};

export type MutationCreateEventOnCalendarArgs = {
  eventData: CreateCalendarEventOnCalendarInput;
};

export type MutationCreateGroupOnCommunityArgs = {
  groupData: CreateUserGroupInput;
};

export type MutationCreateGroupOnOrganizationArgs = {
  groupData: CreateUserGroupInput;
};

export type MutationCreateInnovationHubArgs = {
  createData: CreateInnovationHubOnAccountInput;
};

export type MutationCreateInnovationPackArgs = {
  innovationPackData: CreateInnovationPackOnAccountInput;
};

export type MutationCreateLicensePlanArgs = {
  planData: CreateLicensePlanOnLicensingFrameworkInput;
};

export type MutationCreateOrganizationArgs = {
  organizationData: CreateOrganizationInput;
};

export type MutationCreateReferenceOnProfileArgs = {
  referenceInput: CreateReferenceOnProfileInput;
};

export type MutationCreateSpaceArgs = {
  spaceData: CreateSpaceOnAccountInput;
};

export type MutationCreateStateOnInnovationFlowArgs = {
  stateData: CreateStateOnInnovationFlowInput;
};

export type MutationCreateSubspaceArgs = {
  subspaceData: CreateSubspaceInput;
};

export type MutationCreateTagsetOnProfileArgs = {
  tagsetData: CreateTagsetOnProfileInput;
};

export type MutationCreateTemplateArgs = {
  templateData: CreateTemplateOnTemplatesSetInput;
};

export type MutationCreateTemplateFromContentSpaceArgs = {
  templateData: CreateTemplateFromContentSpaceOnTemplatesSetInput;
};

export type MutationCreateTemplateFromSpaceArgs = {
  templateData: CreateTemplateFromSpaceOnTemplatesSetInput;
};

export type MutationCreateUserArgs = {
  userData: CreateUserInput;
};

export type MutationCreateVirtualContributorArgs = {
  virtualContributorData: CreateVirtualContributorOnAccountInput;
};

export type MutationCreateWingbackAccountArgs = {
  accountID: Scalars['UUID']['input'];
};

export type MutationDeleteCalendarEventArgs = {
  deleteData: DeleteCalendarEventInput;
};

export type MutationDeleteCalloutArgs = {
  deleteData: DeleteCalloutInput;
};

export type MutationDeleteContributionArgs = {
  contributionID: Scalars['String']['input'];
};

export type MutationDeleteDiscussionArgs = {
  deleteData: DeleteDiscussionInput;
};

export type MutationDeleteDocumentArgs = {
  deleteData: DeleteDocumentInput;
};

export type MutationDeleteInnovationHubArgs = {
  deleteData: DeleteInnovationHubInput;
};

export type MutationDeleteInnovationPackArgs = {
  deleteData: DeleteInnovationPackInput;
};

export type MutationDeleteInvitationArgs = {
  deleteData: DeleteInvitationInput;
};

export type MutationDeleteLicensePlanArgs = {
  deleteData: DeleteLicensePlanInput;
};

export type MutationDeleteLinkArgs = {
  deleteData: DeleteLinkInput;
};

export type MutationDeleteMemoArgs = {
  memoData: DeleteMemoInput;
};

export type MutationDeleteOrganizationArgs = {
  deleteData: DeleteOrganizationInput;
};

export type MutationDeletePlatformInvitationArgs = {
  deleteData: DeletePlatformInvitationInput;
};

export type MutationDeletePostArgs = {
  deleteData: DeletePostInput;
};

export type MutationDeleteReferenceArgs = {
  deleteData: DeleteReferenceInput;
};

export type MutationDeleteSpaceArgs = {
  deleteData: DeleteSpaceInput;
};

export type MutationDeleteStateOnInnovationFlowArgs = {
  stateData: DeleteStateOnInnovationFlowInput;
};

export type MutationDeleteStorageBucketArgs = {
  deleteData: DeleteStorageBuckeetInput;
};

export type MutationDeleteTemplateArgs = {
  deleteData: DeleteTemplateInput;
};

export type MutationDeleteUserArgs = {
  deleteData: DeleteUserInput;
};

export type MutationDeleteUserApplicationArgs = {
  deleteData: DeleteApplicationInput;
};

export type MutationDeleteUserGroupArgs = {
  deleteData: DeleteUserGroupInput;
};

export type MutationDeleteVirtualContributorArgs = {
  deleteData: DeleteVirtualContributorInput;
};

export type MutationDeleteWhiteboardArgs = {
  whiteboardData: DeleteWhiteboardInput;
};

export type MutationEventOnApplicationArgs = {
  eventData: ApplicationEventInput;
};

export type MutationEventOnInvitationArgs = {
  eventData: InvitationEventInput;
};

export type MutationEventOnOrganizationVerificationArgs = {
  eventData: OrganizationVerificationEventInput;
};

export type MutationGrantCredentialToOrganizationArgs = {
  grantCredentialData: GrantOrganizationAuthorizationCredentialInput;
};

export type MutationGrantCredentialToUserArgs = {
  grantCredentialData: GrantAuthorizationCredentialInput;
};

export type MutationInviteForEntryRoleOnRoleSetArgs = {
  invitationData: InviteForEntryRoleOnRoleSetInput;
};

export type MutationJoinRoleSetArgs = {
  joinData: JoinAsEntryRoleOnRoleSetInput;
};

export type MutationLicenseResetOnAccountArgs = {
  resetData: AccountLicenseResetInput;
};

export type MutationMarkNotificationsAsReadArgs = {
  notificationIds: Array<Scalars['String']['input']>;
};

export type MutationMarkNotificationsAsUnreadArgs = {
  notificationIds: Array<Scalars['String']['input']>;
};

export type MutationMessageUserArgs = {
  messageData: UserSendMessageInput;
};

export type MutationMoveContributionToCalloutArgs = {
  moveContributionData: MoveCalloutContributionInput;
};

export type MutationRefreshVirtualContributorBodyOfKnowledgeArgs = {
  refreshData: RefreshVirtualContributorBodyOfKnowledgeInput;
};

export type MutationRemoveCommunityGuidelinesContentArgs = {
  communityGuidelinesData: RemoveCommunityGuidelinesContentInput;
};

export type MutationRemoveIframeAllowedUrlArgs = {
  whitelistedURL: Scalars['String']['input'];
};

export type MutationRemoveMessageOnRoomArgs = {
  messageData: RoomRemoveMessageInput;
};

export type MutationRemovePlatformRoleFromUserArgs = {
  roleData: RemovePlatformRoleInput;
};

export type MutationRemoveReactionToMessageInRoomArgs = {
  reactionData: RoomRemoveReactionToMessageInput;
};

export type MutationRemoveRoleFromOrganizationArgs = {
  roleData: RemoveRoleOnRoleSetFromOrganizationInput;
};

export type MutationRemoveRoleFromUserArgs = {
  roleData: RemoveRoleOnRoleSetFromUserInput;
};

export type MutationRemoveRoleFromVirtualContributorArgs = {
  roleData: RemoveRoleOnRoleSetFromVirtualContributorInput;
};

export type MutationRemoveUserFromGroupArgs = {
  membershipData: RemoveUserGroupMemberInput;
};

export type MutationRevokeCredentialFromOrganizationArgs = {
  revokeCredentialData: RevokeOrganizationAuthorizationCredentialInput;
};

export type MutationRevokeCredentialFromUserArgs = {
  revokeCredentialData: RevokeAuthorizationCredentialInput;
};

export type MutationRevokeLicensePlanFromAccountArgs = {
  planData: RevokeLicensePlanFromAccount;
};

export type MutationRevokeLicensePlanFromSpaceArgs = {
  planData: RevokeLicensePlanFromSpace;
};

export type MutationSendMessageReplyToRoomArgs = {
  messageData: RoomSendMessageReplyInput;
};

export type MutationSendMessageToCommunityLeadsArgs = {
  messageData: CommunicationSendMessageToCommunityLeadsInput;
};

export type MutationSendMessageToOrganizationArgs = {
  messageData: CommunicationSendMessageToOrganizationInput;
};

export type MutationSendMessageToRoomArgs = {
  messageData: RoomSendMessageInput;
};

export type MutationSendMessageToUserArgs = {
  messageData: CommunicationSendMessageToUserInput;
};

export type MutationTransferCalloutArgs = {
  transferData: TransferCalloutInput;
};

export type MutationTransferInnovationHubToAccountArgs = {
  transferData: TransferAccountInnovationHubInput;
};

export type MutationTransferInnovationPackToAccountArgs = {
  transferData: TransferAccountInnovationPackInput;
};

export type MutationTransferSpaceToAccountArgs = {
  transferData: TransferAccountSpaceInput;
};

export type MutationTransferVirtualContributorToAccountArgs = {
  transferData: TransferAccountVirtualContributorInput;
};

export type MutationUpdateAiPersonaArgs = {
  aiPersonaData: UpdateAiPersonaInput;
};

export type MutationUpdateAnswerRelevanceArgs = {
  input: ChatGuidanceAnswerRelevanceInput;
};

export type MutationUpdateApplicationFormOnRoleSetArgs = {
  applicationFormData: UpdateApplicationFormOnRoleSetInput;
};

export type MutationUpdateCalendarEventArgs = {
  eventData: UpdateCalendarEventInput;
};

export type MutationUpdateCalloutArgs = {
  calloutData: UpdateCalloutEntityInput;
};

export type MutationUpdateCalloutPublishInfoArgs = {
  calloutData: UpdateCalloutPublishInfoInput;
};

export type MutationUpdateCalloutVisibilityArgs = {
  calloutData: UpdateCalloutVisibilityInput;
};

export type MutationUpdateCalloutsSortOrderArgs = {
  sortOrderData: UpdateCalloutsSortOrderInput;
};

export type MutationUpdateClassificationTagsetArgs = {
  updateData: UpdateClassificationSelectTagsetValueInput;
};

export type MutationUpdateCollaborationFromSpaceTemplateArgs = {
  updateData: UpdateCollaborationFromSpaceTemplateInput;
};

export type MutationUpdateCommunityGuidelinesArgs = {
  communityGuidelinesData: UpdateCommunityGuidelinesEntityInput;
};

export type MutationUpdateContributionsSortOrderArgs = {
  sortOrderData: UpdateContributionCalloutsSortOrderInput;
};

export type MutationUpdateDiscussionArgs = {
  updateData: UpdateDiscussionInput;
};

export type MutationUpdateDocumentArgs = {
  documentData: UpdateDocumentInput;
};

export type MutationUpdateInnovationFlowArgs = {
  innovationFlowData: UpdateInnovationFlowInput;
};

export type MutationUpdateInnovationFlowCurrentStateArgs = {
  innovationFlowStateData: UpdateInnovationFlowCurrentStateInput;
};

export type MutationUpdateInnovationFlowStateArgs = {
  stateData: UpdateInnovationFlowStateInput;
};

export type MutationUpdateInnovationFlowStatesSortOrderArgs = {
  sortOrderData: UpdateInnovationFlowStatesSortOrderInput;
};

export type MutationUpdateInnovationHubArgs = {
  updateData: UpdateInnovationHubInput;
};

export type MutationUpdateInnovationPackArgs = {
  innovationPackData: UpdateInnovationPackInput;
};

export type MutationUpdateLicensePlanArgs = {
  updateData: UpdateLicensePlanInput;
};

export type MutationUpdateLinkArgs = {
  linkData: UpdateLinkInput;
};

export type MutationUpdateMemoArgs = {
  memoData: UpdateMemoEntityInput;
};

export type MutationUpdateNotificationStateArgs = {
  notificationData: UpdateNotificationStateInput;
};

export type MutationUpdateOrganizationArgs = {
  organizationData: UpdateOrganizationInput;
};

export type MutationUpdateOrganizationPlatformSettingsArgs = {
  organizationData: UpdateOrganizationPlatformSettingsInput;
};

export type MutationUpdateOrganizationSettingsArgs = {
  settingsData: UpdateOrganizationSettingsInput;
};

export type MutationUpdatePlatformSettingsArgs = {
  settingsData: UpdatePlatformSettingsInput;
};

export type MutationUpdatePostArgs = {
  postData: UpdatePostInput;
};

export type MutationUpdateProfileArgs = {
  profileData: UpdateProfileDirectInput;
};

export type MutationUpdateReferenceArgs = {
  referenceData: UpdateReferenceInput;
};

export type MutationUpdateSpaceArgs = {
  spaceData: UpdateSpaceInput;
};

export type MutationUpdateSpacePlatformSettingsArgs = {
  updateData: UpdateSpacePlatformSettingsInput;
};

export type MutationUpdateSpaceSettingsArgs = {
  settingsData: UpdateSpaceSettingsInput;
};

export type MutationUpdateTagsetArgs = {
  updateData: UpdateTagsetInput;
};

export type MutationUpdateTemplateArgs = {
  updateData: UpdateTemplateInput;
};

export type MutationUpdateTemplateContentSpaceArgs = {
  templateContentSpaceData: UpdateTemplateContentSpaceInput;
};

export type MutationUpdateTemplateDefaultArgs = {
  templateDefaultData: UpdateTemplateDefaultTemplateInput;
};

export type MutationUpdateTemplateFromSpaceArgs = {
  updateData: UpdateTemplateFromSpaceInput;
};

export type MutationUpdateUserArgs = {
  userData: UpdateUserInput;
};

export type MutationUpdateUserGroupArgs = {
  userGroupData: UpdateUserGroupInput;
};

export type MutationUpdateUserPlatformSettingsArgs = {
  updateData: UpdateUserPlatformSettingsInput;
};

export type MutationUpdateUserSettingsArgs = {
  settingsData: UpdateUserSettingsInput;
};

export type MutationUpdateVirtualContributorArgs = {
  virtualContributorData: UpdateVirtualContributorInput;
};

export type MutationUpdateVirtualContributorSettingsArgs = {
  settingsData: UpdateVirtualContributorSettingsInput;
};

export type MutationUpdateVisualArgs = {
  updateData: UpdateVisualInput;
};

export type MutationUpdateWhiteboardArgs = {
  whiteboardData: UpdateWhiteboardEntityInput;
};

export type MutationUploadFileOnLinkArgs = {
  file: Scalars['Upload']['input'];
  uploadData: StorageBucketUploadFileOnLinkInput;
};

export type MutationUploadFileOnReferenceArgs = {
  file: Scalars['Upload']['input'];
  uploadData: StorageBucketUploadFileOnReferenceInput;
};

export type MutationUploadFileOnStorageBucketArgs = {
  file: Scalars['Upload']['input'];
  uploadData: StorageBucketUploadFileInput;
};

export type MutationUploadImageOnVisualArgs = {
  file: Scalars['Upload']['input'];
  uploadData: VisualUploadImageInput;
};

export enum MutationType {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE',
}

export type MySpaceResults = {
  latestActivity?: Maybe<ActivityLogEntry>;
  space: Space;
};

export type Nvp = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

export enum NotificationEvent {
  OrganizationMentioned = 'ORGANIZATION_MENTIONED',
  OrganizationMessageRecipient = 'ORGANIZATION_MESSAGE_RECIPIENT',
  OrganizationMessageSender = 'ORGANIZATION_MESSAGE_SENDER',
  PlatformForumDiscussionComment = 'PLATFORM_FORUM_DISCUSSION_COMMENT',
  PlatformForumDiscussionCreated = 'PLATFORM_FORUM_DISCUSSION_CREATED',
  PlatformGlobalRoleChange = 'PLATFORM_GLOBAL_ROLE_CHANGE',
  PlatformSpaceCreated = 'PLATFORM_SPACE_CREATED',
  PlatformUserProfileCreated = 'PLATFORM_USER_PROFILE_CREATED',
  PlatformUserProfileCreatedAdmin = 'PLATFORM_USER_PROFILE_CREATED_ADMIN',
  PlatformUserProfileRemoved = 'PLATFORM_USER_PROFILE_REMOVED',
  SpaceCalloutPublished = 'SPACE_CALLOUT_PUBLISHED',
  SpaceCommunicationUpdate = 'SPACE_COMMUNICATION_UPDATE',
  SpaceCommunicationUpdateAdmin = 'SPACE_COMMUNICATION_UPDATE_ADMIN',
  SpaceCommunityApplicationApplicant = 'SPACE_COMMUNITY_APPLICATION_APPLICANT',
  SpaceCommunityApplicationRecipient = 'SPACE_COMMUNITY_APPLICATION_RECIPIENT',
  SpaceCommunityInvitationUser = 'SPACE_COMMUNITY_INVITATION_USER',
  SpaceCommunityInvitationUserPlatform = 'SPACE_COMMUNITY_INVITATION_USER_PLATFORM',
  SpaceCommunityInvitationVc = 'SPACE_COMMUNITY_INVITATION_VC',
  SpaceCommunityNewMember = 'SPACE_COMMUNITY_NEW_MEMBER',
  SpaceCommunityNewMemberAdmin = 'SPACE_COMMUNITY_NEW_MEMBER_ADMIN',
  SpaceContactMessageRecipient = 'SPACE_CONTACT_MESSAGE_RECIPIENT',
  SpaceContactMessageSender = 'SPACE_CONTACT_MESSAGE_SENDER',
  SpacePostCommentCreated = 'SPACE_POST_COMMENT_CREATED',
  SpacePostCreated = 'SPACE_POST_CREATED',
  SpacePostCreatedAdmin = 'SPACE_POST_CREATED_ADMIN',
  SpaceWhiteboardCreated = 'SPACE_WHITEBOARD_CREATED',
  UserCommentReply = 'USER_COMMENT_REPLY',
  UserMention = 'USER_MENTION',
  UserMessageRecipient = 'USER_MESSAGE_RECIPIENT',
  UserMessageSender = 'USER_MESSAGE_SENDER',
}

export type NotificationRecipientResult = {
  /** The email recipients for the notification. */
  emailRecipients: Array<User>;
  /** The in-app recipients for the notification. */
  inAppRecipients: Array<User>;
  /** The user that triggered the event. */
  triggeredBy?: Maybe<User>;
};

export type NotificationRecipientsInput = {
  /** The ID of the entity to retrieve the recipients for. This could be a Space, Organization etc, and is specific to the event type. */
  entityID?: InputMaybe<Scalars['UUID']['input']>;
  /** The type of notification setting to look up recipients for. */
  eventType: NotificationEvent;
  /** The ID of the User that triggered the event. */
  triggeredBy?: InputMaybe<Scalars['UUID']['input']>;
};

export enum OpenAiModel {
  Babbage_002 = 'BABBAGE_002',
  DallE_2 = 'DALL_E_2',
  DallE_3 = 'DALL_E_3',
  Davinci_002 = 'DAVINCI_002',
  Gpt_3_5Turbo = 'GPT_3_5_TURBO',
  Gpt_4 = 'GPT_4',
  Gpt_4O = 'GPT_4O',
  Gpt_4OAudioPreview = 'GPT_4O_AUDIO_PREVIEW',
  Gpt_4OMini = 'GPT_4O_MINI',
  Gpt_4OMiniAudioPreview = 'GPT_4O_MINI_AUDIO_PREVIEW',
  Gpt_4OMiniRealtimePreview = 'GPT_4O_MINI_REALTIME_PREVIEW',
  Gpt_4ORealtimePreview = 'GPT_4O_REALTIME_PREVIEW',
  Gpt_4_5Preview = 'GPT_4_5_PREVIEW',
  Gpt_4Turbo = 'GPT_4_TURBO',
  O1 = 'O1',
  O1Mini = 'O1_MINI',
  O3Mini = 'O3_MINI',
  OmniModerationLatest = 'OMNI_MODERATION_LATEST',
  TextEmbedding_3Large = 'TEXT_EMBEDDING_3_LARGE',
  TextEmbedding_3Small = 'TEXT_EMBEDDING_3_SMALL',
  TextEmbeddingAda_002 = 'TEXT_EMBEDDING_ADA_002',
  TextModerationLatest = 'TEXT_MODERATION_LATEST',
  Tts_1 = 'TTS_1',
  Tts_1Hd = 'TTS_1_HD',
  Whisper_1 = 'WHISPER_1',
}

export type Organization = Contributor &
  Groupable & {
    /** The account hosted by this Organization. */
    account?: Maybe<Account>;
    /** The Agent representing this User. */
    agent: Agent;
    /** The authorization rules for the Contributor */
    authorization?: Maybe<Authorization>;
    /** Organization contact email */
    contactEmail?: Maybe<Scalars['String']['output']>;
    /** The date at which the entity was created. */
    createdDate: Scalars['DateTime']['output'];
    /** Domain name; what is verified, eg. alkem.io */
    domain?: Maybe<Scalars['String']['output']>;
    /** Group defined on this organization. */
    group?: Maybe<UserGroup>;
    /** Groups defined on this organization. */
    groups?: Maybe<Array<UserGroup>>;
    /** The ID of the Contributor */
    id: Scalars['UUID']['output'];
    /** Legal name - required if hosting an Space */
    legalEntityName?: Maybe<Scalars['String']['output']>;
    /** Metrics about the activity within this Organization. */
    metrics?: Maybe<Array<Nvp>>;
    /** A name identifier of the Contributor, unique within a given scope. */
    nameID: Scalars['NameID']['output'];
    /** The profile for this Organization. */
    profile: Profile;
    /** The RoleSet for this Organization. */
    roleSet: RoleSet;
    /** The settings for this Organization. */
    settings: OrganizationSettings;
    /** The StorageAggregator for managing storage buckets in use by this Organization */
    storageAggregator?: Maybe<StorageAggregator>;
    /** The date at which the entity was last updated. */
    updatedDate: Scalars['DateTime']['output'];
    verification: OrganizationVerification;
    /** Organization website */
    website?: Maybe<Scalars['String']['output']>;
  };

export type OrganizationGroupArgs = {
  ID: Scalars['UUID']['input'];
};

export type OrganizationAuthorizationResetInput = {
  /** The identifier of the Organization whose Authorization Policy should be reset. */
  organizationID: Scalars['UUID']['input'];
};

export type OrganizationFilterInput = {
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  nameID?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type OrganizationSettings = {
  /** The membership settings for this Organization. */
  membership: OrganizationSettingsMembership;
  /** The privacy settings for this Organization */
  privacy: OrganizationSettingsPrivacy;
};

export type OrganizationSettingsMembership = {
  /** Allow Users with email addresses matching the domain of this Organization to join. */
  allowUsersMatchingDomainToJoin: Scalars['Boolean']['output'];
};

export type OrganizationSettingsPrivacy = {
  /** Allow contribution roles (membership, lead etc) in Spaces to be visible. */
  contributionRolesPubliclyVisible: Scalars['Boolean']['output'];
};

export type OrganizationVerification = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Is this lifecycle in a final state (done). */
  isFinalized: Scalars['Boolean']['output'];
  lifecycle: Lifecycle;
  /** The next events of this Lifecycle. */
  nextEvents: Array<Scalars['String']['output']>;
  /** The current state of this Lifecycle. */
  state: Scalars['String']['output'];
  /** Organization verification type */
  status: OrganizationVerificationEnum;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export enum OrganizationVerificationEnum {
  NotVerified = 'NOT_VERIFIED',
  VerifiedManualAttestation = 'VERIFIED_MANUAL_ATTESTATION',
}

export type OrganizationVerificationEventInput = {
  eventName: Scalars['String']['input'];
  organizationVerificationID: Scalars['UUID']['input'];
};

export type OrganizationsInRolesResponse = {
  organizations: Array<Organization>;
  role: RoleName;
};

export type OryConfig = {
  /** Ory Issuer. */
  issuer: Scalars['String']['output'];
  /** Ory Kratos Public Base URL. Used by all Kratos Public Clients. */
  kratosPublicBaseURL: Scalars['String']['output'];
};

export type PageInfo = {
  /** The last cursor of the page result */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicate whether more items exist after the returned ones */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicate whether more items exist before the returned ones */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** The first cursor of the page result */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedOrganization = {
  organization: Array<Organization>;
  pageInfo: PageInfo;
  total: Scalars['Float']['output'];
};

export type PaginatedSpaces = {
  pageInfo: PageInfo;
  spaces: Array<Space>;
  total: Scalars['Float']['output'];
};

export type PaginatedUsers = {
  pageInfo: PageInfo;
  total: Scalars['Float']['output'];
  users: Array<User>;
};

export type PaginatedVirtualContributor = {
  pageInfo: PageInfo;
  total: Scalars['Float']['output'];
  virtualContributors: Array<VirtualContributor>;
};

export type Platform = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The Virtual Contributor that is used to provide chat help on the platform. */
  chatGuidanceVirtualContributor: VirtualContributor;
  /** Alkemio configuration. Provides configuration to external services in the Alkemio ecosystem. */
  configuration: Config;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The Forum for the platform */
  forum: Forum;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Details about the current Innovation Hub you are in. */
  innovationHub?: Maybe<InnovationHub>;
  /** The latest release discussion. */
  latestReleaseDiscussion?: Maybe<LatestReleaseDiscussion>;
  /** The Innovation Library for the platform */
  library: Library;
  /** The Licensing in use by the platform. */
  licensingFramework: Licensing;
  /** Alkemio Services Metadata. */
  metadata: Metadata;
  /** The RoleSet for this Platform. */
  roleSet: RoleSet;
  /** The settings of the Platform. */
  settings: PlatformSettings;
  /** The StorageAggregator with documents in use by Users + Organizations on the Platform. */
  storageAggregator: StorageAggregator;
  /** The TemplatesManager in use by the Platform */
  templatesManager?: Maybe<TemplatesManager>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type PlatformInnovationHubArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  subdomain?: InputMaybe<Scalars['String']['input']>;
};

export type PlatformFeatureFlag = {
  /** Is this feature flag enabled? */
  enabled: Scalars['Boolean']['output'];
  /** The name of the feature flag */
  name: PlatformFeatureFlagName;
};

export enum PlatformFeatureFlagName {
  Communications = 'COMMUNICATIONS',
  CommunicationsDiscussions = 'COMMUNICATIONS_DISCUSSIONS',
  GuidenceEngine = 'GUIDENCE_ENGINE',
  LandingPage = 'LANDING_PAGE',
  Notifications = 'NOTIFICATIONS',
  Ssi = 'SSI',
  Subscriptions = 'SUBSCRIPTIONS',
  Whiteboards = 'WHITEBOARDS',
}

export type PlatformIntegrationSettings = {
  /** The list of allowed URLs for iFrames within Markdown content. */
  iframeAllowedUrls: Array<Scalars['String']['output']>;
};

export type PlatformInvitation = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The User who created the platformInvitation. */
  createdBy: User;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The email address of the external user being invited */
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  /** The platform role the user will receive when they sign up */
  platformRole?: Maybe<RoleName>;
  /** Whether a new user profile has been created. */
  profileCreated: Scalars['Boolean']['output'];
  /** Additional roles to assign to the Contributor, in addition to the entry Role. */
  roleSetExtraRoles: Array<RoleName>;
  /** Whether to also add the invited user to the parent community. */
  roleSetInvitedToParent: Scalars['Boolean']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  welcomeMessage?: Maybe<Scalars['String']['output']>;
};

export type PlatformLocations = {
  /** URL to a page about the platform */
  about: Scalars['String']['output'];
  /** URL where users can get tips and tricks */
  aup: Scalars['String']['output'];
  /** URL to the blog of the platform */
  blog: Scalars['String']['output'];
  /** URL where users can see the community forum */
  community: Scalars['String']['output'];
  /** URL for the link Contact in the HomePage and to create a new space with Enterprise plan */
  contactsupport: Scalars['String']['output'];
  /** URL for the documentation site */
  documentation: Scalars['String']['output'];
  /** Main domain of the environment */
  domain: Scalars['String']['output'];
  /** Name of the environment */
  environment: Scalars['String']['output'];
  /** URL to a form for providing feedback */
  feedback: Scalars['String']['output'];
  /** URL to latest forum release discussion where users can get information about the latest release */
  forumreleases: Scalars['String']['output'];
  /** URL for the link Foundation in the HomePage of the application */
  foundation: Scalars['String']['output'];
  /** URL where users can get help */
  help: Scalars['String']['output'];
  /** URL for the link Impact in the HomePage of the application */
  impact: Scalars['String']['output'];
  /** URL to a page about the innovation library */
  innovationLibrary: Scalars['String']['output'];
  /** URL to a page about the collaboration tools */
  inspiration: Scalars['String']['output'];
  /** URL to the landing page of the platform */
  landing: Scalars['String']['output'];
  /** URL where new users can get onboarding help */
  newuser: Scalars['String']['output'];
  /** URL for the link Opensource in the HomePage of the application */
  opensource: Scalars['String']['output'];
  /** URL to the privacy policy for the platform */
  privacy: Scalars['String']['output'];
  /** URL where users can get information about previous releases */
  releases: Scalars['String']['output'];
  /** URL to the security policy for the platform */
  security: Scalars['String']['output'];
  /** URL where users can get support for the platform */
  support: Scalars['String']['output'];
  /** URL for the link Contact in the HomePage to switch between plans */
  switchplan: Scalars['String']['output'];
  /** URL to the terms of usage for the platform */
  terms: Scalars['String']['output'];
  /** URL where users can get tips and tricks */
  tips: Scalars['String']['output'];
};

export type PlatformSettings = {
  /** The integration settings for this Platform */
  integration: PlatformIntegrationSettings;
};

export type Post = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The comments on this Post. */
  comments: Room;
  /** The user that created this Post */
  createdBy?: Maybe<User>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The Profile for this Post. */
  profile: Profile;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type Profile = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** A description of the entity associated with this profile. */
  description?: Maybe<Scalars['Markdown']['output']>;
  /** The display name. */
  displayName: Scalars['String']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The location for this Profile. */
  location?: Maybe<Location>;
  /** A list of URLs to relevant information. */
  references?: Maybe<Array<Reference>>;
  /** The storage bucket for this Profile. */
  storageBucket: StorageBucket;
  /** The tagline for this entity. */
  tagline?: Maybe<Scalars['String']['output']>;
  /** The default or named tagset. */
  tagset?: Maybe<Tagset>;
  /** A list of named tagsets, each of which has a list of tags. */
  tagsets?: Maybe<Array<Tagset>>;
  /** A type of entity that this Profile is being used with. */
  type?: Maybe<ProfileType>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The URL at which this profile can be viewed. */
  url: Scalars['String']['output'];
  /** A particular type of visual for this Profile. */
  visual?: Maybe<Visual>;
  /** A list of visuals for this Profile. */
  visuals: Array<Visual>;
};

export type ProfileTagsetArgs = {
  tagsetName?: InputMaybe<TagsetReservedName>;
};

export type ProfileVisualArgs = {
  type: VisualType;
};

export type ProfileCredentialVerified = {
  /** The email */
  userEmail: Scalars['String']['output'];
  /** The vc. */
  vc: Scalars['String']['output'];
};

export enum ProfileType {
  CalendarEvent = 'CALENDAR_EVENT',
  CalloutFraming = 'CALLOUT_FRAMING',
  CommunityGuidelines = 'COMMUNITY_GUIDELINES',
  ContributionLink = 'CONTRIBUTION_LINK',
  Discussion = 'DISCUSSION',
  InnovationFlow = 'INNOVATION_FLOW',
  InnovationHub = 'INNOVATION_HUB',
  InnovationPack = 'INNOVATION_PACK',
  KnowledgeBase = 'KNOWLEDGE_BASE',
  Memo = 'MEMO',
  Organization = 'ORGANIZATION',
  Post = 'POST',
  SpaceAbout = 'SPACE_ABOUT',
  Template = 'TEMPLATE',
  User = 'USER',
  UserGroup = 'USER_GROUP',
  VirtualContributor = 'VIRTUAL_CONTRIBUTOR',
  VirtualPersona = 'VIRTUAL_PERSONA',
  Whiteboard = 'WHITEBOARD',
}

export type Query = {
  /** The Accounts on this platform; If accessed through an Innovation Hub will return ONLY the Accounts defined in it. */
  accounts: Array<Account>;
  /** Activity events related to the current user. */
  activityFeed: ActivityFeed;
  /** Activity events related to the current user grouped by Activity type and resource. */
  activityFeedGrouped: Array<ActivityLogEntry>;
  /** Retrieve the ActivityLog for the specified Collaboration */
  activityLogOnCollaboration: Array<ActivityLogEntry>;
  /** All Users that are members of a given room */
  adminCommunicationMembership: CommunicationAdminMembershipResult;
  /** Usage of the messaging platform that are not tied to the domain model. */
  adminCommunicationOrphanedUsage: CommunicationAdminOrphanedUsageResult;
  /** Alkemio AiServer */
  aiServer: AiServer;
  /** Active Spaces only, order by most active in the past X days. */
  exploreSpaces: Array<Space>;
  /** Get supported credential metadata */
  getSupportedVerifiedCredentialMetadata: Array<CredentialMetadataOutput>;
  /** Allow creation of inputs based on existing entities in the domain model */
  inputCreator: InputCreatorQueryResults;
  /** Allow direct lookup of entities from the domain model */
  lookup: LookupQueryResults;
  /** Allow direct lookup of entities using their NameIDs */
  lookupByName: LookupByNameQueryResults;
  /** Information about the current authenticated user */
  me: MeQueryResults;
  /** The notificationRecipients for the provided event on the given entity. */
  notificationRecipients: NotificationRecipientResult;
  /** Get all notifications for the logged in user. */
  notifications: Array<InAppNotification>;
  /** A particular Organization */
  organization: Organization;
  /** The Organizations on this platform */
  organizations: Array<Organization>;
  /** The Organizations on this platform in paginated format */
  organizationsPaginated: PaginatedOrganization;
  /** Alkemio Platform */
  platform: Platform;
  /** Get the list of restricted space names. */
  restrictedSpaceNames: Array<Scalars['String']['output']>;
  /** The roles that the specified Organization has. */
  rolesOrganization: ContributorRoles;
  /** The roles that that the specified User has. */
  rolesUser: ContributorRoles;
  /** The roles that the specified VirtualContributor has. */
  rolesVirtualContributor: ContributorRoles;
  /** Search the platform for terms supplied */
  search: ISearchResults;
  /** The Spaces on this platform; If accessed through an Innovation Hub will return ONLY the Spaces defined in it. */
  spaces: Array<Space>;
  /** The Spaces on this platform */
  spacesPaginated: PaginatedSpaces;
  /** Information about a specific task */
  task: Task;
  /** All tasks with filtering applied */
  tasks: Array<Task>;
  /** Allow resolving of a URL into a set of IDs. */
  urlResolver: UrlResolverQueryResults;
  /** A particular user, identified by the ID or by email */
  user: User;
  /** Privileges assigned to a User (based on held credentials) given an Authorization defnition. */
  userAuthorizationPrivileges: Array<AuthorizationPrivilege>;
  /** The users who have profiles on this platform */
  users: Array<User>;
  /** The users who have profiles on this platform */
  usersPaginated: PaginatedUsers;
  /** All Users that hold credentials matching the supplied criteria. */
  usersWithAuthorizationCredential: Array<User>;
  /** A particular VirtualContributor */
  virtualContributor: VirtualContributor;
  /** The VirtualContributors on this platform; only accessible to platform admins */
  virtualContributors: Array<VirtualContributor>;
};

export type QueryActivityFeedArgs = {
  after?: InputMaybe<Scalars['UUID']['input']>;
  args?: InputMaybe<ActivityFeedQueryArgs>;
  before?: InputMaybe<Scalars['UUID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryActivityFeedGroupedArgs = {
  args?: InputMaybe<ActivityFeedGroupedQueryArgs>;
};

export type QueryActivityLogOnCollaborationArgs = {
  queryData: ActivityLogInput;
};

export type QueryAdminCommunicationMembershipArgs = {
  communicationData: CommunicationAdminMembershipInput;
};

export type QueryExploreSpacesArgs = {
  options?: InputMaybe<ExploreSpacesInput>;
};

export type QueryNotificationRecipientsArgs = {
  eventData: NotificationRecipientsInput;
};

export type QueryOrganizationArgs = {
  ID: Scalars['UUID']['input'];
};

export type QueryOrganizationsArgs = {
  filter?: InputMaybe<ContributorFilterInput>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  shuffle?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryOrganizationsPaginatedArgs = {
  after?: InputMaybe<Scalars['UUID']['input']>;
  before?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<OrganizationFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrganizationVerificationEnum>;
};

export type QueryRolesOrganizationArgs = {
  rolesData: RolesOrganizationInput;
};

export type QueryRolesUserArgs = {
  rolesData: RolesUserInput;
};

export type QueryRolesVirtualContributorArgs = {
  rolesData: RolesVirtualContributorInput;
};

export type QuerySearchArgs = {
  searchData: SearchInput;
};

export type QuerySpacesArgs = {
  IDs?: InputMaybe<Array<Scalars['UUID']['input']>>;
  filter?: InputMaybe<SpaceFilterInput>;
};

export type QuerySpacesPaginatedArgs = {
  after?: InputMaybe<Scalars['UUID']['input']>;
  before?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<SpaceFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTaskArgs = {
  id: Scalars['UUID']['input'];
};

export type QueryTasksArgs = {
  status?: InputMaybe<TaskStatus>;
};

export type QueryUrlResolverArgs = {
  url: Scalars['String']['input'];
};

export type QueryUserArgs = {
  ID: Scalars['UUID']['input'];
};

export type QueryUserAuthorizationPrivilegesArgs = {
  userAuthorizationPrivilegesData: UserAuthorizationPrivilegesInput;
};

export type QueryUsersArgs = {
  IDs?: InputMaybe<Array<Scalars['UUID']['input']>>;
  filter?: InputMaybe<ContributorFilterInput>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  shuffle?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryUsersPaginatedArgs = {
  after?: InputMaybe<Scalars['UUID']['input']>;
  before?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<UserFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  withTags?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryUsersWithAuthorizationCredentialArgs = {
  credentialsCriteriaData: UsersWithAuthorizationCredentialInput;
};

export type QueryVirtualContributorArgs = {
  ID: Scalars['UUID']['input'];
};

export type QueryVirtualContributorsArgs = {
  filter?: InputMaybe<ContributorFilterInput>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  shuffle?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Question = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

/** A reaction to a message. */
export type Reaction = {
  /** The reaction Emoji */
  emoji: Scalars['Emoji']['output'];
  /** The id for the reaction. */
  id: Scalars['MessageID']['output'];
  /** The user that reacted */
  sender?: Maybe<User>;
  /** The server timestamp in UTC */
  timestamp: Scalars['Float']['output'];
};

export type Reference = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** Description of this reference */
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Name of the reference, e.g. Linkedin, Twitter etc. */
  name: Scalars['String']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** URI of the reference */
  uri: Scalars['String']['output'];
};

export type RefreshVirtualContributorBodyOfKnowledgeInput = {
  /** The ID of the Virtual Contributor to update. */
  virtualContributorID: Scalars['UUID']['input'];
};

export type RelayPaginatedSpace = {
  /** About this space. */
  about: SpaceAbout;
  /** The Account that this Space is part of. */
  account: Account;
  /** The "highest" subscription active for this Space. */
  activeSubscription?: Maybe<SpaceSubscription>;
  /** The Agent representing this Space. */
  agent: Agent;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The collaboration for the Space. */
  collaboration: Collaboration;
  /** Get the Community for the Space.  */
  community: Community;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The level of this Space, representing the number of Spaces above this one. */
  level: SpaceLevel;
  /** The ID of the level zero space for this tree. */
  levelZeroSpaceID: Scalars['String']['output'];
  /** The License operating on this Space. */
  license: License;
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The settings for this Space. */
  settings: SpaceSettings;
  /** The StorageAggregator in use by this Space */
  storageAggregator: StorageAggregator;
  /** The subscriptions active for this Space. */
  subscriptions: Array<SpaceSubscription>;
  /** A particular subspace by its nameID */
  subspaceByNameID: Space;
  /** The subspaces for the space. */
  subspaces: Array<Space>;
  /** The TemplatesManager in use by this Space */
  templatesManager?: Maybe<TemplatesManager>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** Visibility of the Space. */
  visibility: SpaceVisibility;
};

export type RelayPaginatedSpaceSubspaceByNameIdArgs = {
  NAMEID: Scalars['NameID']['input'];
};

export type RelayPaginatedSpaceSubspacesArgs = {
  IDs?: InputMaybe<Array<Scalars['UUID']['input']>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  shuffle?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RelayPaginatedSpaceEdge = {
  node: RelayPaginatedSpace;
};

export type RelayPaginatedSpacePageInfo = {
  /** The last cursor of the page result */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicate whether more items exist after the returned ones */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicate whether more items exist before the returned ones */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** The first cursor of the page result */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type RemoveCommunityGuidelinesContentInput = {
  /** ID of the CommunityGuidelines that will be emptied */
  communityGuidelinesID: Scalars['UUID']['input'];
};

export type RemovePlatformRoleInput = {
  contributorID: Scalars['UUID']['input'];
  role: RoleName;
};

export type RemoveRoleOnRoleSetFromOrganizationInput = {
  contributorID: Scalars['UUID']['input'];
  role: RoleName;
  roleSetID: Scalars['UUID']['input'];
};

export type RemoveRoleOnRoleSetFromUserInput = {
  contributorID: Scalars['UUID']['input'];
  role: RoleName;
  roleSetID: Scalars['UUID']['input'];
};

export type RemoveRoleOnRoleSetFromVirtualContributorInput = {
  contributorID: Scalars['UUID']['input'];
  role: RoleName;
  roleSetID: Scalars['UUID']['input'];
};

export type RemoveUserGroupMemberInput = {
  groupID: Scalars['UUID']['input'];
  userID: Scalars['UUID']['input'];
};

export type RevokeAuthorizationCredentialInput = {
  /** The resource to which access is being removed. */
  resourceID: Scalars['String']['input'];
  type: AuthorizationCredential;
  /** The user from whom the credential is being removed. */
  userID: Scalars['UUID']['input'];
};

export type RevokeLicensePlanFromAccount = {
  /** The ID of the Account to assign the LicensePlan to. */
  accountID: Scalars['UUID']['input'];
  /** The ID of the LicensePlan to assign. */
  licensePlanID: Scalars['UUID']['input'];
  /** The ID of the Licensing to use. */
  licensingID?: InputMaybe<Scalars['UUID']['input']>;
};

export type RevokeLicensePlanFromSpace = {
  /** The ID of the LicensePlan to assign. */
  licensePlanID: Scalars['UUID']['input'];
  /** The ID of the Licensing to use. */
  licensingID?: InputMaybe<Scalars['UUID']['input']>;
  /** The ID of the Space to assign the LicensePlan to. */
  spaceID: Scalars['UUID']['input'];
};

export type RevokeOrganizationAuthorizationCredentialInput = {
  /** The Organization from whom the credential is being removed. */
  organizationID: Scalars['UUID']['input'];
  /** The resource to which access is being removed. */
  resourceID?: InputMaybe<Scalars['UUID']['input']>;
  type: AuthorizationCredential;
};

export type Role = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The Credential associated with this Role. */
  credential: CredentialDefinition;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The CommunityRole that this role definition is for. */
  name: RoleName;
  /** The role policy that applies for Organizations in this Role. */
  organizationPolicy: ContributorRolePolicy;
  /** The Credential associated with this Role. */
  parentCredentials: Array<CredentialDefinition>;
  /** Flag to indicate if this Role requires the entry level role to be held. */
  requiresEntryRole: Scalars['Boolean']['output'];
  /** Flag to indicate if this Role requires having the same role in the Parent RoleSet. */
  requiresSameRoleInParentRoleSet: Scalars['Boolean']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The role policy that applies for Users in this Role. */
  userPolicy: ContributorRolePolicy;
  /** The role policy that applies for VirtualContributors in this Role. */
  virtualContributorPolicy: ContributorRolePolicy;
};

export enum RoleName {
  Admin = 'ADMIN',
  Associate = 'ASSOCIATE',
  GlobalAdmin = 'GLOBAL_ADMIN',
  GlobalCommunityReader = 'GLOBAL_COMMUNITY_READER',
  GlobalLicenseManager = 'GLOBAL_LICENSE_MANAGER',
  GlobalPlatformManager = 'GLOBAL_PLATFORM_MANAGER',
  GlobalSpacesReader = 'GLOBAL_SPACES_READER',
  GlobalSupport = 'GLOBAL_SUPPORT',
  GlobalSupportManager = 'GLOBAL_SUPPORT_MANAGER',
  Lead = 'LEAD',
  Member = 'MEMBER',
  Owner = 'OWNER',
  PlatformBetaTester = 'PLATFORM_BETA_TESTER',
  PlatformVcCampaign = 'PLATFORM_VC_CAMPAIGN',
}

export type RoleSet = {
  /** The Form used for Applications to this roleSet. */
  applicationForm: Form;
  /** Applications available for this RoleSet. */
  applications: Array<Application>;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** All users that have the entryRole in the RoleSet, minus those already in the specified role. */
  availableUsersForElevatedRole: PaginatedUsers;
  /** All available users that are could join this RoleSet in the entry role. */
  availableUsersForEntryRole: PaginatedUsers;
  /** All available VirtualContributors that are eligible to invite to this RoleSet in the entry role. */
  availableVirtualContributorsForEntryRole: PaginatedVirtualContributor;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The Role that acts as the entry Role for the RoleSet, so other roles potentially require it. */
  entryRoleName: RoleName;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Invitations for this roleSet. */
  invitations: Array<Invitation>;
  /** The License operating on this RoleSet. */
  license: License;
  /** The membership status of the currently logged in user. */
  myMembershipStatus?: Maybe<CommunityMembershipStatus>;
  /** The roles on this community for the currently logged in user. */
  myRoles: Array<RoleName>;
  /** The implicit roles on this community for the currently logged in user. */
  myRolesImplicit: Array<RoleSetRoleImplicit>;
  /** All Organizations that have the specified Role in this Community. */
  organizationsInRole: Array<Organization>;
  /** All organizations that have a role in this RoleSet in the specified Roles. */
  organizationsInRoles: Array<OrganizationsInRolesResponse>;
  /** Invitations to join this RoleSet in an entry role for users not yet on the Alkemio platform. */
  platformInvitations: Array<PlatformInvitation>;
  /** The Role Definitions from this RoleSet to return. */
  roleDefinition: Role;
  /** The Role Definitions included in this roleSet. */
  roleDefinitions: Array<Role>;
  /** The Roles available in this roleSet. */
  roleNames: Array<RoleName>;
  /** A type of entity that this RoleSet is being used with. */
  type?: Maybe<RoleSetType>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** All users that are contributing to this Community in the specified Role. */
  usersInRole: Array<User>;
  /** All users that have a Role in this RoleSet in the specified Roles. */
  usersInRoles: Array<UsersInRolesResponse>;
  /** All Virtual Contributors that have the specified Role in this Community. */
  virtualContributorsInRole: Array<VirtualContributor>;
  /** All Virtual Contributors that are available from the current or parent RoleSets. */
  virtualContributorsInRoleInHierarchy: Array<VirtualContributor>;
  /** All VirtualContributors that have a role in this RoleSet in the specified Roles. */
  virtualContributorsInRoles: Array<VirtualContributorsInRolesResponse>;
};

export type RoleSetAvailableUsersForElevatedRoleArgs = {
  after?: InputMaybe<Scalars['UUID']['input']>;
  before?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<UserFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  role: RoleName;
};

export type RoleSetAvailableUsersForEntryRoleArgs = {
  after?: InputMaybe<Scalars['UUID']['input']>;
  before?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<UserFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type RoleSetAvailableVirtualContributorsForEntryRoleArgs = {
  after?: InputMaybe<Scalars['UUID']['input']>;
  before?: InputMaybe<Scalars['UUID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type RoleSetOrganizationsInRoleArgs = {
  role: RoleName;
};

export type RoleSetOrganizationsInRolesArgs = {
  roles: Array<RoleName>;
};

export type RoleSetRoleDefinitionArgs = {
  role: RoleName;
};

export type RoleSetRoleDefinitionsArgs = {
  roles?: InputMaybe<Array<RoleName>>;
};

export type RoleSetUsersInRoleArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  role: RoleName;
};

export type RoleSetUsersInRolesArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  roles: Array<RoleName>;
};

export type RoleSetVirtualContributorsInRoleArgs = {
  role: RoleName;
};

export type RoleSetVirtualContributorsInRoleInHierarchyArgs = {
  role: RoleName;
};

export type RoleSetVirtualContributorsInRolesArgs = {
  roles: Array<RoleName>;
};

export enum RoleSetContributorType {
  Organization = 'ORGANIZATION',
  User = 'USER',
  Virtual = 'VIRTUAL',
}

export type RoleSetInvitationResult = {
  invitation?: Maybe<Invitation>;
  platformInvitation?: Maybe<PlatformInvitation>;
  type: RoleSetInvitationResultType;
};

export enum RoleSetInvitationResultType {
  AlreadyInvitedToPlatformAndRoleSet = 'ALREADY_INVITED_TO_PLATFORM_AND_ROLE_SET',
  AlreadyInvitedToRoleSet = 'ALREADY_INVITED_TO_ROLE_SET',
  InvitationToParentNotAuthorized = 'INVITATION_TO_PARENT_NOT_AUTHORIZED',
  InvitedToPlatformAndRoleSet = 'INVITED_TO_PLATFORM_AND_ROLE_SET',
  InvitedToRoleSet = 'INVITED_TO_ROLE_SET',
}

export enum RoleSetRoleImplicit {
  AccountAdmin = 'ACCOUNT_ADMIN',
  SubspaceAdmin = 'SUBSPACE_ADMIN',
}

export enum RoleSetType {
  Organization = 'ORGANIZATION',
  Platform = 'PLATFORM',
  Space = 'SPACE',
}

export type RolesOrganizationInput = {
  /** Return membership in Spaces matching the provided filter. */
  filter?: InputMaybe<SpaceFilterInput>;
  /** The ID of the organization to retrieve the roles of. */
  organizationID: Scalars['UUID']['input'];
};

export type RolesResult = {
  /** Display name of the entity */
  displayName: Scalars['String']['output'];
  /** A unique identifier for this membership result. */
  id: Scalars['String']['output'];
  /** Name Identifier of the entity */
  nameID: Scalars['NameID']['output'];
  /** The roles held by the contributor */
  roles: Array<Scalars['String']['output']>;
};

export type RolesResultCommunity = {
  /** Display name of the entity */
  displayName: Scalars['String']['output'];
  /** A unique identifier for this membership result. */
  id: Scalars['String']['output'];
  /** The level of the Space e.g. L0/L1/L2. */
  level: SpaceLevel;
  /** Name Identifier of the entity */
  nameID: Scalars['NameID']['output'];
  /** The roles held by the contributor */
  roles: Array<Scalars['String']['output']>;
};

export type RolesResultOrganization = {
  /** Display name of the entity */
  displayName: Scalars['String']['output'];
  /** A unique identifier for this membership result. */
  id: Scalars['String']['output'];
  /** Name Identifier of the entity */
  nameID: Scalars['NameID']['output'];
  /** The Organization ID. */
  organizationID: Scalars['String']['output'];
  /** The roles held by the contributor */
  roles: Array<Scalars['String']['output']>;
  /** Details of the Groups in the Organizations the user is a member of */
  userGroups: Array<RolesResult>;
};

export type RolesResultSpace = {
  /** Display name of the entity */
  displayName: Scalars['String']['output'];
  /** A unique identifier for this membership result. */
  id: Scalars['String']['output'];
  /** The level of the Space e.g. L0/L1/L2. */
  level: SpaceLevel;
  /** Name Identifier of the entity */
  nameID: Scalars['NameID']['output'];
  /** The roles held by the contributor */
  roles: Array<Scalars['String']['output']>;
  /** The Space ID */
  spaceID: Scalars['String']['output'];
  /** Details of the Subspace the user is a member of */
  subspaces: Array<RolesResultCommunity>;
  /** Visibility of the Space. */
  visibility: SpaceVisibility;
};

export type RolesUserInput = {
  /** Return membership in Spaces matching the provided filter. */
  filter?: InputMaybe<SpaceFilterInput>;
  /** The ID of the user to retrieve the roles of. */
  userID: Scalars['UUID']['input'];
};

export type RolesVirtualContributorInput = {
  /** The ID or nameID of the VC to retrieve the roles of. */
  virtualContributorID: Scalars['UUID']['input'];
};

export type Room = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Messages in this Room. */
  messages: Array<Message>;
  /** The number of messages in the Room. */
  messagesCount: Scalars['Float']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** Virtual Contributor Interactions in this Room. */
  vcInteractions: Array<VcInteraction>;
};

export type RoomAddReactionToMessageInput = {
  /** The reaction to the message. */
  emoji: Scalars['Emoji']['input'];
  /** The message id that is being reacted to */
  messageID: Scalars['MessageID']['input'];
  /** The Room to remove a message from. */
  roomID: Scalars['UUID']['input'];
};

/** The event happened in the subscribed room */
export type RoomEventSubscriptionResult = {
  /** A message related event. */
  message?: Maybe<RoomMessageEventSubscriptionResult>;
  /** A message reaction related event. */
  reaction?: Maybe<RoomMessageReactionEventSubscriptionResult>;
  /** The Room on which the event happened. */
  room: Room;
  /** The identifier for the Room on which the event happened. */
  roomID: Scalars['String']['output'];
};

/** A message event happened in the subscribed room */
export type RoomMessageEventSubscriptionResult = {
  /** A message related event. */
  data: Message;
  /** The type of event. */
  type: MutationType;
};

/** A message reaction event happened in the subscribed room */
export type RoomMessageReactionEventSubscriptionResult = {
  /** A message related event. */
  data: Reaction;
  /** The message on which the reaction event happened. */
  messageID?: Maybe<Scalars['String']['output']>;
  /** The type of event. */
  type: MutationType;
};

export type RoomRemoveMessageInput = {
  /** The message id that should be removed */
  messageID: Scalars['MessageID']['input'];
  /** The Room to remove a message from. */
  roomID: Scalars['UUID']['input'];
};

export type RoomRemoveReactionToMessageInput = {
  /** The reaction that is being removed */
  reactionID: Scalars['MessageID']['input'];
  /** The Room to remove a message from. */
  roomID: Scalars['UUID']['input'];
};

export type RoomSendMessageInput = {
  /** The message being sent */
  message: Scalars['String']['input'];
  /** The Room the message is being sent to */
  roomID: Scalars['UUID']['input'];
};

export type RoomSendMessageReplyInput = {
  /** The message being sent */
  message: Scalars['String']['input'];
  /** The Room the message is being sent to */
  roomID: Scalars['UUID']['input'];
  /** The message starting the thread being replied to */
  threadID: Scalars['MessageID']['input'];
};

/** The category in which to search. A category may include a couple of entity types, e.g. "responses" include posts, whiteboard, etc. */
export enum SearchCategory {
  CollaborationTools = 'COLLABORATION_TOOLS',
  Contributors = 'CONTRIBUTORS',
  Responses = 'RESPONSES',
  Spaces = 'SPACES',
}

export type SearchFilterInput = {
  /** Include this category in the search results. */
  category: SearchCategory;
  /** The cursor after which we want results (offset) - pass this from your previous search to request additional results. Useful for paginating results. */
  cursor?: InputMaybe<Scalars['SearchCursor']['input']>;
  /** How many results per category to return. Useful for paginating results. */
  size?: InputMaybe<Scalars['Float']['input']>;
  /** Which types to include. Defaults to all in the category. */
  types?: InputMaybe<Array<SearchResultType>>;
};

export type SearchInput = {
  /** Return results that satisfy these conditions. */
  filters?: InputMaybe<Array<SearchFilterInput>>;
  /** Restrict the search to only the specified Space. Default is all Spaces. */
  searchInSpaceFilter?: InputMaybe<Scalars['UUID']['input']>;
  /** Expand the search to includes Tagsets with the provided names. Max 2. */
  tagsetNames?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The terms to be searched for within this Space. Max 5. */
  terms: Array<Scalars['String']['input']>;
};

export type SearchResult = {
  /** The identifier of the search result. Does not represent the entity in Alkemio. */
  id: Scalars['UUID']['output'];
  /** The score for this search result; more matches means a higher score. */
  score: Scalars['Float']['output'];
  /** The terms that were matched for this result */
  terms: Array<Scalars['String']['output']>;
  /** The type of returned result for this search. */
  type: SearchResultType;
};

export type SearchResultCallout = SearchResult & {
  /** The Callout that was found. */
  callout: Callout;
  /** The identifier of the search result. Does not represent the entity in Alkemio. */
  id: Scalars['UUID']['output'];
  /** The score for this search result; more matches means a higher score. */
  score: Scalars['Float']['output'];
  /** The parent Space of the Callout. */
  space: Space;
  /** The terms that were matched for this result */
  terms: Array<Scalars['String']['output']>;
  /** The type of returned result for this search. */
  type: SearchResultType;
};

export type SearchResultOrganization = SearchResult & {
  /** The identifier of the search result. Does not represent the entity in Alkemio. */
  id: Scalars['UUID']['output'];
  /** The Organization that was found. */
  organization: Organization;
  /** The score for this search result; more matches means a higher score. */
  score: Scalars['Float']['output'];
  /** The terms that were matched for this result */
  terms: Array<Scalars['String']['output']>;
  /** The type of returned result for this search. */
  type: SearchResultType;
};

export type SearchResultPost = SearchResult & {
  /** The Callout of the Post. */
  callout: Callout;
  /** The identifier of the search result. Does not represent the entity in Alkemio. */
  id: Scalars['UUID']['output'];
  /** The Post that was found. */
  post: Post;
  /** The score for this search result; more matches means a higher score. */
  score: Scalars['Float']['output'];
  /** The Space of the Post. */
  space: Space;
  /** The terms that were matched for this result */
  terms: Array<Scalars['String']['output']>;
  /** The type of returned result for this search. */
  type: SearchResultType;
};

export type SearchResultSpace = SearchResult & {
  /** The identifier of the search result. Does not represent the entity in Alkemio. */
  id: Scalars['UUID']['output'];
  /** The parent of this Space, if any. */
  parentSpace?: Maybe<Space>;
  /** The score for this search result; more matches means a higher score. */
  score: Scalars['Float']['output'];
  /** The Space that was found. */
  space: Space;
  /** The terms that were matched for this result */
  terms: Array<Scalars['String']['output']>;
  /** The type of returned result for this search. */
  type: SearchResultType;
};

/** The different types of available search results. */
export enum SearchResultType {
  Callout = 'CALLOUT',
  Organization = 'ORGANIZATION',
  Post = 'POST',
  Space = 'SPACE',
  Subspace = 'SUBSPACE',
  User = 'USER',
  Whiteboard = 'WHITEBOARD',
}

export type SearchResultUser = SearchResult & {
  /** The identifier of the search result. Does not represent the entity in Alkemio. */
  id: Scalars['UUID']['output'];
  /** The score for this search result; more matches means a higher score. */
  score: Scalars['Float']['output'];
  /** The terms that were matched for this result */
  terms: Array<Scalars['String']['output']>;
  /** The type of returned result for this search. */
  type: SearchResultType;
  /** The User that was found. */
  user: User;
};

export enum SearchVisibility {
  Account = 'ACCOUNT',
  Hidden = 'HIDDEN',
  Public = 'PUBLIC',
}

export type Sentry = {
  /** Flag indicating if the client should use Sentry for monitoring. */
  enabled: Scalars['Boolean']['output'];
  /** URL to the Sentry endpoint. */
  endpoint: Scalars['String']['output'];
  /** The Sentry environment to report to. */
  environment: Scalars['String']['output'];
  /** Flag indicating if PII should be submitted on Sentry events. */
  submitPII: Scalars['Boolean']['output'];
};

export type ServiceMetadata = {
  /** Service name e.g. CT Server */
  name?: Maybe<Scalars['String']['output']>;
  /** Version in the format {major.minor.patch} - using SemVer. */
  version?: Maybe<Scalars['String']['output']>;
};

export type Space = {
  /** About this space. */
  about: SpaceAbout;
  /** The Account that this Space is part of. */
  account: Account;
  /** The "highest" subscription active for this Space. */
  activeSubscription?: Maybe<SpaceSubscription>;
  /** The Agent representing this Space. */
  agent: Agent;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The collaboration for the Space. */
  collaboration: Collaboration;
  /** Get the Community for the Space.  */
  community: Community;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The level of this Space, representing the number of Spaces above this one. */
  level: SpaceLevel;
  /** The ID of the level zero space for this tree. */
  levelZeroSpaceID: Scalars['String']['output'];
  /** The License operating on this Space. */
  license: License;
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The settings for this Space. */
  settings: SpaceSettings;
  /** The StorageAggregator in use by this Space */
  storageAggregator: StorageAggregator;
  /** The subscriptions active for this Space. */
  subscriptions: Array<SpaceSubscription>;
  /** A particular subspace by its nameID */
  subspaceByNameID: Space;
  /** The subspaces for the space. */
  subspaces: Array<Space>;
  /** The TemplatesManager in use by this Space */
  templatesManager?: Maybe<TemplatesManager>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** Visibility of the Space. */
  visibility: SpaceVisibility;
};

export type SpaceSubspaceByNameIdArgs = {
  NAMEID: Scalars['NameID']['input'];
};

export type SpaceSubspacesArgs = {
  IDs?: InputMaybe<Array<Scalars['UUID']['input']>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  shuffle?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SpaceAbout = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The guidelines for members of this Community. */
  guidelines: CommunityGuidelines;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Is the content of this Space visible to non-Members?. */
  isContentPublic: Scalars['Boolean']['output'];
  /** The membership information for this Space. */
  membership: SpaceAboutMembership;
  /** Metrics about activity within this Space. */
  metrics?: Maybe<Array<Nvp>>;
  /** The Profile for the Space. */
  profile: Profile;
  /** The Space provider (host). */
  provider: Contributor;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** Who should get involved in this challenge */
  who?: Maybe<Scalars['Markdown']['output']>;
  /** The goal that is being pursued */
  why?: Maybe<Scalars['Markdown']['output']>;
};

export type SpaceAboutMembership = {
  /** The Form used for Applications to this Space. */
  applicationForm: Form;
  /** The identifier of the Community within the Space. */
  communityID: Scalars['UUID']['output'];
  /** The Lead Organizations that are associated with this Space. */
  leadOrganizations: Array<Organization>;
  /** The Lead Users that are associated with this Space. */
  leadUsers: Array<User>;
  /** The membership status of the currently logged in user. */
  myMembershipStatus?: Maybe<CommunityMembershipStatus>;
  /** The privileges granted to the current user based on the Space membership policy. */
  myPrivileges?: Maybe<Array<AuthorizationPrivilege>>;
  /** The identifier of the RoleSet within the Space. */
  roleSetID: Scalars['UUID']['output'];
};

export type SpaceFilterInput = {
  /** Return Spaces with a Visibility matching one of the provided types. */
  visibilities?: InputMaybe<Array<SpaceVisibility>>;
};

export enum SpaceLevel {
  L0 = 'L0',
  L1 = 'L1',
  L2 = 'L2',
}

export type SpacePendingMembershipInfo = {
  /** About the Space */
  about: SpaceAbout;
  /** The CommunityGuidelines for the Space */
  communityGuidelines: CommunityGuidelines;
  /** The Space ID */
  id: Scalars['UUID']['output'];
  /** The Level of the Space */
  level: SpaceLevel;
};

export enum SpacePrivacyMode {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

export type SpaceSettings = {
  /** The collaboration settings for this Space. */
  collaboration: SpaceSettingsCollaboration;
  /** The membership settings for this Space. */
  membership: SpaceSettingsMembership;
  /** The privacy settings for this Space */
  privacy: SpaceSettingsPrivacy;
};

export type SpaceSettingsCollaboration = {
  /** Flag to control if events from Subspaces are visible on this Space calendar as well. */
  allowEventsFromSubspaces: Scalars['Boolean']['output'];
  /** Flag to control if members can create callouts. */
  allowMembersToCreateCallouts: Scalars['Boolean']['output'];
  /** Flag to control if members can create subspaces. */
  allowMembersToCreateSubspaces: Scalars['Boolean']['output'];
  /** Flag to control if ability to contribute is inherited from parent Space. */
  inheritMembershipRights: Scalars['Boolean']['output'];
};

export type SpaceSettingsMembership = {
  /** Allow subspace admins to invite to this Space. */
  allowSubspaceAdminsToInviteMembers: Scalars['Boolean']['output'];
  /** The membership policy in usage for this Space */
  policy: CommunityMembershipPolicy;
  /** The organizations that are trusted to Join as members for this Space */
  trustedOrganizations: Array<Scalars['UUID']['output']>;
};

export type SpaceSettingsPrivacy = {
  /** Flag to control if Platform Support has admin rights. */
  allowPlatformSupportAsAdmin: Scalars['Boolean']['output'];
  /** The privacy mode for this Space */
  mode: SpacePrivacyMode;
};

export type SpaceSubscription = {
  /** The expiry date of this subscription, null if it does never expire. */
  expires?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the Subscription. */
  name: LicensingCredentialBasedCredentialType;
};

export enum SpaceVisibility {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Demo = 'DEMO',
}

export type StorageAggregator = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The Storage Bucket for files directly on this Storage Aggregator (legacy). */
  directStorageBucket: StorageBucket;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The key information about the entity using this StorageAggregator, if any. */
  parentEntity?: Maybe<StorageAggregatorParent>;
  /** The aggregate size of all StorageBuckets for this StorageAggregator. */
  size: Scalars['Float']['output'];
  /** The list of child storageAggregators for this StorageAggregator. */
  storageAggregators: Array<StorageAggregator>;
  /** The Storage Buckets that are being managed via this StorageAggregators. */
  storageBuckets: Array<StorageBucket>;
  /** A type of entity that this StorageAggregator is being used with. */
  type?: Maybe<StorageAggregatorType>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

/** Valid parent is Account, Space, User, Organization, Platform */
export type StorageAggregatorParent = {
  /** The display name. */
  displayName: Scalars['String']['output'];
  /** The UUID of the parent entity. */
  id: Scalars['UUID']['output'];
  /** If the parent entity is a Space, then the level of the Space. */
  level?: Maybe<SpaceLevel>;
  /** The URL that can be used to access the parent entity. */
  url: Scalars['String']['output'];
};

export enum StorageAggregatorType {
  Account = 'ACCOUNT',
  Organization = 'ORGANIZATION',
  Platform = 'PLATFORM',
  Space = 'SPACE',
  User = 'USER',
}

export type StorageBucket = {
  /** Mime types allowed to be stored on this StorageBucket. */
  allowedMimeTypes: Array<Scalars['String']['output']>;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** A single Document */
  document?: Maybe<Document>;
  /** The list of Documents for this StorageBucket. */
  documents: Array<Document>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Maximum allowed file size on this StorageBucket. */
  maxFileSize: Scalars['Float']['output'];
  /** The key information about the entity using this StorageBucket, if any. */
  parentEntity?: Maybe<StorageBucketParent>;
  /** The aggregate size of all Documents for this StorageBucket. */
  size: Scalars['Float']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type StorageBucketDocumentArgs = {
  ID: Scalars['UUID']['input'];
};

export type StorageBucketDocumentsArgs = {
  IDs?: InputMaybe<Array<Scalars['UUID']['input']>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
};

export type StorageBucketParent = {
  /** The display name. */
  displayName: Scalars['String']['output'];
  /** The UUID of the parent entity. */
  id: Scalars['UUID']['output'];
  /** The type of entity that this StorageBucket is being used with. */
  type: ProfileType;
  /** The URL that can be used to access the parent entity. */
  url: Scalars['String']['output'];
};

export type StorageBucketUploadFileInput = {
  storageBucketId: Scalars['String']['input'];
  /** Is this a temporary Document that will be moved later to another StorageBucket. */
  temporaryLocation?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StorageBucketUploadFileOnLinkInput = {
  linkID: Scalars['String']['input'];
};

export type StorageBucketUploadFileOnReferenceInput = {
  referenceID: Scalars['String']['input'];
};

export type StorageConfig = {
  /** Config for uploading files to Alkemio. */
  file: FileStorageConfig;
};

export type Subscription = {
  activityCreated: ActivityCreatedSubscriptionResult;
  /** Receive new Update messages on Communities the currently authenticated User is a member of. */
  calloutPostCreated: CalloutPostCreated;
  /** Receive updates on Discussions */
  forumDiscussionUpdated: Discussion;
  /** New in-app notification received for the currently authenticated user. */
  inAppNotificationReceived: InAppNotification;
  /** Received on verified credentials change */
  profileVerifiedCredential: ProfileCredentialVerified;
  /** Receive Room event */
  roomEvents: RoomEventSubscriptionResult;
  /** Receive new Subspaces created on the Space. */
  subspaceCreated: SubspaceCreated;
  /** Receive updates on virtual contributors */
  virtualContributorUpdated: VirtualContributorUpdatedSubscriptionResult;
};

export type SubscriptionActivityCreatedArgs = {
  input: ActivityCreatedSubscriptionInput;
};

export type SubscriptionCalloutPostCreatedArgs = {
  calloutID: Scalars['UUID']['input'];
};

export type SubscriptionForumDiscussionUpdatedArgs = {
  forumID: Scalars['UUID']['input'];
};

export type SubscriptionRoomEventsArgs = {
  roomID: Scalars['UUID']['input'];
};

export type SubscriptionSubspaceCreatedArgs = {
  spaceID: Scalars['UUID']['input'];
};

export type SubscriptionVirtualContributorUpdatedArgs = {
  virtualContributorID: Scalars['UUID']['input'];
};

export type SubspaceCreated = {
  /** The identifier for the Space on which the subspace was created. */
  spaceID: Scalars['UUID']['output'];
  /** The subspace that has been created. */
  subspace: Space;
};

export type Tagset = {
  /** The allowed values for this Tagset. */
  allowedValues: Array<Scalars['String']['output']>;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
  type: TagsetType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type TagsetArgs = {
  /** Return only Callouts that match one of the tagsets and any of the tags in them. */
  name: TagsetReservedName;
  /** A list of tags to include. */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum TagsetReservedName {
  Capabilities = 'CAPABILITIES',
  Default = 'DEFAULT',
  FlowState = 'FLOW_STATE',
  Keywords = 'KEYWORDS',
  Skills = 'SKILLS',
}

export type TagsetTemplate = {
  allowedValues: Array<Scalars['String']['output']>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** For Tagsets of type SELECT_ONE, the default selected value. */
  defaultSelectedValue?: Maybe<Scalars['String']['output']>;
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  type: TagsetType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export enum TagsetType {
  Freeform = 'FREEFORM',
  SelectMany = 'SELECT_MANY',
  SelectOne = 'SELECT_ONE',
}

export type Task = {
  /** The timestamp when the task was created */
  created: Scalars['Float']['output'];
  /** the timestamp when the task was completed */
  end?: Maybe<Scalars['Float']['output']>;
  /** info about the errors of the task */
  errors?: Maybe<Array<Scalars['String']['output']>>;
  /** The UUID of the task */
  id: Scalars['UUID']['output'];
  /** Amount of items that need to be processed */
  itemsCount?: Maybe<Scalars['Float']['output']>;
  /** Amount of items that are already processed */
  itemsDone?: Maybe<Scalars['Float']['output']>;
  /** The progress  of the task if the total item count is defined */
  progress?: Maybe<Scalars['Float']['output']>;
  /** info about the completed part of the task */
  results?: Maybe<Array<Scalars['String']['output']>>;
  /** The timestamp when the task was started */
  start: Scalars['Float']['output'];
  /** The current status of the task */
  status: TaskStatus;
  /** TBD */
  type?: Maybe<Scalars['String']['output']>;
};

/** The current status of the task */
export enum TaskStatus {
  Completed = 'COMPLETED',
  Errored = 'ERRORED',
  InProgress = 'IN_PROGRESS',
}

export type Template = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The Callout for this Template. */
  callout?: Maybe<Callout>;
  /** The Community Guidelines for this Template. */
  communityGuidelines?: Maybe<CommunityGuidelines>;
  /** The Space for this Template. */
  contentSpace?: Maybe<TemplateContentSpace>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The description for Post Templates to users filling out a new Post based on this Template. */
  postDefaultDescription?: Maybe<Scalars['Markdown']['output']>;
  /** The Profile for this Template. */
  profile: Profile;
  /** The type for this Template. */
  type: TemplateType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The Whiteboard for this Template. */
  whiteboard?: Maybe<Whiteboard>;
};

export type TemplateContentSpace = {
  /** Template to be used to tell About a new Space. */
  about: SpaceAbout;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The collaboration for the TemplateContentSpace. */
  collaboration: Collaboration;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The level of this TemplateContentSpace */
  level: SpaceLevel;
  /** The settings for this TemplateContentSpace. */
  settings: SpaceSettings;
  /** The template subspaces for the Template Content Space. */
  subspaces: Array<TemplateContentSpace>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type TemplateDefault = {
  /** The type of any Template stored here. */
  allowedTemplateType: TemplateType;
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The template accessible via this TemplateDefault, if any. */
  template?: Maybe<Template>;
  /** The type of this TemplateDefault. */
  type: TemplateDefaultType;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export enum TemplateDefaultType {
  PlatformSpace = 'PLATFORM_SPACE',
  PlatformSpaceTutorials = 'PLATFORM_SPACE_TUTORIALS',
  PlatformSubspace = 'PLATFORM_SUBSPACE',
  PlatformSubspaceKnowledge = 'PLATFORM_SUBSPACE_KNOWLEDGE',
  SpaceSubspace = 'SPACE_SUBSPACE',
}

export type TemplateResult = {
  /** The InnovationPack where this Template is being returned from. */
  innovationPack: InnovationPack;
  /** The Template that is being returned. */
  template: Template;
};

export enum TemplateType {
  Callout = 'CALLOUT',
  CommunityGuidelines = 'COMMUNITY_GUIDELINES',
  Post = 'POST',
  Space = 'SPACE',
  Whiteboard = 'WHITEBOARD',
}

export type TemplatesManager = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The TemplateDefaults in this TemplatesManager. */
  templateDefaults: Array<TemplateDefault>;
  /** The templatesSet in use by this TemplatesManager. */
  templatesSet?: Maybe<TemplatesSet>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type TemplatesSet = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The CalloutTemplates in this TemplatesSet. */
  calloutTemplates: Array<Template>;
  /** The total number of CalloutTemplates in this TemplatesSet. */
  calloutTemplatesCount: Scalars['Float']['output'];
  /** The CommunityGuidelines in this TemplatesSet. */
  communityGuidelinesTemplates: Array<Template>;
  /** The total number of CommunityGuidelinesTemplates in this TemplatesSet. */
  communityGuidelinesTemplatesCount: Scalars['Float']['output'];
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The Post Templates in this TemplatesSet. */
  postTemplates: Array<Template>;
  /** The total number of Post Templates in this TemplatesSet. */
  postTemplatesCount: Scalars['Float']['output'];
  /** The Space Templates in this TemplatesSet. */
  spaceTemplates: Array<Template>;
  /** The total number of Space Templates in this TemplatesSet. */
  spaceTemplatesCount: Scalars['Float']['output'];
  /** The Templates in this TemplatesSet. */
  templates: Array<Template>;
  /** The total number of Templates in this TemplatesSet. */
  templatesCount: Scalars['Float']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  /** The WhiteboardTemplates in this TemplatesSet. */
  whiteboardTemplates: Array<Template>;
  /** The total number of WhiteboardTemplates in this TemplatesSet. */
  whiteboardTemplatesCount: Scalars['Float']['output'];
};

export type Timeline = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The Innovation Library for the timeline */
  calendar: Calendar;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type TransferAccountInnovationHubInput = {
  /** The Innovation Hub to be transferred. */
  innovationHubID: Scalars['UUID']['input'];
  /** The Account to which the Innovation Hub will be transferred. */
  targetAccountID: Scalars['UUID']['input'];
};

export type TransferAccountInnovationPackInput = {
  /** The InnovationPack to be transferred. */
  innovationPackID: Scalars['UUID']['input'];
  /** The Account to which the Innovation Pack will be transferred. */
  targetAccountID: Scalars['UUID']['input'];
};

export type TransferAccountSpaceInput = {
  /** The Space to be transferred. */
  spaceID: Scalars['UUID']['input'];
  /** The Account to which the Space will be transferred. */
  targetAccountID: Scalars['UUID']['input'];
};

export type TransferAccountVirtualContributorInput = {
  /** The Account to which the Virtual Contributor will be transferred. */
  targetAccountID: Scalars['UUID']['input'];
  /** The Virtual Contributor to be transferred. */
  virtualContributorID: Scalars['UUID']['input'];
};

export type TransferCalloutInput = {
  /** The Callout to be transferred. */
  calloutID: Scalars['UUID']['input'];
  /** The target CalloutsSet to which the Callout will be transferred. */
  targetCalloutsSetID: Scalars['UUID']['input'];
};

export type UpdateAiPersonaInput = {
  ID: Scalars['UUID']['input'];
};

export type UpdateAiPersonaServiceInput = {
  ID: Scalars['UUID']['input'];
  bodyOfKnowledgeID?: InputMaybe<Scalars['UUID']['input']>;
  bodyOfKnowledgeType?: InputMaybe<AiPersonaBodyOfKnowledgeType>;
  engine?: InputMaybe<AiPersonaEngine>;
  externalConfig?: InputMaybe<ExternalConfigInput>;
  prompt?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateApplicationFormOnRoleSetInput = {
  formData: UpdateFormInput;
  roleSetID: Scalars['UUID']['input'];
};

export type UpdateCalendarEventInput = {
  ID: Scalars['UUID']['input'];
  /** The length of the event in days. */
  durationDays?: InputMaybe<Scalars['Float']['input']>;
  /** The length of the event in minutes. */
  durationMinutes: Scalars['Float']['input'];
  /** Flag to indicate if this event is for multiple days. */
  multipleDays: Scalars['Boolean']['input'];
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The Profile of this entity. */
  profileData?: InputMaybe<UpdateProfileInput>;
  /** The state date for the event. */
  startDate: Scalars['DateTime']['input'];
  type?: InputMaybe<CalendarEventType>;
  /** Is the event visible on the parent calendar. */
  visibleOnParentCalendar?: InputMaybe<Scalars['Boolean']['input']>;
  /** Flag to indicate if this event is for a whole day. */
  wholeDay: Scalars['Boolean']['input'];
};

export type UpdateCalloutContributionDefaultsInput = {
  /** The default title to use for new contributions. */
  defaultDisplayName?: InputMaybe<Scalars['String']['input']>;
  /** The default description to use for new Post contributions. */
  postDescription?: InputMaybe<Scalars['Markdown']['input']>;
  /** The default description to use for new Whiteboard contributions. */
  whiteboardContent?: InputMaybe<Scalars['WhiteboardContent']['input']>;
};

export type UpdateCalloutEntityInput = {
  ID: Scalars['UUID']['input'];
  classification?: InputMaybe<UpdateClassificationInput>;
  contributionDefaults?: InputMaybe<UpdateCalloutContributionDefaultsInput>;
  framing?: InputMaybe<UpdateCalloutFramingInput>;
  /** Set Group for this Callout. */
  groupName?: InputMaybe<Scalars['String']['input']>;
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  settings?: InputMaybe<UpdateCalloutSettingsInput>;
  /** The sort order to assign to this Callout. */
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateCalloutFramingInput = {
  link?: InputMaybe<UpdateLinkInput>;
  /** The new content to be used. */
  memoContent?: InputMaybe<Scalars['Markdown']['input']>;
  /** The Profile of the Template. */
  profile?: InputMaybe<UpdateProfileInput>;
  /** The type of additional content attached to the framing of the callout. */
  type?: InputMaybe<CalloutFramingType>;
  /** The new content to be used. */
  whiteboardContent?: InputMaybe<Scalars['WhiteboardContent']['input']>;
};

export type UpdateCalloutPublishInfoInput = {
  /** The identifier for the Callout whose publisher is to be updated. */
  calloutID: Scalars['UUID']['input'];
  /** The timestamp to set for the publishing of the Callout. */
  publishDate?: InputMaybe<Scalars['Float']['input']>;
  /** The identifier of the publisher of the Callout. */
  publisherID?: InputMaybe<Scalars['UUID']['input']>;
};

export type UpdateCalloutSettingsContributionInput = {
  /** Indicate who can add more contributions to the callout. */
  canAddContributions?: InputMaybe<CalloutAllowedContributors>;
  /** Can comment to contributions callout. */
  commentsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Can add contributions to the Callout. Allowed Contribution types is going to be readOnly, so this field can be used to enable or disable the contribution temporarily instead of setting allowedTypes to None. */
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateCalloutSettingsFramingInput = {
  /** Can comment to callout framing. */
  commentsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateCalloutSettingsInput = {
  contribution?: InputMaybe<UpdateCalloutSettingsContributionInput>;
  framing?: InputMaybe<UpdateCalloutSettingsFramingInput>;
  /** Visibility of the Callout. */
  visibility?: InputMaybe<CalloutVisibility>;
};

export type UpdateCalloutVisibilityInput = {
  /** The identifier for the Callout whose visibility is to be updated. */
  calloutID: Scalars['String']['input'];
  /** Send a notification on publishing. */
  sendNotification?: InputMaybe<Scalars['Boolean']['input']>;
  /** Visibility of the Callout. */
  visibility: CalloutVisibility;
};

export type UpdateCalloutsSortOrderInput = {
  /** The IDs of the callouts to update the sort order on */
  calloutIDs: Array<Scalars['UUID']['input']>;
  calloutsSetID: Scalars['UUID']['input'];
};

export type UpdateClassificationInput = {
  tagsets?: InputMaybe<Array<UpdateTagsetInput>>;
};

export type UpdateClassificationSelectTagsetValueInput = {
  classificationID: Scalars['UUID']['input'];
  selectedValue: Scalars['String']['input'];
  tagsetName: Scalars['String']['input'];
};

export type UpdateCollaborationFromSpaceTemplateInput = {
  /** Add the Callouts from the Collaboration Template */
  addCallouts?: InputMaybe<Scalars['Boolean']['input']>;
  /** ID of the Collaboration to be updated */
  collaborationID: Scalars['UUID']['input'];
  /** The Space Template whose Collaboration that will be used for updates to the target Collaboration */
  spaceTemplateID: Scalars['UUID']['input'];
};

export type UpdateCommunityGuidelinesEntityInput = {
  /** ID of the CommunityGuidelines */
  communityGuidelinesID: Scalars['UUID']['input'];
  /** The Profile for this community guidelines. */
  profile: UpdateProfileInput;
};

export type UpdateContributionCalloutsSortOrderInput = {
  calloutID: Scalars['UUID']['input'];
  /** The IDs of the contributions to update the sort order on */
  contributionIDs: Array<Scalars['UUID']['input']>;
};

export type UpdateDiscussionInput = {
  ID: Scalars['UUID']['input'];
  /** The category for the Discussion */
  category?: InputMaybe<ForumDiscussionCategory>;
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The Profile of this entity. */
  profileData?: InputMaybe<UpdateProfileInput>;
};

export type UpdateDocumentInput = {
  ID: Scalars['UUID']['input'];
  /** The display name for the Document. */
  displayName: Scalars['String']['input'];
  tagset?: InputMaybe<UpdateTagsetInput>;
};

export type UpdateFormInput = {
  description: Scalars['Markdown']['input'];
  questions: Array<UpdateFormQuestionInput>;
};

export type UpdateFormQuestionInput = {
  /** The explation text to clarify the question. */
  explanation: Scalars['String']['input'];
  /** The maxiumum length of the answer, in characters, up to a limit of 512. */
  maxLength: Scalars['Float']['input'];
  /** The question to be answered */
  question: Scalars['String']['input'];
  /** Whether an answer is required for this Question. */
  required: Scalars['Boolean']['input'];
  /** The sort order of this question in a wider set of questions. */
  sortOrder: Scalars['Float']['input'];
};

export type UpdateInnovationFlowCurrentStateInput = {
  /** ID of the Innovation Flow State to be selected as the current one. */
  currentStateID: Scalars['UUID']['input'];
  /** ID of the Innovation Flow */
  innovationFlowID: Scalars['UUID']['input'];
};

export type UpdateInnovationFlowInput = {
  /** ID of the Innovation Flow */
  innovationFlowID: Scalars['UUID']['input'];
  /** The Profile of this entity. */
  profileData?: InputMaybe<UpdateProfileInput>;
};

export type UpdateInnovationFlowStateInput = {
  /** The explanation text to clarify the State. */
  description?: InputMaybe<Scalars['Markdown']['input']>;
  /** The display name for the State */
  displayName: Scalars['String']['input'];
  /** ID of the Innovation Flow */
  innovationFlowStateID: Scalars['UUID']['input'];
  settings?: InputMaybe<UpdateInnovationFlowStateSettingsInput>;
};

export type UpdateInnovationFlowStateSettingsInput = {
  /** The flag to set. */
  allowNewCallouts: Scalars['Boolean']['input'];
};

export type UpdateInnovationFlowStatesSortOrderInput = {
  innovationFlowID: Scalars['UUID']['input'];
  /** The IDs of the states to update the sort order on */
  stateIDs: Array<Scalars['UUID']['input']>;
};

export type UpdateInnovationHubInput = {
  ID: Scalars['UUID']['input'];
  /** Flag to control the visibility of the InnovationHub in the platform store. */
  listedInStore?: InputMaybe<Scalars['Boolean']['input']>;
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The Profile of this entity. */
  profileData?: InputMaybe<UpdateProfileInput>;
  /** Visibility of the InnovationHub in searches. */
  searchVisibility?: InputMaybe<SearchVisibility>;
  /** A list of Spaces to include in this Innovation Hub. Only valid when type 'list' is used. */
  spaceListFilter?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** Spaces with which visibility this Innovation Hub will display. Only valid when type 'visibility' is used. */
  spaceVisibilityFilter?: InputMaybe<SpaceVisibility>;
};

export type UpdateInnovationPackInput = {
  ID: Scalars['UUID']['input'];
  /** Flag to control the visibility of the InnovationPack in the platform Library. */
  listedInStore?: InputMaybe<Scalars['Boolean']['input']>;
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The Profile of this entity. */
  profileData?: InputMaybe<UpdateProfileInput>;
  /** Visibility of the InnovationPack in searches. */
  searchVisibility?: InputMaybe<SearchVisibility>;
};

export type UpdateKnowledgeBaseInput = {
  /** The Profile of the Template. */
  profile?: InputMaybe<UpdateProfileInput>;
};

export type UpdateLicensePlanInput = {
  ID: Scalars['UUID']['input'];
  /** Assign this plan to all new Organization accounts */
  assignToNewOrganizationAccounts?: InputMaybe<Scalars['Boolean']['input']>;
  /** Assign this plan to all new User accounts */
  assignToNewUserAccounts?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is this plan enabled? */
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Is this plan free? */
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** The credential to represent this plan */
  licenseCredential?: InputMaybe<LicensingCredentialBasedCredentialType>;
  /** The price per month of this plan. */
  pricePerMonth?: InputMaybe<Scalars['Float']['input']>;
  /** Does this plan require contact support */
  requiresContactSupport?: InputMaybe<Scalars['Boolean']['input']>;
  /** Does this plan require a payment method? */
  requiresPaymentMethod?: InputMaybe<Scalars['Boolean']['input']>;
  /** The sorting order for this Plan. */
  sortOrder?: InputMaybe<Scalars['Float']['input']>;
  /** Is there a trial period enabled */
  trialEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateLinkInput = {
  ID: Scalars['UUID']['input'];
  /** The Profile of the Link. */
  profile?: InputMaybe<UpdateProfileInput>;
  uri?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLocationInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  stateOrProvince?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMemoEntityInput = {
  ID: Scalars['UUID']['input'];
  contentUpdatePolicy?: InputMaybe<ContentUpdatePolicy>;
  /** The Profile of this entity. */
  profile?: InputMaybe<UpdateProfileInput>;
};

export type UpdateNotificationStateInput = {
  /** The ID of the notification to update. */
  ID: Scalars['UUID']['input'];
  /** The new state of the notification. */
  state: InAppNotificationState;
};

export type UpdateOrganizationInput = {
  ID: Scalars['UUID']['input'];
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  legalEntityName?: InputMaybe<Scalars['String']['input']>;
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The Profile of this entity. */
  profileData?: InputMaybe<UpdateProfileInput>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationPlatformSettingsInput = {
  /** Upate the URL path for the Organization. */
  nameID: Scalars['NameID']['input'];
  /** The ID of the Organization to update. */
  organizationID: Scalars['UUID']['input'];
};

export type UpdateOrganizationSettingsEntityInput = {
  membership?: InputMaybe<UpdateOrganizationSettingsMembershipInput>;
  privacy?: InputMaybe<UpdateOrganizationSettingsPrivacyInput>;
};

export type UpdateOrganizationSettingsInput = {
  /** The identifier for the Organization whose settings are to be updated. */
  organizationID: Scalars['UUID']['input'];
  /** Update the settings for the Organization. */
  settings: UpdateOrganizationSettingsEntityInput;
};

export type UpdateOrganizationSettingsMembershipInput = {
  /** Allow Users with email addresses matching the domain of this Organization to join. */
  allowUsersMatchingDomainToJoin: Scalars['Boolean']['input'];
};

export type UpdateOrganizationSettingsPrivacyInput = {
  /** Allow contribution roles (membership, lead etc) in Spaces to be visible. */
  contributionRolesPubliclyVisible: Scalars['Boolean']['input'];
};

export type UpdatePlatformSettingsInput = {
  integration?: InputMaybe<UpdatePlatformSettingsIntegrationInput>;
};

export type UpdatePlatformSettingsIntegrationInput = {
  /** Update the list of allowed URLs for iFrames within Markdown content. */
  iframeAllowedUrls: Array<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  ID: Scalars['UUID']['input'];
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The Profile of this entity. */
  profileData?: InputMaybe<UpdateProfileInput>;
};

export type UpdateProfileDirectInput = {
  description?: InputMaybe<Scalars['Markdown']['input']>;
  /** The display name for the entity. */
  displayName?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<UpdateLocationInput>;
  profileID: Scalars['UUID']['input'];
  references?: InputMaybe<Array<UpdateReferenceInput>>;
  /** A memorable short description for this entity. */
  tagline?: InputMaybe<Scalars['String']['input']>;
  tagsets?: InputMaybe<Array<UpdateTagsetInput>>;
};

export type UpdateProfileInput = {
  description?: InputMaybe<Scalars['Markdown']['input']>;
  /** The display name for the entity. */
  displayName?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<UpdateLocationInput>;
  references?: InputMaybe<Array<UpdateReferenceInput>>;
  /** A memorable short description for this entity. */
  tagline?: InputMaybe<Scalars['String']['input']>;
  tagsets?: InputMaybe<Array<UpdateTagsetInput>>;
};

export type UpdateReferenceInput = {
  ID: Scalars['UUID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uri?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSpaceAboutInput = {
  /** The Profile of this Space. */
  profile?: InputMaybe<UpdateProfileInput>;
  who?: InputMaybe<Scalars['Markdown']['input']>;
  why?: InputMaybe<Scalars['Markdown']['input']>;
};

export type UpdateSpaceInput = {
  ID: Scalars['UUID']['input'];
  /** Update the Space About information. */
  about?: InputMaybe<UpdateSpaceAboutInput>;
};

export type UpdateSpacePlatformSettingsInput = {
  /** Upate the URL path for the Space. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The identifier for the Space whose license etc is to be updated. */
  spaceID: Scalars['UUID']['input'];
  /** Visibility of the Space, only on L0 spaces. */
  visibility?: InputMaybe<SpaceVisibility>;
};

export type UpdateSpaceSettingsCollaborationInput = {
  /** Flag to control if events from Subspaces are visible on this Space calendar as well. */
  allowEventsFromSubspaces: Scalars['Boolean']['input'];
  /** Flag to control if members can create callouts. */
  allowMembersToCreateCallouts: Scalars['Boolean']['input'];
  /** Flag to control if members can create subspaces. */
  allowMembersToCreateSubspaces: Scalars['Boolean']['input'];
  /** Flag to control if ability to contribute is inherited from parent Space. */
  inheritMembershipRights: Scalars['Boolean']['input'];
};

export type UpdateSpaceSettingsEntityInput = {
  collaboration?: InputMaybe<UpdateSpaceSettingsCollaborationInput>;
  membership?: InputMaybe<UpdateSpaceSettingsMembershipInput>;
  privacy?: InputMaybe<UpdateSpaceSettingsPrivacyInput>;
};

export type UpdateSpaceSettingsInput = {
  /** Update the settings for the Space. */
  settings: UpdateSpaceSettingsEntityInput;
  /** The identifier for the Space whose settings are to be updated. */
  spaceID: Scalars['String']['input'];
};

export type UpdateSpaceSettingsMembershipInput = {
  /** Flag to control if Subspace admins can invite for this Space. */
  allowSubspaceAdminsToInviteMembers: Scalars['Boolean']['input'];
  /** The membership policy in usage for this Space */
  policy: CommunityMembershipPolicy;
  /** The organizations that are trusted to Join as members for this Space */
  trustedOrganizations: Array<Scalars['UUID']['input']>;
};

export type UpdateSpaceSettingsPrivacyInput = {
  /** Flag to control if Platform Support has admin rights. */
  allowPlatformSupportAsAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  mode?: InputMaybe<SpacePrivacyMode>;
};

export type UpdateTagsetInput = {
  ID: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  tags: Array<Scalars['String']['input']>;
};

export type UpdateTemplateContentSpaceInput = {
  ID: Scalars['UUID']['input'];
  /** Update the TemplateContentSpace About information. */
  about?: InputMaybe<UpdateSpaceAboutInput>;
  /** Update the settings for the Space. */
  settings: UpdateSpaceSettingsEntityInput;
};

export type UpdateTemplateDefaultTemplateInput = {
  /** The identifier for the TemplateDefault to be updated. */
  templateDefaultID: Scalars['UUID']['input'];
  /** The ID for the Template to use. */
  templateID: Scalars['UUID']['input'];
};

export type UpdateTemplateFromSpaceInput = {
  /** Whether to reproduce the hierarchy or just the space. */
  recursive?: InputMaybe<Scalars['Boolean']['input']>;
  /** The Space whose content should be copied to this Template. */
  spaceID: Scalars['UUID']['input'];
  /** The ID of the Template. */
  templateID: Scalars['UUID']['input'];
};

export type UpdateTemplateInput = {
  ID: Scalars['UUID']['input'];
  /** The default description to be pre-filled when users create Posts based on this template. */
  postDefaultDescription?: InputMaybe<Scalars['Markdown']['input']>;
  /** The Profile of the Template. */
  profile?: InputMaybe<UpdateProfileInput>;
  /** The new content to be used. */
  whiteboardContent?: InputMaybe<Scalars['WhiteboardContent']['input']>;
};

export type UpdateUserGroupInput = {
  ID: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  profileData?: InputMaybe<UpdateProfileInput>;
};

export type UpdateUserInput = {
  ID: Scalars['UUID']['input'];
  accountUpn?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  /** The Profile of this entity. */
  profileData?: InputMaybe<UpdateProfileInput>;
  /** Set this user profile as being used as a service account or not. */
  serviceProfile?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateUserPlatformSettingsInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  /** Upate the URL path for the User. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The identifier for the User whose platform managed information is to be updated. */
  userID: Scalars['String']['input'];
};

export type UpdateUserSettingsCommunicationInput = {
  /** Allow Users to send messages to this User. */
  allowOtherUsersToSendMessages?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateUserSettingsEntityInput = {
  /** Settings related to this users Communication preferences. */
  communication?: InputMaybe<UpdateUserSettingsCommunicationInput>;
  /** Settings related to this users Notifications preferences. */
  notification?: InputMaybe<UpdateUserSettingsNotificationInput>;
  /** Settings related to Privacy. */
  privacy?: InputMaybe<UpdateUserSettingsPrivacyInput>;
};

export type UpdateUserSettingsInput = {
  /** Update the settings for the User. */
  settings: UpdateUserSettingsEntityInput;
  /** The identifier for the User whose settings are to be updated. */
  userID: Scalars['UUID']['input'];
};

export type UpdateUserSettingsNotificationInput = {
  /** Settings related to Organization Notifications. */
  organization?: InputMaybe<UpdateUserSettingsNotificationOrganizationInput>;
  /** Settings related to Platform Notifications. */
  platform?: InputMaybe<UpdateUserSettingsNotificationPlatformInput>;
  /** Settings related to Space Notifications. */
  space?: InputMaybe<UpdateUserSettingsNotificationSpaceInput>;
  /** Settings related to User Notifications. */
  user?: InputMaybe<UpdateUserSettingsNotificationUserInput>;
};

export type UpdateUserSettingsNotificationOrganizationInput = {
  /** Receive a notification when the organization you are admin of is mentioned */
  mentioned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive notification when the organization you are admin of is messaged */
  messageReceived?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateUserSettingsNotificationPlatformInput = {
  /** Receive a notification when a new comment is added to a Discussion I created in the Forum */
  forumDiscussionComment?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when a new Discussion is created in the Forum */
  forumDiscussionCreated?: InputMaybe<Scalars['Boolean']['input']>;
  /** [Admin] Receive notification when a new user signs up */
  newUserSignUp?: InputMaybe<Scalars['Boolean']['input']>;
  /** [Admin] Receive a notification when a new L0 Space is created */
  spaceCreated?: InputMaybe<Scalars['Boolean']['input']>;
  /** [Admin] Receive a notification when a user profile is removed */
  userProfileRemoved?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateUserSettingsNotificationSpaceInput = {
  /** Receive a notification when an application is received */
  applicationReceived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when an application is submitted */
  applicationSubmitted?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when a callout is published */
  calloutPublished?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when someone replies to your comment */
  commentReply?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when mentioned in communication */
  communicationMention?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification for community updates */
  communicationUpdates?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification for community updates as admin */
  communicationUpdatesAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification for community invitation */
  communityInvitationUser?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when a new member joins the community */
  communityNewMember?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when a new member joins the community (admin) */
  communityNewMemberAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when a comment is created on a post */
  postCommentCreated?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when a post is created */
  postCreated?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when a post is created (admin) */
  postCreatedAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification when a whiteboard is created */
  whiteboardCreated?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateUserSettingsNotificationUserInput = {
  /** Receive a notification when someone replies to a comment I made. */
  commentReply?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive a notification you are mentioned */
  mentioned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive notification when I receive a message. */
  messageReceived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Receive notification I send a message. */
  messageSent?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateUserSettingsPrivacyInput = {
  /** Allow contribution roles (communication, lead etc) in Spaces to be visible. */
  contributionRolesPubliclyVisible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateVirtualContributorInput = {
  ID: Scalars['UUID']['input'];
  /** The KnowledgeBase to use for this Collaboration. */
  knowledgeBaseData?: InputMaybe<UpdateKnowledgeBaseInput>;
  /** Flag to control the visibility of the VC in the platform store. */
  listedInStore?: InputMaybe<Scalars['Boolean']['input']>;
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The Profile of this entity. */
  profileData?: InputMaybe<UpdateProfileInput>;
  /** Visibility of the VC in searches. */
  searchVisibility?: InputMaybe<SearchVisibility>;
};

export type UpdateVirtualContributorSettingsEntityInput = {
  privacy?: InputMaybe<UpdateVirtualContributorSettingsPrivacyInput>;
};

export type UpdateVirtualContributorSettingsInput = {
  /** Update the settings for the VirtualContributor. */
  settings: UpdateVirtualContributorSettingsEntityInput;
  /** The identifier for the VirtualCOntributor whose settings are to be updated. */
  virtualContributorID: Scalars['UUID']['input'];
};

export type UpdateVirtualContributorSettingsPrivacyInput = {
  /** Enable the content of knowledge bases to be accessed or not. */
  knowledgeBaseContentVisible: Scalars['Boolean']['input'];
};

export type UpdateVisualInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  uri: Scalars['String']['input'];
  visualID: Scalars['String']['input'];
};

export type UpdateWhiteboardEntityInput = {
  ID: Scalars['UUID']['input'];
  contentUpdatePolicy?: InputMaybe<ContentUpdatePolicy>;
  /** A display identifier, unique within the containing scope. Note: updating the nameID will affect URL on the client. */
  nameID?: InputMaybe<Scalars['NameID']['input']>;
  /** The Profile of this entity. */
  profile?: InputMaybe<UpdateProfileInput>;
};

export type UrlResolverQueryResultCalendar = {
  calendarEventId?: Maybe<Scalars['UUID']['output']>;
  id: Scalars['UUID']['output'];
};

export type UrlResolverQueryResultCalloutsSet = {
  calloutId?: Maybe<Scalars['UUID']['output']>;
  contributionId?: Maybe<Scalars['UUID']['output']>;
  id: Scalars['UUID']['output'];
  postId?: Maybe<Scalars['UUID']['output']>;
  type: UrlType;
  whiteboardId?: Maybe<Scalars['UUID']['output']>;
};

export type UrlResolverQueryResultCollaboration = {
  calloutsSet: UrlResolverQueryResultCalloutsSet;
  id: Scalars['UUID']['output'];
};

export type UrlResolverQueryResultInnovationPack = {
  id: Scalars['UUID']['output'];
  templatesSet: UrlResolverQueryResultTemplatesSet;
};

export type UrlResolverQueryResultSpace = {
  calendar?: Maybe<UrlResolverQueryResultCalendar>;
  collaboration: UrlResolverQueryResultCollaboration;
  id: Scalars['UUID']['output'];
  level: SpaceLevel;
  levelZeroSpaceID: Scalars['UUID']['output'];
  parentSpaces: Array<Scalars['UUID']['output']>;
  templatesSet?: Maybe<UrlResolverQueryResultTemplatesSet>;
};

export type UrlResolverQueryResultTemplatesSet = {
  id: Scalars['UUID']['output'];
  templateId?: Maybe<Scalars['UUID']['output']>;
};

export type UrlResolverQueryResultVirtualContributor = {
  calloutsSet: UrlResolverQueryResultCalloutsSet;
  id: Scalars['UUID']['output'];
};

export type UrlResolverQueryResults = {
  discussionId?: Maybe<Scalars['UUID']['output']>;
  innovationHubId?: Maybe<Scalars['UUID']['output']>;
  innovationPack?: Maybe<UrlResolverQueryResultInnovationPack>;
  organizationId?: Maybe<Scalars['UUID']['output']>;
  space?: Maybe<UrlResolverQueryResultSpace>;
  type: UrlType;
  userId?: Maybe<Scalars['UUID']['output']>;
  virtualContributor?: Maybe<UrlResolverQueryResultVirtualContributor>;
};

export enum UrlType {
  Admin = 'ADMIN',
  Callout = 'CALLOUT',
  CalloutsSet = 'CALLOUTS_SET',
  ContributionPost = 'CONTRIBUTION_POST',
  ContributionWhiteboard = 'CONTRIBUTION_WHITEBOARD',
  ContributorsExplorer = 'CONTRIBUTORS_EXPLORER',
  Discussion = 'DISCUSSION',
  Documentation = 'DOCUMENTATION',
  Error = 'ERROR',
  Flow = 'FLOW',
  Forum = 'FORUM',
  Home = 'HOME',
  InnovationHub = 'INNOVATION_HUB',
  InnovationLibrary = 'INNOVATION_LIBRARY',
  InnovationPacks = 'INNOVATION_PACKS',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  NotAuthorized = 'NOT_AUTHORIZED',
  Organization = 'ORGANIZATION',
  Recovery = 'RECOVERY',
  Registration = 'REGISTRATION',
  Required = 'REQUIRED',
  Restricted = 'RESTRICTED',
  SignUp = 'SIGN_UP',
  Space = 'SPACE',
  SpaceExplorer = 'SPACE_EXPLORER',
  Unknown = 'UNKNOWN',
  User = 'USER',
  Verify = 'VERIFY',
  VirtualContributor = 'VIRTUAL_CONTRIBUTOR',
}

export type User = Contributor & {
  /** The account hosted by this User. */
  account?: Maybe<Account>;
  /** The unique personal identifier (upn) for the account associated with this user profile */
  accountUpn: Scalars['String']['output'];
  /** The Agent representing this User. */
  agent: Agent;
  /** Details about the authentication used for this User. */
  authentication?: Maybe<UserAuthenticationResult>;
  /** The authorization rules for the Contributor */
  authorization?: Maybe<Authorization>;
  /** The Community rooms this user is a member of */
  communityRooms?: Maybe<Array<CommunicationRoom>>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The direct rooms this user is a member of */
  directRooms?: Maybe<Array<DirectRoom>>;
  /** The email address for this User. */
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  /** Guidance Chat Room for this user */
  guidanceRoom?: Maybe<Room>;
  /** The ID of the Contributor */
  id: Scalars['UUID']['output'];
  /** Can a message be sent to this User. */
  isContactable: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  /** A name identifier of the Contributor, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The phone number for this User. */
  phone?: Maybe<Scalars['String']['output']>;
  /** The Profile for this User. */
  profile: Profile;
  /** The settings for this User. */
  settings: UserSettings;
  /** The StorageAggregator for managing storage buckets in use by this User */
  storageAggregator?: Maybe<StorageAggregator>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type UserAuthenticationResult = {
  /** When the Kratos Account for the user last logged in */
  authenticatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** When the Kratos Account for the user was created */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** The Authentication Method used for this User. One of email, linkedin, microsoft, or unknown */
  method: AuthenticationType;
};

export type UserAuthorizationPrivilegesInput = {
  /** The authorization definition to evaluate the user credentials against. */
  authorizationID: Scalars['UUID']['input'];
  /** The user to evaluate privileges granted based on held credentials. */
  userID: Scalars['UUID']['input'];
};

export type UserAuthorizationResetInput = {
  /** The identifier of the User whose Authorization Policy should be reset. */
  userID: Scalars['UUID']['input'];
};

export type UserFilterInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UserGroup = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The Users that are members of this User Group. */
  members?: Maybe<Array<User>>;
  /** Containing entity for this UserGroup. */
  parent?: Maybe<Groupable>;
  /** The profile for the user group */
  profile?: Maybe<Profile>;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type UserSendMessageInput = {
  /** The message being sent */
  message: Scalars['String']['input'];
  /** The user a message is being sent to */
  receivingUserID: Scalars['String']['input'];
};

export type UserSettings = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The communication settings for this User. */
  communication: UserSettingsCommunication;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** The notification settings for this User. */
  notification: UserSettingsNotification;
  /** The privacy settings for this User */
  privacy: UserSettingsPrivacy;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type UserSettingsCommunication = {
  /** Allow Users to send messages to this User. */
  allowOtherUsersToSendMessages: Scalars['Boolean']['output'];
};

export type UserSettingsNotification = {
  /** The notifications settings for Organization events for this User */
  organization: UserSettingsNotificationOrganization;
  /** The notifications settings for Platform events for this User */
  platform: UserSettingsNotificationPlatform;
  /** The notifications settings for Space events for this User */
  space: UserSettingsNotificationSpace;
  /** The notifications settings for User events for this User */
  user: UserSettingsNotificationUser;
};

export type UserSettingsNotificationOrganization = {
  /** Receive a notification when the organization you are admin of is mentioned */
  mentioned: Scalars['Boolean']['output'];
  /** Receive notification when the organization you are admin of is messaged */
  messageReceived: Scalars['Boolean']['output'];
};

export type UserSettingsNotificationPlatform = {
  /** Receive a notification when a new comment is added to a Discussion I created in the Forum */
  forumDiscussionComment: Scalars['Boolean']['output'];
  /** Receive a notification when a new Discussion is created in the Forum */
  forumDiscussionCreated: Scalars['Boolean']['output'];
  /** Receive notification when a new user signs up */
  newUserSignUp: Scalars['Boolean']['output'];
  /** Receive a notification when a new L0 Space is created */
  spaceCreated: Scalars['Boolean']['output'];
  /** Receive a notification when a user profile is removed */
  userProfileRemoved: Scalars['Boolean']['output'];
};

export type UserSettingsNotificationSpace = {
  /** Receive a notification when an application is received */
  applicationReceived: Scalars['Boolean']['output'];
  /** Receive a notification when an application is submitted */
  applicationSubmitted: Scalars['Boolean']['output'];
  /** Receive a notification when a callout is published */
  calloutPublished: Scalars['Boolean']['output'];
  /** Receive a notification when someone replies to your comment */
  commentReply: Scalars['Boolean']['output'];
  /** Receive a notification when mentioned in communication */
  communicationMention: Scalars['Boolean']['output'];
  /** Receive a notification for community updates */
  communicationUpdates: Scalars['Boolean']['output'];
  /** Receive a notification for community updates as Admin */
  communicationUpdatesAdmin: Scalars['Boolean']['output'];
  /** Receive a notification for community invitation */
  communityInvitationUser: Scalars['Boolean']['output'];
  /** Receive a notification when a new member joins the community */
  communityNewMember: Scalars['Boolean']['output'];
  /** Receive a notification when a new member joins the community (admin) */
  communityNewMemberAdmin: Scalars['Boolean']['output'];
  /** Receive a notification when a comment is created on a post */
  postCommentCreated: Scalars['Boolean']['output'];
  /** Receive a notification when a post is created */
  postCreated: Scalars['Boolean']['output'];
  /** Receive a notification when a post is created (admin) */
  postCreatedAdmin: Scalars['Boolean']['output'];
  /** Receive a notification when a whiteboard is created */
  whiteboardCreated: Scalars['Boolean']['output'];
};

export type UserSettingsNotificationUser = {
  /** Receive a notification when someone replies to a comment I made. */
  commentReply: Scalars['Boolean']['output'];
  /** Receive a notification you are mentioned */
  mentioned: Scalars['Boolean']['output'];
  /** Receive notification when I receive a message. */
  messageReceived: Scalars['Boolean']['output'];
  /** Receive notification I send a message. */
  messageSent: Scalars['Boolean']['output'];
};

export type UserSettingsPrivacy = {
  /** Allow contribution roles (communication, lead etc) in Spaces to be visible. */
  contributionRolesPubliclyVisible: Scalars['Boolean']['output'];
};

export type UsersInRolesResponse = {
  role: RoleName;
  users: Array<User>;
};

export type UsersWithAuthorizationCredentialInput = {
  /** The resource to which a credential needs to be bound. */
  resourceID?: InputMaybe<Scalars['UUID']['input']>;
  /** The type of credential. */
  type: AuthorizationCredential;
};

export type VcInteraction = {
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  room: Room;
  threadID: Scalars['String']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  virtualContributorID: Scalars['UUID']['output'];
};

export type VerifiedCredential = {
  /** The time at which the credential is no longer valid */
  claims: Array<VerifiedCredentialClaim>;
  /** JSON for the context in the credential */
  context: Scalars['JSON']['output'];
  /** The time at which the credential is no longer valid */
  expires: Scalars['String']['output'];
  /** The time at which the credential was issued */
  issued: Scalars['String']['output'];
  /** The party issuing the VC */
  issuer: Scalars['String']['output'];
  /** The name of the VC */
  name: Scalars['String']['output'];
  /** The type of VC */
  type: Scalars['String']['output'];
};

export type VerifiedCredentialClaim = {
  /** The name of the claim */
  name: Scalars['JSON']['output'];
  /** The value for the claim */
  value: Scalars['JSON']['output'];
};

export type VirtualContributor = Contributor & {
  /** The Account of the Virtual Contributor. */
  account?: Maybe<Account>;
  /** The Agent representing this User. */
  agent: Agent;
  /** The AI persona being used by this virtual contributor */
  aiPersona?: Maybe<AiPersona>;
  /** The authorization rules for the Contributor */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the Contributor */
  id: Scalars['UUID']['output'];
  /** The KnowledgeBase being used by this virtual contributor */
  knowledgeBase?: Maybe<KnowledgeBase>;
  /** Flag to control if this VC is listed in the platform store. */
  listedInStore: Scalars['Boolean']['output'];
  /** A name identifier of the Contributor, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The profile for this Virtual. */
  profile: Profile;
  /** The Virtual Contributor provider. */
  provider: Contributor;
  /** Visibility of the VC in searches. */
  searchVisibility: SearchVisibility;
  /** The settings of this Virtual Contributor. */
  settings: VirtualContributorSettings;
  /** The status of the virtual contributor */
  status: VirtualContributorStatus;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type VirtualContributorSettings = {
  /** The privacy settings for this VirtualContributor */
  privacy: VirtualContributorSettingsPrivacy;
};

export type VirtualContributorSettingsPrivacy = {
  /** Are the contents of the knowledge base publicly visible. */
  knowledgeBaseContentVisible: Scalars['Boolean']['output'];
};

export enum VirtualContributorStatus {
  Initializing = 'INITIALIZING',
  Ready = 'READY',
}

/** The result from a Virtual Contributor update */
export type VirtualContributorUpdatedSubscriptionResult = {
  /** The Virtual Contributor that was updated */
  virtualContributor: VirtualContributor;
};

export type VirtualContributorsInRolesResponse = {
  role: RoleName;
  virtualContributors: Array<VirtualContributor>;
};

export type Visual = {
  allowedTypes: Array<Scalars['String']['output']>;
  alternativeText?: Maybe<Scalars['String']['output']>;
  /** Post ratio width / height. */
  aspectRatio: Scalars['Float']['output'];
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Maximum height resolution. */
  maxHeight: Scalars['Float']['output'];
  /** Maximum width resolution. */
  maxWidth: Scalars['Float']['output'];
  /** Minimum height resolution. */
  minHeight: Scalars['Float']['output'];
  /** Minimum width resolution. */
  minWidth: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
  uri: Scalars['String']['output'];
};

export type VisualConstraints = {
  /** Allowed file types. */
  allowedTypes: Array<Scalars['String']['output']>;
  /** Dimensions ratio width / height. */
  aspectRatio: Scalars['Float']['output'];
  /** Maximum height resolution. */
  maxHeight: Scalars['Float']['output'];
  /** Maximum width resolution. */
  maxWidth: Scalars['Float']['output'];
  /** Minimum height resolution. */
  minHeight: Scalars['Float']['output'];
  /** Minimum width resolution. */
  minWidth: Scalars['Float']['output'];
};

export enum VisualType {
  Avatar = 'AVATAR',
  Banner = 'BANNER',
  BannerWide = 'BANNER_WIDE',
  Card = 'CARD',
}

export type VisualUploadImageInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  visualID: Scalars['String']['input'];
};

export type Whiteboard = {
  /** The authorization rules for the entity */
  authorization?: Maybe<Authorization>;
  /** The visual content of the Whiteboard. */
  content: Scalars['WhiteboardContent']['output'];
  /** The policy governing who can update the Whiteboard content. */
  contentUpdatePolicy: ContentUpdatePolicy;
  /** The user that created this Whiteboard */
  createdBy?: Maybe<User>;
  /** The date at which the entity was created. */
  createdDate: Scalars['DateTime']['output'];
  /** The ID of the entity */
  id: Scalars['UUID']['output'];
  /** Whether the Whiteboard is multi-user enabled on Space level. */
  isMultiUser: Scalars['Boolean']['output'];
  /** A name identifier of the entity, unique within a given scope. */
  nameID: Scalars['NameID']['output'];
  /** The Profile for this Whiteboard. */
  profile: Profile;
  /** The date at which the entity was last updated. */
  updatedDate: Scalars['DateTime']['output'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  AuthenticationProviderConfigUnion: OryConfig;
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> =
  {
    ActivityLogEntry:
      | (Omit<
          ActivityLogEntryCalendarEventCreated,
          'calendar' | 'calendarEvent' | 'space' | 'triggeredBy'
        > & {
          calendar: _RefType['Calendar'];
          calendarEvent: _RefType['CalendarEvent'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
        })
      | (Omit<
          ActivityLogEntryCalloutDiscussionComment,
          'callout' | 'space' | 'triggeredBy'
        > & {
          callout: _RefType['Callout'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
        })
      | (Omit<
          ActivityLogEntryCalloutLinkCreated,
          'callout' | 'link' | 'space' | 'triggeredBy'
        > & {
          callout: _RefType['Callout'];
          link: _RefType['Link'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
        })
      | (Omit<
          ActivityLogEntryCalloutPostComment,
          'callout' | 'post' | 'space' | 'triggeredBy'
        > & {
          callout: _RefType['Callout'];
          post: _RefType['Post'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
        })
      | (Omit<
          ActivityLogEntryCalloutPostCreated,
          'callout' | 'post' | 'space' | 'triggeredBy'
        > & {
          callout: _RefType['Callout'];
          post: _RefType['Post'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
        })
      | (Omit<
          ActivityLogEntryCalloutPublished,
          'callout' | 'space' | 'triggeredBy'
        > & {
          callout: _RefType['Callout'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
        })
      | (Omit<
          ActivityLogEntryCalloutWhiteboardContentModified,
          'callout' | 'space' | 'triggeredBy' | 'whiteboard'
        > & {
          callout: _RefType['Callout'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
          whiteboard: _RefType['Whiteboard'];
        })
      | (Omit<
          ActivityLogEntryCalloutWhiteboardCreated,
          'callout' | 'space' | 'triggeredBy' | 'whiteboard'
        > & {
          callout: _RefType['Callout'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
          whiteboard: _RefType['Whiteboard'];
        })
      | (Omit<
          ActivityLogEntryMemberJoined,
          'community' | 'contributor' | 'space' | 'triggeredBy'
        > & {
          community: _RefType['Community'];
          contributor: _RefType['Contributor'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
        })
      | (Omit<
          ActivityLogEntrySubspaceCreated,
          'space' | 'subspace' | 'triggeredBy'
        > & {
          space?: Maybe<_RefType['Space']>;
          subspace: _RefType['Space'];
          triggeredBy: _RefType['User'];
        })
      | (Omit<
          ActivityLogEntryUpdateSent,
          'space' | 'triggeredBy' | 'updates'
        > & {
          space?: Maybe<_RefType['Space']>;
          triggeredBy: _RefType['User'];
          updates: _RefType['Room'];
        });
    Contributor:
      | (Omit<
          Organization,
          'account' | 'group' | 'groups' | 'profile' | 'roleSet'
        > & {
          account?: Maybe<_RefType['Account']>;
          group?: Maybe<_RefType['UserGroup']>;
          groups?: Maybe<Array<_RefType['UserGroup']>>;
          profile: _RefType['Profile'];
          roleSet: _RefType['RoleSet'];
        })
      | (Omit<
          User,
          | 'account'
          | 'communityRooms'
          | 'directRooms'
          | 'guidanceRoom'
          | 'profile'
        > & {
          account?: Maybe<_RefType['Account']>;
          communityRooms?: Maybe<Array<_RefType['CommunicationRoom']>>;
          directRooms?: Maybe<Array<_RefType['DirectRoom']>>;
          guidanceRoom?: Maybe<_RefType['Room']>;
          profile: _RefType['Profile'];
        })
      | (Omit<
          VirtualContributor,
          'account' | 'knowledgeBase' | 'profile' | 'provider'
        > & {
          account?: Maybe<_RefType['Account']>;
          knowledgeBase?: Maybe<_RefType['KnowledgeBase']>;
          profile: _RefType['Profile'];
          provider: _RefType['Contributor'];
        });
    Groupable:
      | (Omit<Community, 'communication' | 'group' | 'groups' | 'roleSet'> & {
          communication: _RefType['Communication'];
          group: _RefType['UserGroup'];
          groups: Array<_RefType['UserGroup']>;
          roleSet: _RefType['RoleSet'];
        })
      | (Omit<
          Organization,
          'account' | 'group' | 'groups' | 'profile' | 'roleSet'
        > & {
          account?: Maybe<_RefType['Account']>;
          group?: Maybe<_RefType['UserGroup']>;
          groups?: Maybe<Array<_RefType['UserGroup']>>;
          profile: _RefType['Profile'];
          roleSet: _RefType['RoleSet'];
        });
    InAppNotification:
      | (Omit<
          InAppNotificationCalloutPublished,
          'callout' | 'receiver' | 'space' | 'triggeredBy'
        > & {
          callout?: Maybe<_RefType['Callout']>;
          receiver: _RefType['Contributor'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy?: Maybe<_RefType['Contributor']>;
        })
      | (Omit<
          InAppNotificationCommunityNewMember,
          'actor' | 'receiver' | 'space' | 'triggeredBy'
        > & {
          actor?: Maybe<_RefType['Contributor']>;
          receiver: _RefType['Contributor'];
          space?: Maybe<_RefType['Space']>;
          triggeredBy?: Maybe<_RefType['Contributor']>;
        })
      | (Omit<InAppNotificationUserMentioned, 'receiver' | 'triggeredBy'> & {
          receiver: _RefType['Contributor'];
          triggeredBy?: Maybe<_RefType['Contributor']>;
        });
    SearchResult:
      | (Omit<SearchResultCallout, 'callout' | 'space'> & {
          callout: _RefType['Callout'];
          space: _RefType['Space'];
        })
      | (Omit<SearchResultOrganization, 'organization'> & {
          organization: _RefType['Organization'];
        })
      | (Omit<SearchResultPost, 'callout' | 'post' | 'space'> & {
          callout: _RefType['Callout'];
          post: _RefType['Post'];
          space: _RefType['Space'];
        })
      | (Omit<SearchResultSpace, 'parentSpace' | 'space'> & {
          parentSpace?: Maybe<_RefType['Space']>;
          space: _RefType['Space'];
        })
      | (Omit<SearchResultUser, 'user'> & { user: _RefType['User'] });
  };

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  APM: ResolverTypeWrapper<Apm>;
  Account: ResolverTypeWrapper<
    Omit<
      Account,
      | 'host'
      | 'innovationHubs'
      | 'innovationPacks'
      | 'spaces'
      | 'virtualContributors'
    > & {
      host?: Maybe<ResolversTypes['Contributor']>;
      innovationHubs: Array<ResolversTypes['InnovationHub']>;
      innovationPacks: Array<ResolversTypes['InnovationPack']>;
      spaces: Array<ResolversTypes['Space']>;
      virtualContributors: Array<ResolversTypes['VirtualContributor']>;
    }
  >;
  AccountAuthorizationResetInput: AccountAuthorizationResetInput;
  AccountLicenseResetInput: AccountLicenseResetInput;
  AccountSubscription: ResolverTypeWrapper<AccountSubscription>;
  AccountType: AccountType;
  ActivityCreatedSubscriptionInput: ActivityCreatedSubscriptionInput;
  ActivityCreatedSubscriptionResult: ResolverTypeWrapper<
    Omit<ActivityCreatedSubscriptionResult, 'activity'> & {
      activity: ResolversTypes['ActivityLogEntry'];
    }
  >;
  ActivityEventType: ActivityEventType;
  ActivityFeed: ResolverTypeWrapper<
    Omit<ActivityFeed, 'activityFeed' | 'pageInfo'> & {
      activityFeed: Array<ResolversTypes['ActivityLogEntry']>;
      pageInfo: ResolversTypes['PageInfo'];
    }
  >;
  ActivityFeedGroupedQueryArgs: ActivityFeedGroupedQueryArgs;
  ActivityFeedQueryArgs: ActivityFeedQueryArgs;
  ActivityFeedRoles: ActivityFeedRoles;
  ActivityLogEntry: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>['ActivityLogEntry']
  >;
  ActivityLogEntryCalendarEventCreated: ResolverTypeWrapper<
    Omit<
      ActivityLogEntryCalendarEventCreated,
      'calendar' | 'calendarEvent' | 'space' | 'triggeredBy'
    > & {
      calendar: ResolversTypes['Calendar'];
      calendarEvent: ResolversTypes['CalendarEvent'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
    }
  >;
  ActivityLogEntryCalloutDiscussionComment: ResolverTypeWrapper<
    Omit<
      ActivityLogEntryCalloutDiscussionComment,
      'callout' | 'space' | 'triggeredBy'
    > & {
      callout: ResolversTypes['Callout'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
    }
  >;
  ActivityLogEntryCalloutLinkCreated: ResolverTypeWrapper<
    Omit<
      ActivityLogEntryCalloutLinkCreated,
      'callout' | 'link' | 'space' | 'triggeredBy'
    > & {
      callout: ResolversTypes['Callout'];
      link: ResolversTypes['Link'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
    }
  >;
  ActivityLogEntryCalloutPostComment: ResolverTypeWrapper<
    Omit<
      ActivityLogEntryCalloutPostComment,
      'callout' | 'post' | 'space' | 'triggeredBy'
    > & {
      callout: ResolversTypes['Callout'];
      post: ResolversTypes['Post'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
    }
  >;
  ActivityLogEntryCalloutPostCreated: ResolverTypeWrapper<
    Omit<
      ActivityLogEntryCalloutPostCreated,
      'callout' | 'post' | 'space' | 'triggeredBy'
    > & {
      callout: ResolversTypes['Callout'];
      post: ResolversTypes['Post'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
    }
  >;
  ActivityLogEntryCalloutPublished: ResolverTypeWrapper<
    Omit<
      ActivityLogEntryCalloutPublished,
      'callout' | 'space' | 'triggeredBy'
    > & {
      callout: ResolversTypes['Callout'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
    }
  >;
  ActivityLogEntryCalloutWhiteboardContentModified: ResolverTypeWrapper<
    Omit<
      ActivityLogEntryCalloutWhiteboardContentModified,
      'callout' | 'space' | 'triggeredBy' | 'whiteboard'
    > & {
      callout: ResolversTypes['Callout'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
      whiteboard: ResolversTypes['Whiteboard'];
    }
  >;
  ActivityLogEntryCalloutWhiteboardCreated: ResolverTypeWrapper<
    Omit<
      ActivityLogEntryCalloutWhiteboardCreated,
      'callout' | 'space' | 'triggeredBy' | 'whiteboard'
    > & {
      callout: ResolversTypes['Callout'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
      whiteboard: ResolversTypes['Whiteboard'];
    }
  >;
  ActivityLogEntryMemberJoined: ResolverTypeWrapper<
    Omit<
      ActivityLogEntryMemberJoined,
      'community' | 'contributor' | 'space' | 'triggeredBy'
    > & {
      community: ResolversTypes['Community'];
      contributor: ResolversTypes['Contributor'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
    }
  >;
  ActivityLogEntrySubspaceCreated: ResolverTypeWrapper<
    Omit<
      ActivityLogEntrySubspaceCreated,
      'space' | 'subspace' | 'triggeredBy'
    > & {
      space?: Maybe<ResolversTypes['Space']>;
      subspace: ResolversTypes['Space'];
      triggeredBy: ResolversTypes['User'];
    }
  >;
  ActivityLogEntryUpdateSent: ResolverTypeWrapper<
    Omit<ActivityLogEntryUpdateSent, 'space' | 'triggeredBy' | 'updates'> & {
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy: ResolversTypes['User'];
      updates: ResolversTypes['Room'];
    }
  >;
  ActivityLogInput: ActivityLogInput;
  Agent: ResolverTypeWrapper<Agent>;
  AgentBeginVerifiedCredentialOfferOutput: ResolverTypeWrapper<AgentBeginVerifiedCredentialOfferOutput>;
  AgentBeginVerifiedCredentialRequestOutput: ResolverTypeWrapper<AgentBeginVerifiedCredentialRequestOutput>;
  AgentType: AgentType;
  AiPersona: ResolverTypeWrapper<AiPersona>;
  AiPersonaBodyOfKnowledgeType: AiPersonaBodyOfKnowledgeType;
  AiPersonaDataAccessMode: AiPersonaDataAccessMode;
  AiPersonaEngine: AiPersonaEngine;
  AiPersonaInteractionMode: AiPersonaInteractionMode;
  AiPersonaModelCard: ResolverTypeWrapper<AiPersonaModelCard>;
  AiPersonaModelCardEntry: AiPersonaModelCardEntry;
  AiPersonaModelCardEntryFlagName: AiPersonaModelCardEntryFlagName;
  AiPersonaModelCardFlag: ResolverTypeWrapper<AiPersonaModelCardFlag>;
  AiPersonaService: ResolverTypeWrapper<AiPersonaService>;
  AiServer: ResolverTypeWrapper<AiServer>;
  Application: ResolverTypeWrapper<
    Omit<Application, 'contributor'> & {
      contributor: ResolversTypes['Contributor'];
    }
  >;
  ApplicationEventInput: ApplicationEventInput;
  ApplyForEntryRoleOnRoleSetInput: ApplyForEntryRoleOnRoleSetInput;
  AssignLicensePlanToAccount: AssignLicensePlanToAccount;
  AssignLicensePlanToSpace: AssignLicensePlanToSpace;
  AssignPlatformRoleInput: AssignPlatformRoleInput;
  AssignRoleOnRoleSetToOrganizationInput: AssignRoleOnRoleSetToOrganizationInput;
  AssignRoleOnRoleSetToUserInput: AssignRoleOnRoleSetToUserInput;
  AssignRoleOnRoleSetToVirtualContributorInput: AssignRoleOnRoleSetToVirtualContributorInput;
  AssignUserGroupMemberInput: AssignUserGroupMemberInput;
  AuthenticationConfig: ResolverTypeWrapper<
    Omit<AuthenticationConfig, 'providers'> & {
      providers: Array<ResolversTypes['AuthenticationProviderConfig']>;
    }
  >;
  AuthenticationProviderConfig: ResolverTypeWrapper<
    Omit<AuthenticationProviderConfig, 'config'> & {
      config: ResolversTypes['AuthenticationProviderConfigUnion'];
    }
  >;
  AuthenticationProviderConfigUnion: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>['AuthenticationProviderConfigUnion']
  >;
  AuthenticationType: AuthenticationType;
  Authorization: ResolverTypeWrapper<Authorization>;
  AuthorizationCredential: AuthorizationCredential;
  AuthorizationPolicyRuleCredential: ResolverTypeWrapper<AuthorizationPolicyRuleCredential>;
  AuthorizationPolicyRulePrivilege: ResolverTypeWrapper<AuthorizationPolicyRulePrivilege>;
  AuthorizationPolicyRuleVerifiedCredential: ResolverTypeWrapper<AuthorizationPolicyRuleVerifiedCredential>;
  AuthorizationPolicyType: AuthorizationPolicyType;
  AuthorizationPrivilege: AuthorizationPrivilege;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Calendar: ResolverTypeWrapper<
    Omit<Calendar, 'event' | 'events'> & {
      event?: Maybe<ResolversTypes['CalendarEvent']>;
      events: Array<ResolversTypes['CalendarEvent']>;
    }
  >;
  CalendarEvent: ResolverTypeWrapper<
    Omit<CalendarEvent, 'comments' | 'createdBy' | 'profile' | 'subspace'> & {
      comments: ResolversTypes['Room'];
      createdBy?: Maybe<ResolversTypes['User']>;
      profile: ResolversTypes['Profile'];
      subspace?: Maybe<ResolversTypes['Space']>;
    }
  >;
  CalendarEventType: CalendarEventType;
  Callout: ResolverTypeWrapper<
    Omit<
      Callout,
      | 'classification'
      | 'comments'
      | 'contributions'
      | 'createdBy'
      | 'framing'
      | 'posts'
      | 'publishedBy'
    > & {
      classification?: Maybe<ResolversTypes['Classification']>;
      comments?: Maybe<ResolversTypes['Room']>;
      contributions: Array<ResolversTypes['CalloutContribution']>;
      createdBy?: Maybe<ResolversTypes['User']>;
      framing: ResolversTypes['CalloutFraming'];
      posts?: Maybe<Array<ResolversTypes['Post']>>;
      publishedBy?: Maybe<ResolversTypes['User']>;
    }
  >;
  CalloutAllowedContributors: CalloutAllowedContributors;
  CalloutContribution: ResolverTypeWrapper<
    Omit<CalloutContribution, 'createdBy' | 'link' | 'post' | 'whiteboard'> & {
      createdBy?: Maybe<ResolversTypes['User']>;
      link?: Maybe<ResolversTypes['Link']>;
      post?: Maybe<ResolversTypes['Post']>;
      whiteboard?: Maybe<ResolversTypes['Whiteboard']>;
    }
  >;
  CalloutContributionDefaults: ResolverTypeWrapper<CalloutContributionDefaults>;
  CalloutContributionType: CalloutContributionType;
  CalloutFraming: ResolverTypeWrapper<
    Omit<CalloutFraming, 'link' | 'memo' | 'profile' | 'whiteboard'> & {
      link?: Maybe<ResolversTypes['Link']>;
      memo?: Maybe<ResolversTypes['Memo']>;
      profile: ResolversTypes['Profile'];
      whiteboard?: Maybe<ResolversTypes['Whiteboard']>;
    }
  >;
  CalloutFramingType: CalloutFramingType;
  CalloutPostCreated: ResolverTypeWrapper<
    Omit<CalloutPostCreated, 'post'> & { post: ResolversTypes['Post'] }
  >;
  CalloutSettings: ResolverTypeWrapper<CalloutSettings>;
  CalloutSettingsContribution: ResolverTypeWrapper<CalloutSettingsContribution>;
  CalloutSettingsFraming: ResolverTypeWrapper<CalloutSettingsFraming>;
  CalloutVisibility: CalloutVisibility;
  CalloutsSet: ResolverTypeWrapper<
    Omit<CalloutsSet, 'callouts'> & {
      callouts: Array<ResolversTypes['Callout']>;
    }
  >;
  CalloutsSetType: CalloutsSetType;
  ChatGuidanceAnswerRelevanceInput: ChatGuidanceAnswerRelevanceInput;
  ChatGuidanceInput: ChatGuidanceInput;
  Classification: ResolverTypeWrapper<Classification>;
  Collaboration: ResolverTypeWrapper<
    Omit<Collaboration, 'calloutsSet' | 'innovationFlow' | 'timeline'> & {
      calloutsSet: ResolversTypes['CalloutsSet'];
      innovationFlow: ResolversTypes['InnovationFlow'];
      timeline: ResolversTypes['Timeline'];
    }
  >;
  Communication: ResolverTypeWrapper<
    Omit<Communication, 'updates'> & { updates: ResolversTypes['Room'] }
  >;
  CommunicationAdminEnsureAccessInput: CommunicationAdminEnsureAccessInput;
  CommunicationAdminMembershipInput: CommunicationAdminMembershipInput;
  CommunicationAdminMembershipResult: ResolverTypeWrapper<CommunicationAdminMembershipResult>;
  CommunicationAdminOrphanedUsageResult: ResolverTypeWrapper<CommunicationAdminOrphanedUsageResult>;
  CommunicationAdminRemoveOrphanedRoomInput: CommunicationAdminRemoveOrphanedRoomInput;
  CommunicationAdminRoomMembershipResult: ResolverTypeWrapper<CommunicationAdminRoomMembershipResult>;
  CommunicationAdminRoomResult: ResolverTypeWrapper<CommunicationAdminRoomResult>;
  CommunicationAdminUpdateRoomStateInput: CommunicationAdminUpdateRoomStateInput;
  CommunicationRoom: ResolverTypeWrapper<
    Omit<CommunicationRoom, 'messages'> & {
      messages: Array<ResolversTypes['Message']>;
    }
  >;
  CommunicationSendMessageToCommunityLeadsInput: CommunicationSendMessageToCommunityLeadsInput;
  CommunicationSendMessageToOrganizationInput: CommunicationSendMessageToOrganizationInput;
  CommunicationSendMessageToUserInput: CommunicationSendMessageToUserInput;
  Community: ResolverTypeWrapper<
    Omit<Community, 'communication' | 'group' | 'groups' | 'roleSet'> & {
      communication: ResolversTypes['Communication'];
      group: ResolversTypes['UserGroup'];
      groups: Array<ResolversTypes['UserGroup']>;
      roleSet: ResolversTypes['RoleSet'];
    }
  >;
  CommunityApplicationForRoleResult: ResolverTypeWrapper<CommunityApplicationForRoleResult>;
  CommunityApplicationResult: ResolverTypeWrapper<
    Omit<
      CommunityApplicationResult,
      'application' | 'spacePendingMembershipInfo'
    > & {
      application: ResolversTypes['Application'];
      spacePendingMembershipInfo: ResolversTypes['SpacePendingMembershipInfo'];
    }
  >;
  CommunityGuidelines: ResolverTypeWrapper<
    Omit<CommunityGuidelines, 'profile'> & {
      profile: ResolversTypes['Profile'];
    }
  >;
  CommunityInvitationForRoleResult: ResolverTypeWrapper<CommunityInvitationForRoleResult>;
  CommunityInvitationResult: ResolverTypeWrapper<
    Omit<
      CommunityInvitationResult,
      'invitation' | 'spacePendingMembershipInfo'
    > & {
      invitation: ResolversTypes['Invitation'];
      spacePendingMembershipInfo: ResolversTypes['SpacePendingMembershipInfo'];
    }
  >;
  CommunityMembershipPolicy: CommunityMembershipPolicy;
  CommunityMembershipResult: ResolverTypeWrapper<
    Omit<CommunityMembershipResult, 'childMemberships' | 'space'> & {
      childMemberships: Array<ResolversTypes['CommunityMembershipResult']>;
      space: ResolversTypes['Space'];
    }
  >;
  CommunityMembershipStatus: CommunityMembershipStatus;
  Config: ResolverTypeWrapper<
    Omit<Config, 'authentication'> & {
      authentication: ResolversTypes['AuthenticationConfig'];
    }
  >;
  ContentUpdatePolicy: ContentUpdatePolicy;
  Contributor: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>['Contributor']
  >;
  ContributorFilterInput: ContributorFilterInput;
  ContributorRolePolicy: ResolverTypeWrapper<ContributorRolePolicy>;
  ContributorRoles: ResolverTypeWrapper<ContributorRoles>;
  ConversionVcSpaceToVcKnowledgeBaseInput: ConversionVcSpaceToVcKnowledgeBaseInput;
  ConvertSpaceL1ToSpaceL0Input: ConvertSpaceL1ToSpaceL0Input;
  ConvertSpaceL1ToSpaceL2Input: ConvertSpaceL1ToSpaceL2Input;
  ConvertSpaceL2ToSpaceL1Input: ConvertSpaceL2ToSpaceL1Input;
  CreateAiPersonaInput: CreateAiPersonaInput;
  CreateAiPersonaServiceInput: CreateAiPersonaServiceInput;
  CreateCalendarEventOnCalendarInput: CreateCalendarEventOnCalendarInput;
  CreateCalloutContributionData: ResolverTypeWrapper<CreateCalloutContributionData>;
  CreateCalloutContributionDefaultsData: ResolverTypeWrapper<CreateCalloutContributionDefaultsData>;
  CreateCalloutContributionDefaultsInput: CreateCalloutContributionDefaultsInput;
  CreateCalloutContributionInput: CreateCalloutContributionInput;
  CreateCalloutData: ResolverTypeWrapper<CreateCalloutData>;
  CreateCalloutFramingData: ResolverTypeWrapper<CreateCalloutFramingData>;
  CreateCalloutFramingInput: CreateCalloutFramingInput;
  CreateCalloutInput: CreateCalloutInput;
  CreateCalloutOnCalloutsSetInput: CreateCalloutOnCalloutsSetInput;
  CreateCalloutSettingsContributionData: ResolverTypeWrapper<CreateCalloutSettingsContributionData>;
  CreateCalloutSettingsContributionInput: CreateCalloutSettingsContributionInput;
  CreateCalloutSettingsData: ResolverTypeWrapper<CreateCalloutSettingsData>;
  CreateCalloutSettingsFramingData: ResolverTypeWrapper<CreateCalloutSettingsFramingData>;
  CreateCalloutSettingsFramingInput: CreateCalloutSettingsFramingInput;
  CreateCalloutSettingsInput: CreateCalloutSettingsInput;
  CreateCalloutsSetData: ResolverTypeWrapper<CreateCalloutsSetData>;
  CreateCalloutsSetInput: CreateCalloutsSetInput;
  CreateClassificationData: ResolverTypeWrapper<CreateClassificationData>;
  CreateClassificationInput: CreateClassificationInput;
  CreateCollaborationData: ResolverTypeWrapper<CreateCollaborationData>;
  CreateCollaborationInput: CreateCollaborationInput;
  CreateCollaborationOnSpaceInput: CreateCollaborationOnSpaceInput;
  CreateCommunityGuidelinesData: ResolverTypeWrapper<CreateCommunityGuidelinesData>;
  CreateCommunityGuidelinesInput: CreateCommunityGuidelinesInput;
  CreateContributionOnCalloutInput: CreateContributionOnCalloutInput;
  CreateInnovationFlowData: ResolverTypeWrapper<CreateInnovationFlowData>;
  CreateInnovationFlowInput: CreateInnovationFlowInput;
  CreateInnovationFlowStateData: ResolverTypeWrapper<CreateInnovationFlowStateData>;
  CreateInnovationFlowStateInput: CreateInnovationFlowStateInput;
  CreateInnovationFlowStateSettingsData: ResolverTypeWrapper<CreateInnovationFlowStateSettingsData>;
  CreateInnovationFlowStateSettingsInput: CreateInnovationFlowStateSettingsInput;
  CreateInnovationHubOnAccountInput: CreateInnovationHubOnAccountInput;
  CreateInnovationPackOnAccountInput: CreateInnovationPackOnAccountInput;
  CreateKnowledgeBaseInput: CreateKnowledgeBaseInput;
  CreateLicensePlanOnLicensingFrameworkInput: CreateLicensePlanOnLicensingFrameworkInput;
  CreateLinkData: ResolverTypeWrapper<CreateLinkData>;
  CreateLinkInput: CreateLinkInput;
  CreateLocationData: ResolverTypeWrapper<CreateLocationData>;
  CreateLocationInput: CreateLocationInput;
  CreateMemoData: ResolverTypeWrapper<CreateMemoData>;
  CreateMemoInput: CreateMemoInput;
  CreateNVPInput: CreateNvpInput;
  CreateOrganizationInput: CreateOrganizationInput;
  CreatePostData: ResolverTypeWrapper<CreatePostData>;
  CreatePostInput: CreatePostInput;
  CreateProfileData: ResolverTypeWrapper<CreateProfileData>;
  CreateProfileInput: CreateProfileInput;
  CreateReferenceData: ResolverTypeWrapper<CreateReferenceData>;
  CreateReferenceInput: CreateReferenceInput;
  CreateReferenceOnProfileInput: CreateReferenceOnProfileInput;
  CreateSpaceAboutInput: CreateSpaceAboutInput;
  CreateSpaceOnAccountInput: CreateSpaceOnAccountInput;
  CreateSpaceSettingsCollaborationInput: CreateSpaceSettingsCollaborationInput;
  CreateSpaceSettingsInput: CreateSpaceSettingsInput;
  CreateSpaceSettingsMembershipInput: CreateSpaceSettingsMembershipInput;
  CreateSpaceSettingsPrivacyInput: CreateSpaceSettingsPrivacyInput;
  CreateStateOnInnovationFlowInput: CreateStateOnInnovationFlowInput;
  CreateSubspaceInput: CreateSubspaceInput;
  CreateTagsetData: ResolverTypeWrapper<CreateTagsetData>;
  CreateTagsetInput: CreateTagsetInput;
  CreateTagsetOnProfileInput: CreateTagsetOnProfileInput;
  CreateTemplateContentSpaceInput: CreateTemplateContentSpaceInput;
  CreateTemplateFromContentSpaceOnTemplatesSetInput: CreateTemplateFromContentSpaceOnTemplatesSetInput;
  CreateTemplateFromSpaceOnTemplatesSetInput: CreateTemplateFromSpaceOnTemplatesSetInput;
  CreateTemplateOnTemplatesSetInput: CreateTemplateOnTemplatesSetInput;
  CreateUserGroupInput: CreateUserGroupInput;
  CreateUserInput: CreateUserInput;
  CreateVirtualContributorOnAccountInput: CreateVirtualContributorOnAccountInput;
  CreateVisualOnProfileData: ResolverTypeWrapper<CreateVisualOnProfileData>;
  CreateVisualOnProfileInput: CreateVisualOnProfileInput;
  CreateWhiteboardData: ResolverTypeWrapper<CreateWhiteboardData>;
  CreateWhiteboardInput: CreateWhiteboardInput;
  Credential: ResolverTypeWrapper<Credential>;
  CredentialDefinition: ResolverTypeWrapper<CredentialDefinition>;
  CredentialMetadataOutput: ResolverTypeWrapper<CredentialMetadataOutput>;
  CredentialType: CredentialType;
  DID: ResolverTypeWrapper<Scalars['DID']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeleteAiPersonaServiceInput: DeleteAiPersonaServiceInput;
  DeleteApplicationInput: DeleteApplicationInput;
  DeleteCalendarEventInput: DeleteCalendarEventInput;
  DeleteCalloutInput: DeleteCalloutInput;
  DeleteDiscussionInput: DeleteDiscussionInput;
  DeleteDocumentInput: DeleteDocumentInput;
  DeleteInnovationHubInput: DeleteInnovationHubInput;
  DeleteInnovationPackInput: DeleteInnovationPackInput;
  DeleteInvitationInput: DeleteInvitationInput;
  DeleteLicensePlanInput: DeleteLicensePlanInput;
  DeleteLinkInput: DeleteLinkInput;
  DeleteMemoInput: DeleteMemoInput;
  DeleteOrganizationInput: DeleteOrganizationInput;
  DeletePlatformInvitationInput: DeletePlatformInvitationInput;
  DeletePostInput: DeletePostInput;
  DeleteReferenceInput: DeleteReferenceInput;
  DeleteSpaceInput: DeleteSpaceInput;
  DeleteStateOnInnovationFlowInput: DeleteStateOnInnovationFlowInput;
  DeleteStorageBuckeetInput: DeleteStorageBuckeetInput;
  DeleteTemplateInput: DeleteTemplateInput;
  DeleteUserGroupInput: DeleteUserGroupInput;
  DeleteUserInput: DeleteUserInput;
  DeleteVirtualContributorInput: DeleteVirtualContributorInput;
  DeleteWhiteboardInput: DeleteWhiteboardInput;
  DirectRoom: ResolverTypeWrapper<
    Omit<DirectRoom, 'messages'> & {
      messages: Array<ResolversTypes['Message']>;
    }
  >;
  Discussion: ResolverTypeWrapper<
    Omit<Discussion, 'comments' | 'profile'> & {
      comments: ResolversTypes['Room'];
      profile: ResolversTypes['Profile'];
    }
  >;
  DiscussionsInput: DiscussionsInput;
  DiscussionsOrderBy: DiscussionsOrderBy;
  Document: ResolverTypeWrapper<
    Omit<Document, 'createdBy'> & { createdBy?: Maybe<ResolversTypes['User']> }
  >;
  Emoji: ResolverTypeWrapper<Scalars['Emoji']['output']>;
  ExploreSpacesInput: ExploreSpacesInput;
  ExternalConfig: ResolverTypeWrapper<ExternalConfig>;
  ExternalConfigInput: ExternalConfigInput;
  FileStorageConfig: ResolverTypeWrapper<FileStorageConfig>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Form: ResolverTypeWrapper<Form>;
  FormQuestion: ResolverTypeWrapper<FormQuestion>;
  Forum: ResolverTypeWrapper<
    Omit<Forum, 'discussion' | 'discussions'> & {
      discussion?: Maybe<ResolversTypes['Discussion']>;
      discussions?: Maybe<Array<ResolversTypes['Discussion']>>;
    }
  >;
  ForumCreateDiscussionInput: ForumCreateDiscussionInput;
  ForumDiscussionCategory: ForumDiscussionCategory;
  ForumDiscussionPrivacy: ForumDiscussionPrivacy;
  Geo: ResolverTypeWrapper<Geo>;
  GeoLocation: ResolverTypeWrapper<GeoLocation>;
  GrantAuthorizationCredentialInput: GrantAuthorizationCredentialInput;
  GrantOrganizationAuthorizationCredentialInput: GrantOrganizationAuthorizationCredentialInput;
  Groupable: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>['Groupable']
  >;
  ISearchCategoryResult: ResolverTypeWrapper<
    Omit<ISearchCategoryResult, 'results'> & {
      results: Array<ResolversTypes['SearchResult']>;
    }
  >;
  ISearchResults: ResolverTypeWrapper<
    Omit<
      ISearchResults,
      | 'calloutResults'
      | 'contributionResults'
      | 'contributorResults'
      | 'spaceResults'
    > & {
      calloutResults: ResolversTypes['ISearchCategoryResult'];
      contributionResults: ResolversTypes['ISearchCategoryResult'];
      contributorResults: ResolversTypes['ISearchCategoryResult'];
      spaceResults: ResolversTypes['ISearchCategoryResult'];
    }
  >;
  InAppNotification: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>['InAppNotification']
  >;
  InAppNotificationCalloutPublished: ResolverTypeWrapper<
    Omit<
      InAppNotificationCalloutPublished,
      'callout' | 'receiver' | 'space' | 'triggeredBy'
    > & {
      callout?: Maybe<ResolversTypes['Callout']>;
      receiver: ResolversTypes['Contributor'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy?: Maybe<ResolversTypes['Contributor']>;
    }
  >;
  InAppNotificationCategory: InAppNotificationCategory;
  InAppNotificationCommunityNewMember: ResolverTypeWrapper<
    Omit<
      InAppNotificationCommunityNewMember,
      'actor' | 'receiver' | 'space' | 'triggeredBy'
    > & {
      actor?: Maybe<ResolversTypes['Contributor']>;
      receiver: ResolversTypes['Contributor'];
      space?: Maybe<ResolversTypes['Space']>;
      triggeredBy?: Maybe<ResolversTypes['Contributor']>;
    }
  >;
  InAppNotificationState: InAppNotificationState;
  InAppNotificationUserMentioned: ResolverTypeWrapper<
    Omit<InAppNotificationUserMentioned, 'receiver' | 'triggeredBy'> & {
      receiver: ResolversTypes['Contributor'];
      triggeredBy?: Maybe<ResolversTypes['Contributor']>;
    }
  >;
  InnovationFlow: ResolverTypeWrapper<
    Omit<InnovationFlow, 'profile'> & { profile: ResolversTypes['Profile'] }
  >;
  InnovationFlowSettings: ResolverTypeWrapper<InnovationFlowSettings>;
  InnovationFlowState: ResolverTypeWrapper<InnovationFlowState>;
  InnovationFlowStateSettings: ResolverTypeWrapper<InnovationFlowStateSettings>;
  InnovationHub: ResolverTypeWrapper<
    Omit<
      InnovationHub,
      'account' | 'profile' | 'provider' | 'spaceListFilter'
    > & {
      account: ResolversTypes['Account'];
      profile: ResolversTypes['Profile'];
      provider: ResolversTypes['Contributor'];
      spaceListFilter?: Maybe<Array<ResolversTypes['Space']>>;
    }
  >;
  InnovationHubType: InnovationHubType;
  InnovationPack: ResolverTypeWrapper<
    Omit<InnovationPack, 'profile' | 'provider' | 'templatesSet'> & {
      profile: ResolversTypes['Profile'];
      provider: ResolversTypes['Contributor'];
      templatesSet?: Maybe<ResolversTypes['TemplatesSet']>;
    }
  >;
  InnovationPacksInput: InnovationPacksInput;
  InnovationPacksOrderBy: InnovationPacksOrderBy;
  InputCreatorQueryResults: ResolverTypeWrapper<InputCreatorQueryResults>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Invitation: ResolverTypeWrapper<
    Omit<Invitation, 'contributor' | 'createdBy'> & {
      contributor: ResolversTypes['Contributor'];
      createdBy?: Maybe<ResolversTypes['User']>;
    }
  >;
  InvitationEventInput: InvitationEventInput;
  InviteForEntryRoleOnRoleSetInput: InviteForEntryRoleOnRoleSetInput;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  JoinAsEntryRoleOnRoleSetInput: JoinAsEntryRoleOnRoleSetInput;
  KnowledgeBase: ResolverTypeWrapper<
    Omit<KnowledgeBase, 'calloutsSet' | 'profile'> & {
      calloutsSet: ResolversTypes['CalloutsSet'];
      profile: ResolversTypes['Profile'];
    }
  >;
  LatestReleaseDiscussion: ResolverTypeWrapper<LatestReleaseDiscussion>;
  Library: ResolverTypeWrapper<
    Omit<
      Library,
      'innovationHubs' | 'innovationPacks' | 'templates' | 'virtualContributors'
    > & {
      innovationHubs: Array<ResolversTypes['InnovationHub']>;
      innovationPacks: Array<ResolversTypes['InnovationPack']>;
      templates: Array<ResolversTypes['TemplateResult']>;
      virtualContributors: Array<ResolversTypes['VirtualContributor']>;
    }
  >;
  LibraryTemplatesFilterInput: LibraryTemplatesFilterInput;
  License: ResolverTypeWrapper<License>;
  LicenseEntitlement: ResolverTypeWrapper<LicenseEntitlement>;
  LicenseEntitlementDataType: LicenseEntitlementDataType;
  LicenseEntitlementType: LicenseEntitlementType;
  LicensePlan: ResolverTypeWrapper<LicensePlan>;
  LicensePolicy: ResolverTypeWrapper<LicensePolicy>;
  LicenseType: LicenseType;
  Licensing: ResolverTypeWrapper<Licensing>;
  LicensingCredentialBasedCredentialType: LicensingCredentialBasedCredentialType;
  LicensingCredentialBasedPlanType: LicensingCredentialBasedPlanType;
  LicensingCredentialBasedPolicyCredentialRule: ResolverTypeWrapper<LicensingCredentialBasedPolicyCredentialRule>;
  LicensingGrantedEntitlement: ResolverTypeWrapper<LicensingGrantedEntitlement>;
  Lifecycle: ResolverTypeWrapper<Lifecycle>;
  LifecycleDefinition: ResolverTypeWrapper<
    Scalars['LifecycleDefinition']['output']
  >;
  Link: ResolverTypeWrapper<
    Omit<Link, 'profile'> & { profile: ResolversTypes['Profile'] }
  >;
  Location: ResolverTypeWrapper<Location>;
  LookupByNameQueryResults: ResolverTypeWrapper<
    Omit<LookupByNameQueryResults, 'space'> & {
      space?: Maybe<ResolversTypes['Space']>;
    }
  >;
  LookupMyPrivilegesQueryResults: ResolverTypeWrapper<LookupMyPrivilegesQueryResults>;
  LookupQueryResults: ResolverTypeWrapper<
    Omit<
      LookupQueryResults,
      | 'about'
      | 'account'
      | 'application'
      | 'calendar'
      | 'calendarEvent'
      | 'callout'
      | 'calloutsSet'
      | 'collaboration'
      | 'community'
      | 'communityGuidelines'
      | 'document'
      | 'innovationFlow'
      | 'innovationHub'
      | 'innovationPack'
      | 'invitation'
      | 'knowledgeBase'
      | 'memo'
      | 'organization'
      | 'platformInvitation'
      | 'post'
      | 'profile'
      | 'roleSet'
      | 'room'
      | 'space'
      | 'storageBucket'
      | 'template'
      | 'templateContentSpace'
      | 'templatesManager'
      | 'templatesSet'
      | 'user'
      | 'virtualContributor'
      | 'whiteboard'
    > & {
      about?: Maybe<ResolversTypes['SpaceAbout']>;
      account?: Maybe<ResolversTypes['Account']>;
      application?: Maybe<ResolversTypes['Application']>;
      calendar?: Maybe<ResolversTypes['Calendar']>;
      calendarEvent?: Maybe<ResolversTypes['CalendarEvent']>;
      callout?: Maybe<ResolversTypes['Callout']>;
      calloutsSet?: Maybe<ResolversTypes['CalloutsSet']>;
      collaboration?: Maybe<ResolversTypes['Collaboration']>;
      community?: Maybe<ResolversTypes['Community']>;
      communityGuidelines?: Maybe<ResolversTypes['CommunityGuidelines']>;
      document?: Maybe<ResolversTypes['Document']>;
      innovationFlow?: Maybe<ResolversTypes['InnovationFlow']>;
      innovationHub?: Maybe<ResolversTypes['InnovationHub']>;
      innovationPack?: Maybe<ResolversTypes['InnovationPack']>;
      invitation?: Maybe<ResolversTypes['Invitation']>;
      knowledgeBase: ResolversTypes['KnowledgeBase'];
      memo?: Maybe<ResolversTypes['Memo']>;
      organization?: Maybe<ResolversTypes['Organization']>;
      platformInvitation?: Maybe<ResolversTypes['PlatformInvitation']>;
      post?: Maybe<ResolversTypes['Post']>;
      profile?: Maybe<ResolversTypes['Profile']>;
      roleSet?: Maybe<ResolversTypes['RoleSet']>;
      room?: Maybe<ResolversTypes['Room']>;
      space?: Maybe<ResolversTypes['Space']>;
      storageBucket?: Maybe<ResolversTypes['StorageBucket']>;
      template?: Maybe<ResolversTypes['Template']>;
      templateContentSpace?: Maybe<ResolversTypes['TemplateContentSpace']>;
      templatesManager?: Maybe<ResolversTypes['TemplatesManager']>;
      templatesSet?: Maybe<ResolversTypes['TemplatesSet']>;
      user?: Maybe<ResolversTypes['User']>;
      virtualContributor?: Maybe<ResolversTypes['VirtualContributor']>;
      whiteboard?: Maybe<ResolversTypes['Whiteboard']>;
    }
  >;
  Markdown: ResolverTypeWrapper<Scalars['Markdown']['output']>;
  MeQueryResults: ResolverTypeWrapper<
    Omit<
      MeQueryResults,
      | 'communityApplications'
      | 'communityInvitations'
      | 'mySpaces'
      | 'spaceMembershipsFlat'
      | 'spaceMembershipsHierarchical'
      | 'user'
    > & {
      communityApplications: Array<
        ResolversTypes['CommunityApplicationResult']
      >;
      communityInvitations: Array<ResolversTypes['CommunityInvitationResult']>;
      mySpaces: Array<ResolversTypes['MySpaceResults']>;
      spaceMembershipsFlat: Array<ResolversTypes['CommunityMembershipResult']>;
      spaceMembershipsHierarchical: Array<
        ResolversTypes['CommunityMembershipResult']
      >;
      user?: Maybe<ResolversTypes['User']>;
    }
  >;
  Memo: ResolverTypeWrapper<
    Omit<Memo, 'createdBy' | 'profile'> & {
      createdBy?: Maybe<ResolversTypes['User']>;
      profile: ResolversTypes['Profile'];
    }
  >;
  MemoContent: ResolverTypeWrapper<Scalars['MemoContent']['output']>;
  Message: ResolverTypeWrapper<
    Omit<Message, 'reactions' | 'sender'> & {
      reactions: Array<ResolversTypes['Reaction']>;
      sender?: Maybe<ResolversTypes['Contributor']>;
    }
  >;
  MessageAnswerQuestion: ResolverTypeWrapper<MessageAnswerQuestion>;
  MessageID: ResolverTypeWrapper<Scalars['MessageID']['output']>;
  Metadata: ResolverTypeWrapper<Metadata>;
  MigrateEmbeddings: ResolverTypeWrapper<MigrateEmbeddings>;
  MimeType: MimeType;
  ModelCardAiEngineResult: ResolverTypeWrapper<ModelCardAiEngineResult>;
  ModelCardMonitoringResult: ResolverTypeWrapper<ModelCardMonitoringResult>;
  ModelCardSpaceUsageResult: ResolverTypeWrapper<ModelCardSpaceUsageResult>;
  MoveCalloutContributionInput: MoveCalloutContributionInput;
  Mutation: ResolverTypeWrapper<{}>;
  MutationType: MutationType;
  MySpaceResults: ResolverTypeWrapper<
    Omit<MySpaceResults, 'latestActivity' | 'space'> & {
      latestActivity?: Maybe<ResolversTypes['ActivityLogEntry']>;
      space: ResolversTypes['Space'];
    }
  >;
  NVP: ResolverTypeWrapper<Nvp>;
  NameID: ResolverTypeWrapper<Scalars['NameID']['output']>;
  NotificationEvent: NotificationEvent;
  NotificationRecipientResult: ResolverTypeWrapper<
    Omit<
      NotificationRecipientResult,
      'emailRecipients' | 'inAppRecipients' | 'triggeredBy'
    > & {
      emailRecipients: Array<ResolversTypes['User']>;
      inAppRecipients: Array<ResolversTypes['User']>;
      triggeredBy?: Maybe<ResolversTypes['User']>;
    }
  >;
  NotificationRecipientsInput: NotificationRecipientsInput;
  OpenAIModel: OpenAiModel;
  Organization: ResolverTypeWrapper<
    Omit<
      Organization,
      'account' | 'group' | 'groups' | 'profile' | 'roleSet'
    > & {
      account?: Maybe<ResolversTypes['Account']>;
      group?: Maybe<ResolversTypes['UserGroup']>;
      groups?: Maybe<Array<ResolversTypes['UserGroup']>>;
      profile: ResolversTypes['Profile'];
      roleSet: ResolversTypes['RoleSet'];
    }
  >;
  OrganizationAuthorizationResetInput: OrganizationAuthorizationResetInput;
  OrganizationFilterInput: OrganizationFilterInput;
  OrganizationSettings: ResolverTypeWrapper<OrganizationSettings>;
  OrganizationSettingsMembership: ResolverTypeWrapper<OrganizationSettingsMembership>;
  OrganizationSettingsPrivacy: ResolverTypeWrapper<OrganizationSettingsPrivacy>;
  OrganizationVerification: ResolverTypeWrapper<OrganizationVerification>;
  OrganizationVerificationEnum: OrganizationVerificationEnum;
  OrganizationVerificationEventInput: OrganizationVerificationEventInput;
  OrganizationsInRolesResponse: ResolverTypeWrapper<
    Omit<OrganizationsInRolesResponse, 'organizations'> & {
      organizations: Array<ResolversTypes['Organization']>;
    }
  >;
  OryConfig: ResolverTypeWrapper<OryConfig>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginatedOrganization: ResolverTypeWrapper<
    Omit<PaginatedOrganization, 'organization' | 'pageInfo'> & {
      organization: Array<ResolversTypes['Organization']>;
      pageInfo: ResolversTypes['PageInfo'];
    }
  >;
  PaginatedSpaces: ResolverTypeWrapper<
    Omit<PaginatedSpaces, 'pageInfo' | 'spaces'> & {
      pageInfo: ResolversTypes['PageInfo'];
      spaces: Array<ResolversTypes['Space']>;
    }
  >;
  PaginatedUsers: ResolverTypeWrapper<
    Omit<PaginatedUsers, 'pageInfo' | 'users'> & {
      pageInfo: ResolversTypes['PageInfo'];
      users: Array<ResolversTypes['User']>;
    }
  >;
  PaginatedVirtualContributor: ResolverTypeWrapper<
    Omit<PaginatedVirtualContributor, 'pageInfo' | 'virtualContributors'> & {
      pageInfo: ResolversTypes['PageInfo'];
      virtualContributors: Array<ResolversTypes['VirtualContributor']>;
    }
  >;
  Platform: ResolverTypeWrapper<
    Omit<
      Platform,
      | 'chatGuidanceVirtualContributor'
      | 'configuration'
      | 'forum'
      | 'innovationHub'
      | 'library'
      | 'roleSet'
      | 'templatesManager'
    > & {
      chatGuidanceVirtualContributor: ResolversTypes['VirtualContributor'];
      configuration: ResolversTypes['Config'];
      forum: ResolversTypes['Forum'];
      innovationHub?: Maybe<ResolversTypes['InnovationHub']>;
      library: ResolversTypes['Library'];
      roleSet: ResolversTypes['RoleSet'];
      templatesManager?: Maybe<ResolversTypes['TemplatesManager']>;
    }
  >;
  PlatformFeatureFlag: ResolverTypeWrapper<PlatformFeatureFlag>;
  PlatformFeatureFlagName: PlatformFeatureFlagName;
  PlatformIntegrationSettings: ResolverTypeWrapper<PlatformIntegrationSettings>;
  PlatformInvitation: ResolverTypeWrapper<
    Omit<PlatformInvitation, 'createdBy'> & {
      createdBy: ResolversTypes['User'];
    }
  >;
  PlatformLocations: ResolverTypeWrapper<PlatformLocations>;
  PlatformSettings: ResolverTypeWrapper<PlatformSettings>;
  Post: ResolverTypeWrapper<
    Omit<Post, 'comments' | 'createdBy' | 'profile'> & {
      comments: ResolversTypes['Room'];
      createdBy?: Maybe<ResolversTypes['User']>;
      profile: ResolversTypes['Profile'];
    }
  >;
  Profile: ResolverTypeWrapper<
    Omit<Profile, 'references' | 'storageBucket'> & {
      references?: Maybe<Array<ResolversTypes['Reference']>>;
      storageBucket: ResolversTypes['StorageBucket'];
    }
  >;
  ProfileCredentialVerified: ResolverTypeWrapper<ProfileCredentialVerified>;
  ProfileType: ProfileType;
  Query: ResolverTypeWrapper<{}>;
  Question: ResolverTypeWrapper<Question>;
  Reaction: ResolverTypeWrapper<
    Omit<Reaction, 'sender'> & { sender?: Maybe<ResolversTypes['User']> }
  >;
  Reference: ResolverTypeWrapper<Reference>;
  RefreshVirtualContributorBodyOfKnowledgeInput: RefreshVirtualContributorBodyOfKnowledgeInput;
  RelayPaginatedSpace: ResolverTypeWrapper<
    Omit<
      RelayPaginatedSpace,
      | 'about'
      | 'account'
      | 'collaboration'
      | 'community'
      | 'subspaceByNameID'
      | 'subspaces'
      | 'templatesManager'
    > & {
      about: ResolversTypes['SpaceAbout'];
      account: ResolversTypes['Account'];
      collaboration: ResolversTypes['Collaboration'];
      community: ResolversTypes['Community'];
      subspaceByNameID: ResolversTypes['Space'];
      subspaces: Array<ResolversTypes['Space']>;
      templatesManager?: Maybe<ResolversTypes['TemplatesManager']>;
    }
  >;
  RelayPaginatedSpaceEdge: ResolverTypeWrapper<
    Omit<RelayPaginatedSpaceEdge, 'node'> & {
      node: ResolversTypes['RelayPaginatedSpace'];
    }
  >;
  RelayPaginatedSpacePageInfo: ResolverTypeWrapper<RelayPaginatedSpacePageInfo>;
  RemoveCommunityGuidelinesContentInput: RemoveCommunityGuidelinesContentInput;
  RemovePlatformRoleInput: RemovePlatformRoleInput;
  RemoveRoleOnRoleSetFromOrganizationInput: RemoveRoleOnRoleSetFromOrganizationInput;
  RemoveRoleOnRoleSetFromUserInput: RemoveRoleOnRoleSetFromUserInput;
  RemoveRoleOnRoleSetFromVirtualContributorInput: RemoveRoleOnRoleSetFromVirtualContributorInput;
  RemoveUserGroupMemberInput: RemoveUserGroupMemberInput;
  RevokeAuthorizationCredentialInput: RevokeAuthorizationCredentialInput;
  RevokeLicensePlanFromAccount: RevokeLicensePlanFromAccount;
  RevokeLicensePlanFromSpace: RevokeLicensePlanFromSpace;
  RevokeOrganizationAuthorizationCredentialInput: RevokeOrganizationAuthorizationCredentialInput;
  Role: ResolverTypeWrapper<Role>;
  RoleName: RoleName;
  RoleSet: ResolverTypeWrapper<
    Omit<
      RoleSet,
      | 'applications'
      | 'availableUsersForElevatedRole'
      | 'availableUsersForEntryRole'
      | 'availableVirtualContributorsForEntryRole'
      | 'invitations'
      | 'organizationsInRole'
      | 'organizationsInRoles'
      | 'platformInvitations'
      | 'usersInRole'
      | 'usersInRoles'
      | 'virtualContributorsInRole'
      | 'virtualContributorsInRoleInHierarchy'
      | 'virtualContributorsInRoles'
    > & {
      applications: Array<ResolversTypes['Application']>;
      availableUsersForElevatedRole: ResolversTypes['PaginatedUsers'];
      availableUsersForEntryRole: ResolversTypes['PaginatedUsers'];
      availableVirtualContributorsForEntryRole: ResolversTypes['PaginatedVirtualContributor'];
      invitations: Array<ResolversTypes['Invitation']>;
      organizationsInRole: Array<ResolversTypes['Organization']>;
      organizationsInRoles: Array<
        ResolversTypes['OrganizationsInRolesResponse']
      >;
      platformInvitations: Array<ResolversTypes['PlatformInvitation']>;
      usersInRole: Array<ResolversTypes['User']>;
      usersInRoles: Array<ResolversTypes['UsersInRolesResponse']>;
      virtualContributorsInRole: Array<ResolversTypes['VirtualContributor']>;
      virtualContributorsInRoleInHierarchy: Array<
        ResolversTypes['VirtualContributor']
      >;
      virtualContributorsInRoles: Array<
        ResolversTypes['VirtualContributorsInRolesResponse']
      >;
    }
  >;
  RoleSetContributorType: RoleSetContributorType;
  RoleSetInvitationResult: ResolverTypeWrapper<
    Omit<RoleSetInvitationResult, 'invitation' | 'platformInvitation'> & {
      invitation?: Maybe<ResolversTypes['Invitation']>;
      platformInvitation?: Maybe<ResolversTypes['PlatformInvitation']>;
    }
  >;
  RoleSetInvitationResultType: RoleSetInvitationResultType;
  RoleSetRoleImplicit: RoleSetRoleImplicit;
  RoleSetType: RoleSetType;
  RolesOrganizationInput: RolesOrganizationInput;
  RolesResult: ResolverTypeWrapper<RolesResult>;
  RolesResultCommunity: ResolverTypeWrapper<RolesResultCommunity>;
  RolesResultOrganization: ResolverTypeWrapper<RolesResultOrganization>;
  RolesResultSpace: ResolverTypeWrapper<RolesResultSpace>;
  RolesUserInput: RolesUserInput;
  RolesVirtualContributorInput: RolesVirtualContributorInput;
  Room: ResolverTypeWrapper<
    Omit<Room, 'messages' | 'vcInteractions'> & {
      messages: Array<ResolversTypes['Message']>;
      vcInteractions: Array<ResolversTypes['VcInteraction']>;
    }
  >;
  RoomAddReactionToMessageInput: RoomAddReactionToMessageInput;
  RoomEventSubscriptionResult: ResolverTypeWrapper<
    Omit<RoomEventSubscriptionResult, 'message' | 'reaction' | 'room'> & {
      message?: Maybe<ResolversTypes['RoomMessageEventSubscriptionResult']>;
      reaction?: Maybe<
        ResolversTypes['RoomMessageReactionEventSubscriptionResult']
      >;
      room: ResolversTypes['Room'];
    }
  >;
  RoomMessageEventSubscriptionResult: ResolverTypeWrapper<
    Omit<RoomMessageEventSubscriptionResult, 'data'> & {
      data: ResolversTypes['Message'];
    }
  >;
  RoomMessageReactionEventSubscriptionResult: ResolverTypeWrapper<
    Omit<RoomMessageReactionEventSubscriptionResult, 'data'> & {
      data: ResolversTypes['Reaction'];
    }
  >;
  RoomRemoveMessageInput: RoomRemoveMessageInput;
  RoomRemoveReactionToMessageInput: RoomRemoveReactionToMessageInput;
  RoomSendMessageInput: RoomSendMessageInput;
  RoomSendMessageReplyInput: RoomSendMessageReplyInput;
  SearchCategory: SearchCategory;
  SearchCursor: ResolverTypeWrapper<Scalars['SearchCursor']['output']>;
  SearchFilterInput: SearchFilterInput;
  SearchInput: SearchInput;
  SearchResult: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>['SearchResult']
  >;
  SearchResultCallout: ResolverTypeWrapper<
    Omit<SearchResultCallout, 'callout' | 'space'> & {
      callout: ResolversTypes['Callout'];
      space: ResolversTypes['Space'];
    }
  >;
  SearchResultOrganization: ResolverTypeWrapper<
    Omit<SearchResultOrganization, 'organization'> & {
      organization: ResolversTypes['Organization'];
    }
  >;
  SearchResultPost: ResolverTypeWrapper<
    Omit<SearchResultPost, 'callout' | 'post' | 'space'> & {
      callout: ResolversTypes['Callout'];
      post: ResolversTypes['Post'];
      space: ResolversTypes['Space'];
    }
  >;
  SearchResultSpace: ResolverTypeWrapper<
    Omit<SearchResultSpace, 'parentSpace' | 'space'> & {
      parentSpace?: Maybe<ResolversTypes['Space']>;
      space: ResolversTypes['Space'];
    }
  >;
  SearchResultType: SearchResultType;
  SearchResultUser: ResolverTypeWrapper<
    Omit<SearchResultUser, 'user'> & { user: ResolversTypes['User'] }
  >;
  SearchVisibility: SearchVisibility;
  Sentry: ResolverTypeWrapper<Sentry>;
  ServiceMetadata: ResolverTypeWrapper<ServiceMetadata>;
  Space: ResolverTypeWrapper<
    Omit<
      Space,
      | 'about'
      | 'account'
      | 'collaboration'
      | 'community'
      | 'subspaceByNameID'
      | 'subspaces'
      | 'templatesManager'
    > & {
      about: ResolversTypes['SpaceAbout'];
      account: ResolversTypes['Account'];
      collaboration: ResolversTypes['Collaboration'];
      community: ResolversTypes['Community'];
      subspaceByNameID: ResolversTypes['Space'];
      subspaces: Array<ResolversTypes['Space']>;
      templatesManager?: Maybe<ResolversTypes['TemplatesManager']>;
    }
  >;
  SpaceAbout: ResolverTypeWrapper<
    Omit<SpaceAbout, 'guidelines' | 'membership' | 'profile' | 'provider'> & {
      guidelines: ResolversTypes['CommunityGuidelines'];
      membership: ResolversTypes['SpaceAboutMembership'];
      profile: ResolversTypes['Profile'];
      provider: ResolversTypes['Contributor'];
    }
  >;
  SpaceAboutMembership: ResolverTypeWrapper<
    Omit<SpaceAboutMembership, 'leadOrganizations' | 'leadUsers'> & {
      leadOrganizations: Array<ResolversTypes['Organization']>;
      leadUsers: Array<ResolversTypes['User']>;
    }
  >;
  SpaceFilterInput: SpaceFilterInput;
  SpaceLevel: SpaceLevel;
  SpacePendingMembershipInfo: ResolverTypeWrapper<
    Omit<SpacePendingMembershipInfo, 'about' | 'communityGuidelines'> & {
      about: ResolversTypes['SpaceAbout'];
      communityGuidelines: ResolversTypes['CommunityGuidelines'];
    }
  >;
  SpacePrivacyMode: SpacePrivacyMode;
  SpaceSettings: ResolverTypeWrapper<SpaceSettings>;
  SpaceSettingsCollaboration: ResolverTypeWrapper<SpaceSettingsCollaboration>;
  SpaceSettingsMembership: ResolverTypeWrapper<SpaceSettingsMembership>;
  SpaceSettingsPrivacy: ResolverTypeWrapper<SpaceSettingsPrivacy>;
  SpaceSubscription: ResolverTypeWrapper<SpaceSubscription>;
  SpaceVisibility: SpaceVisibility;
  StorageAggregator: ResolverTypeWrapper<
    Omit<StorageAggregator, 'directStorageBucket' | 'storageBuckets'> & {
      directStorageBucket: ResolversTypes['StorageBucket'];
      storageBuckets: Array<ResolversTypes['StorageBucket']>;
    }
  >;
  StorageAggregatorParent: ResolverTypeWrapper<StorageAggregatorParent>;
  StorageAggregatorType: StorageAggregatorType;
  StorageBucket: ResolverTypeWrapper<
    Omit<StorageBucket, 'document' | 'documents'> & {
      document?: Maybe<ResolversTypes['Document']>;
      documents: Array<ResolversTypes['Document']>;
    }
  >;
  StorageBucketParent: ResolverTypeWrapper<StorageBucketParent>;
  StorageBucketUploadFileInput: StorageBucketUploadFileInput;
  StorageBucketUploadFileOnLinkInput: StorageBucketUploadFileOnLinkInput;
  StorageBucketUploadFileOnReferenceInput: StorageBucketUploadFileOnReferenceInput;
  StorageConfig: ResolverTypeWrapper<StorageConfig>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  SubspaceCreated: ResolverTypeWrapper<
    Omit<SubspaceCreated, 'subspace'> & { subspace: ResolversTypes['Space'] }
  >;
  Tagset: ResolverTypeWrapper<Tagset>;
  TagsetArgs: TagsetArgs;
  TagsetReservedName: TagsetReservedName;
  TagsetTemplate: ResolverTypeWrapper<TagsetTemplate>;
  TagsetType: TagsetType;
  Task: ResolverTypeWrapper<Task>;
  TaskStatus: TaskStatus;
  Template: ResolverTypeWrapper<
    Omit<
      Template,
      | 'callout'
      | 'communityGuidelines'
      | 'contentSpace'
      | 'profile'
      | 'whiteboard'
    > & {
      callout?: Maybe<ResolversTypes['Callout']>;
      communityGuidelines?: Maybe<ResolversTypes['CommunityGuidelines']>;
      contentSpace?: Maybe<ResolversTypes['TemplateContentSpace']>;
      profile: ResolversTypes['Profile'];
      whiteboard?: Maybe<ResolversTypes['Whiteboard']>;
    }
  >;
  TemplateContentSpace: ResolverTypeWrapper<
    Omit<TemplateContentSpace, 'about' | 'collaboration' | 'subspaces'> & {
      about: ResolversTypes['SpaceAbout'];
      collaboration: ResolversTypes['Collaboration'];
      subspaces: Array<ResolversTypes['TemplateContentSpace']>;
    }
  >;
  TemplateDefault: ResolverTypeWrapper<
    Omit<TemplateDefault, 'template'> & {
      template?: Maybe<ResolversTypes['Template']>;
    }
  >;
  TemplateDefaultType: TemplateDefaultType;
  TemplateResult: ResolverTypeWrapper<
    Omit<TemplateResult, 'innovationPack' | 'template'> & {
      innovationPack: ResolversTypes['InnovationPack'];
      template: ResolversTypes['Template'];
    }
  >;
  TemplateType: TemplateType;
  TemplatesManager: ResolverTypeWrapper<
    Omit<TemplatesManager, 'templateDefaults' | 'templatesSet'> & {
      templateDefaults: Array<ResolversTypes['TemplateDefault']>;
      templatesSet?: Maybe<ResolversTypes['TemplatesSet']>;
    }
  >;
  TemplatesSet: ResolverTypeWrapper<
    Omit<
      TemplatesSet,
      | 'calloutTemplates'
      | 'communityGuidelinesTemplates'
      | 'postTemplates'
      | 'spaceTemplates'
      | 'templates'
      | 'whiteboardTemplates'
    > & {
      calloutTemplates: Array<ResolversTypes['Template']>;
      communityGuidelinesTemplates: Array<ResolversTypes['Template']>;
      postTemplates: Array<ResolversTypes['Template']>;
      spaceTemplates: Array<ResolversTypes['Template']>;
      templates: Array<ResolversTypes['Template']>;
      whiteboardTemplates: Array<ResolversTypes['Template']>;
    }
  >;
  Timeline: ResolverTypeWrapper<
    Omit<Timeline, 'calendar'> & { calendar: ResolversTypes['Calendar'] }
  >;
  TransferAccountInnovationHubInput: TransferAccountInnovationHubInput;
  TransferAccountInnovationPackInput: TransferAccountInnovationPackInput;
  TransferAccountSpaceInput: TransferAccountSpaceInput;
  TransferAccountVirtualContributorInput: TransferAccountVirtualContributorInput;
  TransferCalloutInput: TransferCalloutInput;
  UUID: ResolverTypeWrapper<Scalars['UUID']['output']>;
  UpdateAiPersonaInput: UpdateAiPersonaInput;
  UpdateAiPersonaServiceInput: UpdateAiPersonaServiceInput;
  UpdateApplicationFormOnRoleSetInput: UpdateApplicationFormOnRoleSetInput;
  UpdateCalendarEventInput: UpdateCalendarEventInput;
  UpdateCalloutContributionDefaultsInput: UpdateCalloutContributionDefaultsInput;
  UpdateCalloutEntityInput: UpdateCalloutEntityInput;
  UpdateCalloutFramingInput: UpdateCalloutFramingInput;
  UpdateCalloutPublishInfoInput: UpdateCalloutPublishInfoInput;
  UpdateCalloutSettingsContributionInput: UpdateCalloutSettingsContributionInput;
  UpdateCalloutSettingsFramingInput: UpdateCalloutSettingsFramingInput;
  UpdateCalloutSettingsInput: UpdateCalloutSettingsInput;
  UpdateCalloutVisibilityInput: UpdateCalloutVisibilityInput;
  UpdateCalloutsSortOrderInput: UpdateCalloutsSortOrderInput;
  UpdateClassificationInput: UpdateClassificationInput;
  UpdateClassificationSelectTagsetValueInput: UpdateClassificationSelectTagsetValueInput;
  UpdateCollaborationFromSpaceTemplateInput: UpdateCollaborationFromSpaceTemplateInput;
  UpdateCommunityGuidelinesEntityInput: UpdateCommunityGuidelinesEntityInput;
  UpdateContributionCalloutsSortOrderInput: UpdateContributionCalloutsSortOrderInput;
  UpdateDiscussionInput: UpdateDiscussionInput;
  UpdateDocumentInput: UpdateDocumentInput;
  UpdateFormInput: UpdateFormInput;
  UpdateFormQuestionInput: UpdateFormQuestionInput;
  UpdateInnovationFlowCurrentStateInput: UpdateInnovationFlowCurrentStateInput;
  UpdateInnovationFlowInput: UpdateInnovationFlowInput;
  UpdateInnovationFlowStateInput: UpdateInnovationFlowStateInput;
  UpdateInnovationFlowStateSettingsInput: UpdateInnovationFlowStateSettingsInput;
  UpdateInnovationFlowStatesSortOrderInput: UpdateInnovationFlowStatesSortOrderInput;
  UpdateInnovationHubInput: UpdateInnovationHubInput;
  UpdateInnovationPackInput: UpdateInnovationPackInput;
  UpdateKnowledgeBaseInput: UpdateKnowledgeBaseInput;
  UpdateLicensePlanInput: UpdateLicensePlanInput;
  UpdateLinkInput: UpdateLinkInput;
  UpdateLocationInput: UpdateLocationInput;
  UpdateMemoEntityInput: UpdateMemoEntityInput;
  UpdateNotificationStateInput: UpdateNotificationStateInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOrganizationPlatformSettingsInput: UpdateOrganizationPlatformSettingsInput;
  UpdateOrganizationSettingsEntityInput: UpdateOrganizationSettingsEntityInput;
  UpdateOrganizationSettingsInput: UpdateOrganizationSettingsInput;
  UpdateOrganizationSettingsMembershipInput: UpdateOrganizationSettingsMembershipInput;
  UpdateOrganizationSettingsPrivacyInput: UpdateOrganizationSettingsPrivacyInput;
  UpdatePlatformSettingsInput: UpdatePlatformSettingsInput;
  UpdatePlatformSettingsIntegrationInput: UpdatePlatformSettingsIntegrationInput;
  UpdatePostInput: UpdatePostInput;
  UpdateProfileDirectInput: UpdateProfileDirectInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateReferenceInput: UpdateReferenceInput;
  UpdateSpaceAboutInput: UpdateSpaceAboutInput;
  UpdateSpaceInput: UpdateSpaceInput;
  UpdateSpacePlatformSettingsInput: UpdateSpacePlatformSettingsInput;
  UpdateSpaceSettingsCollaborationInput: UpdateSpaceSettingsCollaborationInput;
  UpdateSpaceSettingsEntityInput: UpdateSpaceSettingsEntityInput;
  UpdateSpaceSettingsInput: UpdateSpaceSettingsInput;
  UpdateSpaceSettingsMembershipInput: UpdateSpaceSettingsMembershipInput;
  UpdateSpaceSettingsPrivacyInput: UpdateSpaceSettingsPrivacyInput;
  UpdateTagsetInput: UpdateTagsetInput;
  UpdateTemplateContentSpaceInput: UpdateTemplateContentSpaceInput;
  UpdateTemplateDefaultTemplateInput: UpdateTemplateDefaultTemplateInput;
  UpdateTemplateFromSpaceInput: UpdateTemplateFromSpaceInput;
  UpdateTemplateInput: UpdateTemplateInput;
  UpdateUserGroupInput: UpdateUserGroupInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserPlatformSettingsInput: UpdateUserPlatformSettingsInput;
  UpdateUserSettingsCommunicationInput: UpdateUserSettingsCommunicationInput;
  UpdateUserSettingsEntityInput: UpdateUserSettingsEntityInput;
  UpdateUserSettingsInput: UpdateUserSettingsInput;
  UpdateUserSettingsNotificationInput: UpdateUserSettingsNotificationInput;
  UpdateUserSettingsNotificationOrganizationInput: UpdateUserSettingsNotificationOrganizationInput;
  UpdateUserSettingsNotificationPlatformInput: UpdateUserSettingsNotificationPlatformInput;
  UpdateUserSettingsNotificationSpaceInput: UpdateUserSettingsNotificationSpaceInput;
  UpdateUserSettingsNotificationUserInput: UpdateUserSettingsNotificationUserInput;
  UpdateUserSettingsPrivacyInput: UpdateUserSettingsPrivacyInput;
  UpdateVirtualContributorInput: UpdateVirtualContributorInput;
  UpdateVirtualContributorSettingsEntityInput: UpdateVirtualContributorSettingsEntityInput;
  UpdateVirtualContributorSettingsInput: UpdateVirtualContributorSettingsInput;
  UpdateVirtualContributorSettingsPrivacyInput: UpdateVirtualContributorSettingsPrivacyInput;
  UpdateVisualInput: UpdateVisualInput;
  UpdateWhiteboardEntityInput: UpdateWhiteboardEntityInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  UrlResolverQueryResultCalendar: ResolverTypeWrapper<UrlResolverQueryResultCalendar>;
  UrlResolverQueryResultCalloutsSet: ResolverTypeWrapper<UrlResolverQueryResultCalloutsSet>;
  UrlResolverQueryResultCollaboration: ResolverTypeWrapper<UrlResolverQueryResultCollaboration>;
  UrlResolverQueryResultInnovationPack: ResolverTypeWrapper<UrlResolverQueryResultInnovationPack>;
  UrlResolverQueryResultSpace: ResolverTypeWrapper<UrlResolverQueryResultSpace>;
  UrlResolverQueryResultTemplatesSet: ResolverTypeWrapper<UrlResolverQueryResultTemplatesSet>;
  UrlResolverQueryResultVirtualContributor: ResolverTypeWrapper<UrlResolverQueryResultVirtualContributor>;
  UrlResolverQueryResults: ResolverTypeWrapper<UrlResolverQueryResults>;
  UrlType: UrlType;
  User: ResolverTypeWrapper<
    Omit<
      User,
      'account' | 'communityRooms' | 'directRooms' | 'guidanceRoom' | 'profile'
    > & {
      account?: Maybe<ResolversTypes['Account']>;
      communityRooms?: Maybe<Array<ResolversTypes['CommunicationRoom']>>;
      directRooms?: Maybe<Array<ResolversTypes['DirectRoom']>>;
      guidanceRoom?: Maybe<ResolversTypes['Room']>;
      profile: ResolversTypes['Profile'];
    }
  >;
  UserAuthenticationResult: ResolverTypeWrapper<UserAuthenticationResult>;
  UserAuthorizationPrivilegesInput: UserAuthorizationPrivilegesInput;
  UserAuthorizationResetInput: UserAuthorizationResetInput;
  UserFilterInput: UserFilterInput;
  UserGroup: ResolverTypeWrapper<
    Omit<UserGroup, 'members' | 'parent' | 'profile'> & {
      members?: Maybe<Array<ResolversTypes['User']>>;
      parent?: Maybe<ResolversTypes['Groupable']>;
      profile?: Maybe<ResolversTypes['Profile']>;
    }
  >;
  UserSendMessageInput: UserSendMessageInput;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserSettingsCommunication: ResolverTypeWrapper<UserSettingsCommunication>;
  UserSettingsNotification: ResolverTypeWrapper<UserSettingsNotification>;
  UserSettingsNotificationOrganization: ResolverTypeWrapper<UserSettingsNotificationOrganization>;
  UserSettingsNotificationPlatform: ResolverTypeWrapper<UserSettingsNotificationPlatform>;
  UserSettingsNotificationSpace: ResolverTypeWrapper<UserSettingsNotificationSpace>;
  UserSettingsNotificationUser: ResolverTypeWrapper<UserSettingsNotificationUser>;
  UserSettingsPrivacy: ResolverTypeWrapper<UserSettingsPrivacy>;
  UsersInRolesResponse: ResolverTypeWrapper<
    Omit<UsersInRolesResponse, 'users'> & {
      users: Array<ResolversTypes['User']>;
    }
  >;
  UsersWithAuthorizationCredentialInput: UsersWithAuthorizationCredentialInput;
  VcInteraction: ResolverTypeWrapper<
    Omit<VcInteraction, 'room'> & { room: ResolversTypes['Room'] }
  >;
  VerifiedCredential: ResolverTypeWrapper<VerifiedCredential>;
  VerifiedCredentialClaim: ResolverTypeWrapper<VerifiedCredentialClaim>;
  VirtualContributor: ResolverTypeWrapper<
    Omit<
      VirtualContributor,
      'account' | 'knowledgeBase' | 'profile' | 'provider'
    > & {
      account?: Maybe<ResolversTypes['Account']>;
      knowledgeBase?: Maybe<ResolversTypes['KnowledgeBase']>;
      profile: ResolversTypes['Profile'];
      provider: ResolversTypes['Contributor'];
    }
  >;
  VirtualContributorSettings: ResolverTypeWrapper<VirtualContributorSettings>;
  VirtualContributorSettingsPrivacy: ResolverTypeWrapper<VirtualContributorSettingsPrivacy>;
  VirtualContributorStatus: VirtualContributorStatus;
  VirtualContributorUpdatedSubscriptionResult: ResolverTypeWrapper<
    Omit<VirtualContributorUpdatedSubscriptionResult, 'virtualContributor'> & {
      virtualContributor: ResolversTypes['VirtualContributor'];
    }
  >;
  VirtualContributorsInRolesResponse: ResolverTypeWrapper<
    Omit<VirtualContributorsInRolesResponse, 'virtualContributors'> & {
      virtualContributors: Array<ResolversTypes['VirtualContributor']>;
    }
  >;
  Visual: ResolverTypeWrapper<Visual>;
  VisualConstraints: ResolverTypeWrapper<VisualConstraints>;
  VisualType: VisualType;
  VisualUploadImageInput: VisualUploadImageInput;
  Whiteboard: ResolverTypeWrapper<
    Omit<Whiteboard, 'createdBy' | 'profile'> & {
      createdBy?: Maybe<ResolversTypes['User']>;
      profile: ResolversTypes['Profile'];
    }
  >;
  WhiteboardContent: ResolverTypeWrapper<
    Scalars['WhiteboardContent']['output']
  >;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  APM: Apm;
  Account: Omit<
    Account,
    | 'host'
    | 'innovationHubs'
    | 'innovationPacks'
    | 'spaces'
    | 'virtualContributors'
  > & {
    host?: Maybe<ResolversParentTypes['Contributor']>;
    innovationHubs: Array<ResolversParentTypes['InnovationHub']>;
    innovationPacks: Array<ResolversParentTypes['InnovationPack']>;
    spaces: Array<ResolversParentTypes['Space']>;
    virtualContributors: Array<ResolversParentTypes['VirtualContributor']>;
  };
  AccountAuthorizationResetInput: AccountAuthorizationResetInput;
  AccountLicenseResetInput: AccountLicenseResetInput;
  AccountSubscription: AccountSubscription;
  ActivityCreatedSubscriptionInput: ActivityCreatedSubscriptionInput;
  ActivityCreatedSubscriptionResult: Omit<
    ActivityCreatedSubscriptionResult,
    'activity'
  > & { activity: ResolversParentTypes['ActivityLogEntry'] };
  ActivityFeed: Omit<ActivityFeed, 'activityFeed' | 'pageInfo'> & {
    activityFeed: Array<ResolversParentTypes['ActivityLogEntry']>;
    pageInfo: ResolversParentTypes['PageInfo'];
  };
  ActivityFeedGroupedQueryArgs: ActivityFeedGroupedQueryArgs;
  ActivityFeedQueryArgs: ActivityFeedQueryArgs;
  ActivityLogEntry: ResolversInterfaceTypes<ResolversParentTypes>['ActivityLogEntry'];
  ActivityLogEntryCalendarEventCreated: Omit<
    ActivityLogEntryCalendarEventCreated,
    'calendar' | 'calendarEvent' | 'space' | 'triggeredBy'
  > & {
    calendar: ResolversParentTypes['Calendar'];
    calendarEvent: ResolversParentTypes['CalendarEvent'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
  };
  ActivityLogEntryCalloutDiscussionComment: Omit<
    ActivityLogEntryCalloutDiscussionComment,
    'callout' | 'space' | 'triggeredBy'
  > & {
    callout: ResolversParentTypes['Callout'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
  };
  ActivityLogEntryCalloutLinkCreated: Omit<
    ActivityLogEntryCalloutLinkCreated,
    'callout' | 'link' | 'space' | 'triggeredBy'
  > & {
    callout: ResolversParentTypes['Callout'];
    link: ResolversParentTypes['Link'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
  };
  ActivityLogEntryCalloutPostComment: Omit<
    ActivityLogEntryCalloutPostComment,
    'callout' | 'post' | 'space' | 'triggeredBy'
  > & {
    callout: ResolversParentTypes['Callout'];
    post: ResolversParentTypes['Post'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
  };
  ActivityLogEntryCalloutPostCreated: Omit<
    ActivityLogEntryCalloutPostCreated,
    'callout' | 'post' | 'space' | 'triggeredBy'
  > & {
    callout: ResolversParentTypes['Callout'];
    post: ResolversParentTypes['Post'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
  };
  ActivityLogEntryCalloutPublished: Omit<
    ActivityLogEntryCalloutPublished,
    'callout' | 'space' | 'triggeredBy'
  > & {
    callout: ResolversParentTypes['Callout'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
  };
  ActivityLogEntryCalloutWhiteboardContentModified: Omit<
    ActivityLogEntryCalloutWhiteboardContentModified,
    'callout' | 'space' | 'triggeredBy' | 'whiteboard'
  > & {
    callout: ResolversParentTypes['Callout'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
    whiteboard: ResolversParentTypes['Whiteboard'];
  };
  ActivityLogEntryCalloutWhiteboardCreated: Omit<
    ActivityLogEntryCalloutWhiteboardCreated,
    'callout' | 'space' | 'triggeredBy' | 'whiteboard'
  > & {
    callout: ResolversParentTypes['Callout'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
    whiteboard: ResolversParentTypes['Whiteboard'];
  };
  ActivityLogEntryMemberJoined: Omit<
    ActivityLogEntryMemberJoined,
    'community' | 'contributor' | 'space' | 'triggeredBy'
  > & {
    community: ResolversParentTypes['Community'];
    contributor: ResolversParentTypes['Contributor'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
  };
  ActivityLogEntrySubspaceCreated: Omit<
    ActivityLogEntrySubspaceCreated,
    'space' | 'subspace' | 'triggeredBy'
  > & {
    space?: Maybe<ResolversParentTypes['Space']>;
    subspace: ResolversParentTypes['Space'];
    triggeredBy: ResolversParentTypes['User'];
  };
  ActivityLogEntryUpdateSent: Omit<
    ActivityLogEntryUpdateSent,
    'space' | 'triggeredBy' | 'updates'
  > & {
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy: ResolversParentTypes['User'];
    updates: ResolversParentTypes['Room'];
  };
  ActivityLogInput: ActivityLogInput;
  Agent: Agent;
  AgentBeginVerifiedCredentialOfferOutput: AgentBeginVerifiedCredentialOfferOutput;
  AgentBeginVerifiedCredentialRequestOutput: AgentBeginVerifiedCredentialRequestOutput;
  AiPersona: AiPersona;
  AiPersonaModelCard: AiPersonaModelCard;
  AiPersonaModelCardFlag: AiPersonaModelCardFlag;
  AiPersonaService: AiPersonaService;
  AiServer: AiServer;
  Application: Omit<Application, 'contributor'> & {
    contributor: ResolversParentTypes['Contributor'];
  };
  ApplicationEventInput: ApplicationEventInput;
  ApplyForEntryRoleOnRoleSetInput: ApplyForEntryRoleOnRoleSetInput;
  AssignLicensePlanToAccount: AssignLicensePlanToAccount;
  AssignLicensePlanToSpace: AssignLicensePlanToSpace;
  AssignPlatformRoleInput: AssignPlatformRoleInput;
  AssignRoleOnRoleSetToOrganizationInput: AssignRoleOnRoleSetToOrganizationInput;
  AssignRoleOnRoleSetToUserInput: AssignRoleOnRoleSetToUserInput;
  AssignRoleOnRoleSetToVirtualContributorInput: AssignRoleOnRoleSetToVirtualContributorInput;
  AssignUserGroupMemberInput: AssignUserGroupMemberInput;
  AuthenticationConfig: Omit<AuthenticationConfig, 'providers'> & {
    providers: Array<ResolversParentTypes['AuthenticationProviderConfig']>;
  };
  AuthenticationProviderConfig: Omit<AuthenticationProviderConfig, 'config'> & {
    config: ResolversParentTypes['AuthenticationProviderConfigUnion'];
  };
  AuthenticationProviderConfigUnion: ResolversUnionTypes<ResolversParentTypes>['AuthenticationProviderConfigUnion'];
  Authorization: Authorization;
  AuthorizationPolicyRuleCredential: AuthorizationPolicyRuleCredential;
  AuthorizationPolicyRulePrivilege: AuthorizationPolicyRulePrivilege;
  AuthorizationPolicyRuleVerifiedCredential: AuthorizationPolicyRuleVerifiedCredential;
  Boolean: Scalars['Boolean']['output'];
  Calendar: Omit<Calendar, 'event' | 'events'> & {
    event?: Maybe<ResolversParentTypes['CalendarEvent']>;
    events: Array<ResolversParentTypes['CalendarEvent']>;
  };
  CalendarEvent: Omit<
    CalendarEvent,
    'comments' | 'createdBy' | 'profile' | 'subspace'
  > & {
    comments: ResolversParentTypes['Room'];
    createdBy?: Maybe<ResolversParentTypes['User']>;
    profile: ResolversParentTypes['Profile'];
    subspace?: Maybe<ResolversParentTypes['Space']>;
  };
  Callout: Omit<
    Callout,
    | 'classification'
    | 'comments'
    | 'contributions'
    | 'createdBy'
    | 'framing'
    | 'posts'
    | 'publishedBy'
  > & {
    classification?: Maybe<ResolversParentTypes['Classification']>;
    comments?: Maybe<ResolversParentTypes['Room']>;
    contributions: Array<ResolversParentTypes['CalloutContribution']>;
    createdBy?: Maybe<ResolversParentTypes['User']>;
    framing: ResolversParentTypes['CalloutFraming'];
    posts?: Maybe<Array<ResolversParentTypes['Post']>>;
    publishedBy?: Maybe<ResolversParentTypes['User']>;
  };
  CalloutContribution: Omit<
    CalloutContribution,
    'createdBy' | 'link' | 'post' | 'whiteboard'
  > & {
    createdBy?: Maybe<ResolversParentTypes['User']>;
    link?: Maybe<ResolversParentTypes['Link']>;
    post?: Maybe<ResolversParentTypes['Post']>;
    whiteboard?: Maybe<ResolversParentTypes['Whiteboard']>;
  };
  CalloutContributionDefaults: CalloutContributionDefaults;
  CalloutFraming: Omit<
    CalloutFraming,
    'link' | 'memo' | 'profile' | 'whiteboard'
  > & {
    link?: Maybe<ResolversParentTypes['Link']>;
    memo?: Maybe<ResolversParentTypes['Memo']>;
    profile: ResolversParentTypes['Profile'];
    whiteboard?: Maybe<ResolversParentTypes['Whiteboard']>;
  };
  CalloutPostCreated: Omit<CalloutPostCreated, 'post'> & {
    post: ResolversParentTypes['Post'];
  };
  CalloutSettings: CalloutSettings;
  CalloutSettingsContribution: CalloutSettingsContribution;
  CalloutSettingsFraming: CalloutSettingsFraming;
  CalloutsSet: Omit<CalloutsSet, 'callouts'> & {
    callouts: Array<ResolversParentTypes['Callout']>;
  };
  ChatGuidanceAnswerRelevanceInput: ChatGuidanceAnswerRelevanceInput;
  ChatGuidanceInput: ChatGuidanceInput;
  Classification: Classification;
  Collaboration: Omit<
    Collaboration,
    'calloutsSet' | 'innovationFlow' | 'timeline'
  > & {
    calloutsSet: ResolversParentTypes['CalloutsSet'];
    innovationFlow: ResolversParentTypes['InnovationFlow'];
    timeline: ResolversParentTypes['Timeline'];
  };
  Communication: Omit<Communication, 'updates'> & {
    updates: ResolversParentTypes['Room'];
  };
  CommunicationAdminEnsureAccessInput: CommunicationAdminEnsureAccessInput;
  CommunicationAdminMembershipInput: CommunicationAdminMembershipInput;
  CommunicationAdminMembershipResult: CommunicationAdminMembershipResult;
  CommunicationAdminOrphanedUsageResult: CommunicationAdminOrphanedUsageResult;
  CommunicationAdminRemoveOrphanedRoomInput: CommunicationAdminRemoveOrphanedRoomInput;
  CommunicationAdminRoomMembershipResult: CommunicationAdminRoomMembershipResult;
  CommunicationAdminRoomResult: CommunicationAdminRoomResult;
  CommunicationAdminUpdateRoomStateInput: CommunicationAdminUpdateRoomStateInput;
  CommunicationRoom: Omit<CommunicationRoom, 'messages'> & {
    messages: Array<ResolversParentTypes['Message']>;
  };
  CommunicationSendMessageToCommunityLeadsInput: CommunicationSendMessageToCommunityLeadsInput;
  CommunicationSendMessageToOrganizationInput: CommunicationSendMessageToOrganizationInput;
  CommunicationSendMessageToUserInput: CommunicationSendMessageToUserInput;
  Community: Omit<
    Community,
    'communication' | 'group' | 'groups' | 'roleSet'
  > & {
    communication: ResolversParentTypes['Communication'];
    group: ResolversParentTypes['UserGroup'];
    groups: Array<ResolversParentTypes['UserGroup']>;
    roleSet: ResolversParentTypes['RoleSet'];
  };
  CommunityApplicationForRoleResult: CommunityApplicationForRoleResult;
  CommunityApplicationResult: Omit<
    CommunityApplicationResult,
    'application' | 'spacePendingMembershipInfo'
  > & {
    application: ResolversParentTypes['Application'];
    spacePendingMembershipInfo: ResolversParentTypes['SpacePendingMembershipInfo'];
  };
  CommunityGuidelines: Omit<CommunityGuidelines, 'profile'> & {
    profile: ResolversParentTypes['Profile'];
  };
  CommunityInvitationForRoleResult: CommunityInvitationForRoleResult;
  CommunityInvitationResult: Omit<
    CommunityInvitationResult,
    'invitation' | 'spacePendingMembershipInfo'
  > & {
    invitation: ResolversParentTypes['Invitation'];
    spacePendingMembershipInfo: ResolversParentTypes['SpacePendingMembershipInfo'];
  };
  CommunityMembershipResult: Omit<
    CommunityMembershipResult,
    'childMemberships' | 'space'
  > & {
    childMemberships: Array<ResolversParentTypes['CommunityMembershipResult']>;
    space: ResolversParentTypes['Space'];
  };
  Config: Omit<Config, 'authentication'> & {
    authentication: ResolversParentTypes['AuthenticationConfig'];
  };
  Contributor: ResolversInterfaceTypes<ResolversParentTypes>['Contributor'];
  ContributorFilterInput: ContributorFilterInput;
  ContributorRolePolicy: ContributorRolePolicy;
  ContributorRoles: ContributorRoles;
  ConversionVcSpaceToVcKnowledgeBaseInput: ConversionVcSpaceToVcKnowledgeBaseInput;
  ConvertSpaceL1ToSpaceL0Input: ConvertSpaceL1ToSpaceL0Input;
  ConvertSpaceL1ToSpaceL2Input: ConvertSpaceL1ToSpaceL2Input;
  ConvertSpaceL2ToSpaceL1Input: ConvertSpaceL2ToSpaceL1Input;
  CreateAiPersonaInput: CreateAiPersonaInput;
  CreateAiPersonaServiceInput: CreateAiPersonaServiceInput;
  CreateCalendarEventOnCalendarInput: CreateCalendarEventOnCalendarInput;
  CreateCalloutContributionData: CreateCalloutContributionData;
  CreateCalloutContributionDefaultsData: CreateCalloutContributionDefaultsData;
  CreateCalloutContributionDefaultsInput: CreateCalloutContributionDefaultsInput;
  CreateCalloutContributionInput: CreateCalloutContributionInput;
  CreateCalloutData: CreateCalloutData;
  CreateCalloutFramingData: CreateCalloutFramingData;
  CreateCalloutFramingInput: CreateCalloutFramingInput;
  CreateCalloutInput: CreateCalloutInput;
  CreateCalloutOnCalloutsSetInput: CreateCalloutOnCalloutsSetInput;
  CreateCalloutSettingsContributionData: CreateCalloutSettingsContributionData;
  CreateCalloutSettingsContributionInput: CreateCalloutSettingsContributionInput;
  CreateCalloutSettingsData: CreateCalloutSettingsData;
  CreateCalloutSettingsFramingData: CreateCalloutSettingsFramingData;
  CreateCalloutSettingsFramingInput: CreateCalloutSettingsFramingInput;
  CreateCalloutSettingsInput: CreateCalloutSettingsInput;
  CreateCalloutsSetData: CreateCalloutsSetData;
  CreateCalloutsSetInput: CreateCalloutsSetInput;
  CreateClassificationData: CreateClassificationData;
  CreateClassificationInput: CreateClassificationInput;
  CreateCollaborationData: CreateCollaborationData;
  CreateCollaborationInput: CreateCollaborationInput;
  CreateCollaborationOnSpaceInput: CreateCollaborationOnSpaceInput;
  CreateCommunityGuidelinesData: CreateCommunityGuidelinesData;
  CreateCommunityGuidelinesInput: CreateCommunityGuidelinesInput;
  CreateContributionOnCalloutInput: CreateContributionOnCalloutInput;
  CreateInnovationFlowData: CreateInnovationFlowData;
  CreateInnovationFlowInput: CreateInnovationFlowInput;
  CreateInnovationFlowStateData: CreateInnovationFlowStateData;
  CreateInnovationFlowStateInput: CreateInnovationFlowStateInput;
  CreateInnovationFlowStateSettingsData: CreateInnovationFlowStateSettingsData;
  CreateInnovationFlowStateSettingsInput: CreateInnovationFlowStateSettingsInput;
  CreateInnovationHubOnAccountInput: CreateInnovationHubOnAccountInput;
  CreateInnovationPackOnAccountInput: CreateInnovationPackOnAccountInput;
  CreateKnowledgeBaseInput: CreateKnowledgeBaseInput;
  CreateLicensePlanOnLicensingFrameworkInput: CreateLicensePlanOnLicensingFrameworkInput;
  CreateLinkData: CreateLinkData;
  CreateLinkInput: CreateLinkInput;
  CreateLocationData: CreateLocationData;
  CreateLocationInput: CreateLocationInput;
  CreateMemoData: CreateMemoData;
  CreateMemoInput: CreateMemoInput;
  CreateNVPInput: CreateNvpInput;
  CreateOrganizationInput: CreateOrganizationInput;
  CreatePostData: CreatePostData;
  CreatePostInput: CreatePostInput;
  CreateProfileData: CreateProfileData;
  CreateProfileInput: CreateProfileInput;
  CreateReferenceData: CreateReferenceData;
  CreateReferenceInput: CreateReferenceInput;
  CreateReferenceOnProfileInput: CreateReferenceOnProfileInput;
  CreateSpaceAboutInput: CreateSpaceAboutInput;
  CreateSpaceOnAccountInput: CreateSpaceOnAccountInput;
  CreateSpaceSettingsCollaborationInput: CreateSpaceSettingsCollaborationInput;
  CreateSpaceSettingsInput: CreateSpaceSettingsInput;
  CreateSpaceSettingsMembershipInput: CreateSpaceSettingsMembershipInput;
  CreateSpaceSettingsPrivacyInput: CreateSpaceSettingsPrivacyInput;
  CreateStateOnInnovationFlowInput: CreateStateOnInnovationFlowInput;
  CreateSubspaceInput: CreateSubspaceInput;
  CreateTagsetData: CreateTagsetData;
  CreateTagsetInput: CreateTagsetInput;
  CreateTagsetOnProfileInput: CreateTagsetOnProfileInput;
  CreateTemplateContentSpaceInput: CreateTemplateContentSpaceInput;
  CreateTemplateFromContentSpaceOnTemplatesSetInput: CreateTemplateFromContentSpaceOnTemplatesSetInput;
  CreateTemplateFromSpaceOnTemplatesSetInput: CreateTemplateFromSpaceOnTemplatesSetInput;
  CreateTemplateOnTemplatesSetInput: CreateTemplateOnTemplatesSetInput;
  CreateUserGroupInput: CreateUserGroupInput;
  CreateUserInput: CreateUserInput;
  CreateVirtualContributorOnAccountInput: CreateVirtualContributorOnAccountInput;
  CreateVisualOnProfileData: CreateVisualOnProfileData;
  CreateVisualOnProfileInput: CreateVisualOnProfileInput;
  CreateWhiteboardData: CreateWhiteboardData;
  CreateWhiteboardInput: CreateWhiteboardInput;
  Credential: Credential;
  CredentialDefinition: CredentialDefinition;
  CredentialMetadataOutput: CredentialMetadataOutput;
  DID: Scalars['DID']['output'];
  DateTime: Scalars['DateTime']['output'];
  DeleteAiPersonaServiceInput: DeleteAiPersonaServiceInput;
  DeleteApplicationInput: DeleteApplicationInput;
  DeleteCalendarEventInput: DeleteCalendarEventInput;
  DeleteCalloutInput: DeleteCalloutInput;
  DeleteDiscussionInput: DeleteDiscussionInput;
  DeleteDocumentInput: DeleteDocumentInput;
  DeleteInnovationHubInput: DeleteInnovationHubInput;
  DeleteInnovationPackInput: DeleteInnovationPackInput;
  DeleteInvitationInput: DeleteInvitationInput;
  DeleteLicensePlanInput: DeleteLicensePlanInput;
  DeleteLinkInput: DeleteLinkInput;
  DeleteMemoInput: DeleteMemoInput;
  DeleteOrganizationInput: DeleteOrganizationInput;
  DeletePlatformInvitationInput: DeletePlatformInvitationInput;
  DeletePostInput: DeletePostInput;
  DeleteReferenceInput: DeleteReferenceInput;
  DeleteSpaceInput: DeleteSpaceInput;
  DeleteStateOnInnovationFlowInput: DeleteStateOnInnovationFlowInput;
  DeleteStorageBuckeetInput: DeleteStorageBuckeetInput;
  DeleteTemplateInput: DeleteTemplateInput;
  DeleteUserGroupInput: DeleteUserGroupInput;
  DeleteUserInput: DeleteUserInput;
  DeleteVirtualContributorInput: DeleteVirtualContributorInput;
  DeleteWhiteboardInput: DeleteWhiteboardInput;
  DirectRoom: Omit<DirectRoom, 'messages'> & {
    messages: Array<ResolversParentTypes['Message']>;
  };
  Discussion: Omit<Discussion, 'comments' | 'profile'> & {
    comments: ResolversParentTypes['Room'];
    profile: ResolversParentTypes['Profile'];
  };
  DiscussionsInput: DiscussionsInput;
  Document: Omit<Document, 'createdBy'> & {
    createdBy?: Maybe<ResolversParentTypes['User']>;
  };
  Emoji: Scalars['Emoji']['output'];
  ExploreSpacesInput: ExploreSpacesInput;
  ExternalConfig: ExternalConfig;
  ExternalConfigInput: ExternalConfigInput;
  FileStorageConfig: FileStorageConfig;
  Float: Scalars['Float']['output'];
  Form: Form;
  FormQuestion: FormQuestion;
  Forum: Omit<Forum, 'discussion' | 'discussions'> & {
    discussion?: Maybe<ResolversParentTypes['Discussion']>;
    discussions?: Maybe<Array<ResolversParentTypes['Discussion']>>;
  };
  ForumCreateDiscussionInput: ForumCreateDiscussionInput;
  Geo: Geo;
  GeoLocation: GeoLocation;
  GrantAuthorizationCredentialInput: GrantAuthorizationCredentialInput;
  GrantOrganizationAuthorizationCredentialInput: GrantOrganizationAuthorizationCredentialInput;
  Groupable: ResolversInterfaceTypes<ResolversParentTypes>['Groupable'];
  ISearchCategoryResult: Omit<ISearchCategoryResult, 'results'> & {
    results: Array<ResolversParentTypes['SearchResult']>;
  };
  ISearchResults: Omit<
    ISearchResults,
    | 'calloutResults'
    | 'contributionResults'
    | 'contributorResults'
    | 'spaceResults'
  > & {
    calloutResults: ResolversParentTypes['ISearchCategoryResult'];
    contributionResults: ResolversParentTypes['ISearchCategoryResult'];
    contributorResults: ResolversParentTypes['ISearchCategoryResult'];
    spaceResults: ResolversParentTypes['ISearchCategoryResult'];
  };
  InAppNotification: ResolversInterfaceTypes<ResolversParentTypes>['InAppNotification'];
  InAppNotificationCalloutPublished: Omit<
    InAppNotificationCalloutPublished,
    'callout' | 'receiver' | 'space' | 'triggeredBy'
  > & {
    callout?: Maybe<ResolversParentTypes['Callout']>;
    receiver: ResolversParentTypes['Contributor'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy?: Maybe<ResolversParentTypes['Contributor']>;
  };
  InAppNotificationCommunityNewMember: Omit<
    InAppNotificationCommunityNewMember,
    'actor' | 'receiver' | 'space' | 'triggeredBy'
  > & {
    actor?: Maybe<ResolversParentTypes['Contributor']>;
    receiver: ResolversParentTypes['Contributor'];
    space?: Maybe<ResolversParentTypes['Space']>;
    triggeredBy?: Maybe<ResolversParentTypes['Contributor']>;
  };
  InAppNotificationUserMentioned: Omit<
    InAppNotificationUserMentioned,
    'receiver' | 'triggeredBy'
  > & {
    receiver: ResolversParentTypes['Contributor'];
    triggeredBy?: Maybe<ResolversParentTypes['Contributor']>;
  };
  InnovationFlow: Omit<InnovationFlow, 'profile'> & {
    profile: ResolversParentTypes['Profile'];
  };
  InnovationFlowSettings: InnovationFlowSettings;
  InnovationFlowState: InnovationFlowState;
  InnovationFlowStateSettings: InnovationFlowStateSettings;
  InnovationHub: Omit<
    InnovationHub,
    'account' | 'profile' | 'provider' | 'spaceListFilter'
  > & {
    account: ResolversParentTypes['Account'];
    profile: ResolversParentTypes['Profile'];
    provider: ResolversParentTypes['Contributor'];
    spaceListFilter?: Maybe<Array<ResolversParentTypes['Space']>>;
  };
  InnovationPack: Omit<
    InnovationPack,
    'profile' | 'provider' | 'templatesSet'
  > & {
    profile: ResolversParentTypes['Profile'];
    provider: ResolversParentTypes['Contributor'];
    templatesSet?: Maybe<ResolversParentTypes['TemplatesSet']>;
  };
  InnovationPacksInput: InnovationPacksInput;
  InputCreatorQueryResults: InputCreatorQueryResults;
  Int: Scalars['Int']['output'];
  Invitation: Omit<Invitation, 'contributor' | 'createdBy'> & {
    contributor: ResolversParentTypes['Contributor'];
    createdBy?: Maybe<ResolversParentTypes['User']>;
  };
  InvitationEventInput: InvitationEventInput;
  InviteForEntryRoleOnRoleSetInput: InviteForEntryRoleOnRoleSetInput;
  JSON: Scalars['JSON']['output'];
  JoinAsEntryRoleOnRoleSetInput: JoinAsEntryRoleOnRoleSetInput;
  KnowledgeBase: Omit<KnowledgeBase, 'calloutsSet' | 'profile'> & {
    calloutsSet: ResolversParentTypes['CalloutsSet'];
    profile: ResolversParentTypes['Profile'];
  };
  LatestReleaseDiscussion: LatestReleaseDiscussion;
  Library: Omit<
    Library,
    'innovationHubs' | 'innovationPacks' | 'templates' | 'virtualContributors'
  > & {
    innovationHubs: Array<ResolversParentTypes['InnovationHub']>;
    innovationPacks: Array<ResolversParentTypes['InnovationPack']>;
    templates: Array<ResolversParentTypes['TemplateResult']>;
    virtualContributors: Array<ResolversParentTypes['VirtualContributor']>;
  };
  LibraryTemplatesFilterInput: LibraryTemplatesFilterInput;
  License: License;
  LicenseEntitlement: LicenseEntitlement;
  LicensePlan: LicensePlan;
  LicensePolicy: LicensePolicy;
  Licensing: Licensing;
  LicensingCredentialBasedPolicyCredentialRule: LicensingCredentialBasedPolicyCredentialRule;
  LicensingGrantedEntitlement: LicensingGrantedEntitlement;
  Lifecycle: Lifecycle;
  LifecycleDefinition: Scalars['LifecycleDefinition']['output'];
  Link: Omit<Link, 'profile'> & { profile: ResolversParentTypes['Profile'] };
  Location: Location;
  LookupByNameQueryResults: Omit<LookupByNameQueryResults, 'space'> & {
    space?: Maybe<ResolversParentTypes['Space']>;
  };
  LookupMyPrivilegesQueryResults: LookupMyPrivilegesQueryResults;
  LookupQueryResults: Omit<
    LookupQueryResults,
    | 'about'
    | 'account'
    | 'application'
    | 'calendar'
    | 'calendarEvent'
    | 'callout'
    | 'calloutsSet'
    | 'collaboration'
    | 'community'
    | 'communityGuidelines'
    | 'document'
    | 'innovationFlow'
    | 'innovationHub'
    | 'innovationPack'
    | 'invitation'
    | 'knowledgeBase'
    | 'memo'
    | 'organization'
    | 'platformInvitation'
    | 'post'
    | 'profile'
    | 'roleSet'
    | 'room'
    | 'space'
    | 'storageBucket'
    | 'template'
    | 'templateContentSpace'
    | 'templatesManager'
    | 'templatesSet'
    | 'user'
    | 'virtualContributor'
    | 'whiteboard'
  > & {
    about?: Maybe<ResolversParentTypes['SpaceAbout']>;
    account?: Maybe<ResolversParentTypes['Account']>;
    application?: Maybe<ResolversParentTypes['Application']>;
    calendar?: Maybe<ResolversParentTypes['Calendar']>;
    calendarEvent?: Maybe<ResolversParentTypes['CalendarEvent']>;
    callout?: Maybe<ResolversParentTypes['Callout']>;
    calloutsSet?: Maybe<ResolversParentTypes['CalloutsSet']>;
    collaboration?: Maybe<ResolversParentTypes['Collaboration']>;
    community?: Maybe<ResolversParentTypes['Community']>;
    communityGuidelines?: Maybe<ResolversParentTypes['CommunityGuidelines']>;
    document?: Maybe<ResolversParentTypes['Document']>;
    innovationFlow?: Maybe<ResolversParentTypes['InnovationFlow']>;
    innovationHub?: Maybe<ResolversParentTypes['InnovationHub']>;
    innovationPack?: Maybe<ResolversParentTypes['InnovationPack']>;
    invitation?: Maybe<ResolversParentTypes['Invitation']>;
    knowledgeBase: ResolversParentTypes['KnowledgeBase'];
    memo?: Maybe<ResolversParentTypes['Memo']>;
    organization?: Maybe<ResolversParentTypes['Organization']>;
    platformInvitation?: Maybe<ResolversParentTypes['PlatformInvitation']>;
    post?: Maybe<ResolversParentTypes['Post']>;
    profile?: Maybe<ResolversParentTypes['Profile']>;
    roleSet?: Maybe<ResolversParentTypes['RoleSet']>;
    room?: Maybe<ResolversParentTypes['Room']>;
    space?: Maybe<ResolversParentTypes['Space']>;
    storageBucket?: Maybe<ResolversParentTypes['StorageBucket']>;
    template?: Maybe<ResolversParentTypes['Template']>;
    templateContentSpace?: Maybe<ResolversParentTypes['TemplateContentSpace']>;
    templatesManager?: Maybe<ResolversParentTypes['TemplatesManager']>;
    templatesSet?: Maybe<ResolversParentTypes['TemplatesSet']>;
    user?: Maybe<ResolversParentTypes['User']>;
    virtualContributor?: Maybe<ResolversParentTypes['VirtualContributor']>;
    whiteboard?: Maybe<ResolversParentTypes['Whiteboard']>;
  };
  Markdown: Scalars['Markdown']['output'];
  MeQueryResults: Omit<
    MeQueryResults,
    | 'communityApplications'
    | 'communityInvitations'
    | 'mySpaces'
    | 'spaceMembershipsFlat'
    | 'spaceMembershipsHierarchical'
    | 'user'
  > & {
    communityApplications: Array<
      ResolversParentTypes['CommunityApplicationResult']
    >;
    communityInvitations: Array<
      ResolversParentTypes['CommunityInvitationResult']
    >;
    mySpaces: Array<ResolversParentTypes['MySpaceResults']>;
    spaceMembershipsFlat: Array<
      ResolversParentTypes['CommunityMembershipResult']
    >;
    spaceMembershipsHierarchical: Array<
      ResolversParentTypes['CommunityMembershipResult']
    >;
    user?: Maybe<ResolversParentTypes['User']>;
  };
  Memo: Omit<Memo, 'createdBy' | 'profile'> & {
    createdBy?: Maybe<ResolversParentTypes['User']>;
    profile: ResolversParentTypes['Profile'];
  };
  MemoContent: Scalars['MemoContent']['output'];
  Message: Omit<Message, 'reactions' | 'sender'> & {
    reactions: Array<ResolversParentTypes['Reaction']>;
    sender?: Maybe<ResolversParentTypes['Contributor']>;
  };
  MessageAnswerQuestion: MessageAnswerQuestion;
  MessageID: Scalars['MessageID']['output'];
  Metadata: Metadata;
  MigrateEmbeddings: MigrateEmbeddings;
  ModelCardAiEngineResult: ModelCardAiEngineResult;
  ModelCardMonitoringResult: ModelCardMonitoringResult;
  ModelCardSpaceUsageResult: ModelCardSpaceUsageResult;
  MoveCalloutContributionInput: MoveCalloutContributionInput;
  Mutation: {};
  MySpaceResults: Omit<MySpaceResults, 'latestActivity' | 'space'> & {
    latestActivity?: Maybe<ResolversParentTypes['ActivityLogEntry']>;
    space: ResolversParentTypes['Space'];
  };
  NVP: Nvp;
  NameID: Scalars['NameID']['output'];
  NotificationRecipientResult: Omit<
    NotificationRecipientResult,
    'emailRecipients' | 'inAppRecipients' | 'triggeredBy'
  > & {
    emailRecipients: Array<ResolversParentTypes['User']>;
    inAppRecipients: Array<ResolversParentTypes['User']>;
    triggeredBy?: Maybe<ResolversParentTypes['User']>;
  };
  NotificationRecipientsInput: NotificationRecipientsInput;
  Organization: Omit<
    Organization,
    'account' | 'group' | 'groups' | 'profile' | 'roleSet'
  > & {
    account?: Maybe<ResolversParentTypes['Account']>;
    group?: Maybe<ResolversParentTypes['UserGroup']>;
    groups?: Maybe<Array<ResolversParentTypes['UserGroup']>>;
    profile: ResolversParentTypes['Profile'];
    roleSet: ResolversParentTypes['RoleSet'];
  };
  OrganizationAuthorizationResetInput: OrganizationAuthorizationResetInput;
  OrganizationFilterInput: OrganizationFilterInput;
  OrganizationSettings: OrganizationSettings;
  OrganizationSettingsMembership: OrganizationSettingsMembership;
  OrganizationSettingsPrivacy: OrganizationSettingsPrivacy;
  OrganizationVerification: OrganizationVerification;
  OrganizationVerificationEventInput: OrganizationVerificationEventInput;
  OrganizationsInRolesResponse: Omit<
    OrganizationsInRolesResponse,
    'organizations'
  > & { organizations: Array<ResolversParentTypes['Organization']> };
  OryConfig: OryConfig;
  PageInfo: PageInfo;
  PaginatedOrganization: Omit<
    PaginatedOrganization,
    'organization' | 'pageInfo'
  > & {
    organization: Array<ResolversParentTypes['Organization']>;
    pageInfo: ResolversParentTypes['PageInfo'];
  };
  PaginatedSpaces: Omit<PaginatedSpaces, 'pageInfo' | 'spaces'> & {
    pageInfo: ResolversParentTypes['PageInfo'];
    spaces: Array<ResolversParentTypes['Space']>;
  };
  PaginatedUsers: Omit<PaginatedUsers, 'pageInfo' | 'users'> & {
    pageInfo: ResolversParentTypes['PageInfo'];
    users: Array<ResolversParentTypes['User']>;
  };
  PaginatedVirtualContributor: Omit<
    PaginatedVirtualContributor,
    'pageInfo' | 'virtualContributors'
  > & {
    pageInfo: ResolversParentTypes['PageInfo'];
    virtualContributors: Array<ResolversParentTypes['VirtualContributor']>;
  };
  Platform: Omit<
    Platform,
    | 'chatGuidanceVirtualContributor'
    | 'configuration'
    | 'forum'
    | 'innovationHub'
    | 'library'
    | 'roleSet'
    | 'templatesManager'
  > & {
    chatGuidanceVirtualContributor: ResolversParentTypes['VirtualContributor'];
    configuration: ResolversParentTypes['Config'];
    forum: ResolversParentTypes['Forum'];
    innovationHub?: Maybe<ResolversParentTypes['InnovationHub']>;
    library: ResolversParentTypes['Library'];
    roleSet: ResolversParentTypes['RoleSet'];
    templatesManager?: Maybe<ResolversParentTypes['TemplatesManager']>;
  };
  PlatformFeatureFlag: PlatformFeatureFlag;
  PlatformIntegrationSettings: PlatformIntegrationSettings;
  PlatformInvitation: Omit<PlatformInvitation, 'createdBy'> & {
    createdBy: ResolversParentTypes['User'];
  };
  PlatformLocations: PlatformLocations;
  PlatformSettings: PlatformSettings;
  Post: Omit<Post, 'comments' | 'createdBy' | 'profile'> & {
    comments: ResolversParentTypes['Room'];
    createdBy?: Maybe<ResolversParentTypes['User']>;
    profile: ResolversParentTypes['Profile'];
  };
  Profile: Omit<Profile, 'references' | 'storageBucket'> & {
    references?: Maybe<Array<ResolversParentTypes['Reference']>>;
    storageBucket: ResolversParentTypes['StorageBucket'];
  };
  ProfileCredentialVerified: ProfileCredentialVerified;
  Query: {};
  Question: Question;
  Reaction: Omit<Reaction, 'sender'> & {
    sender?: Maybe<ResolversParentTypes['User']>;
  };
  Reference: Reference;
  RefreshVirtualContributorBodyOfKnowledgeInput: RefreshVirtualContributorBodyOfKnowledgeInput;
  RelayPaginatedSpace: Omit<
    RelayPaginatedSpace,
    | 'about'
    | 'account'
    | 'collaboration'
    | 'community'
    | 'subspaceByNameID'
    | 'subspaces'
    | 'templatesManager'
  > & {
    about: ResolversParentTypes['SpaceAbout'];
    account: ResolversParentTypes['Account'];
    collaboration: ResolversParentTypes['Collaboration'];
    community: ResolversParentTypes['Community'];
    subspaceByNameID: ResolversParentTypes['Space'];
    subspaces: Array<ResolversParentTypes['Space']>;
    templatesManager?: Maybe<ResolversParentTypes['TemplatesManager']>;
  };
  RelayPaginatedSpaceEdge: Omit<RelayPaginatedSpaceEdge, 'node'> & {
    node: ResolversParentTypes['RelayPaginatedSpace'];
  };
  RelayPaginatedSpacePageInfo: RelayPaginatedSpacePageInfo;
  RemoveCommunityGuidelinesContentInput: RemoveCommunityGuidelinesContentInput;
  RemovePlatformRoleInput: RemovePlatformRoleInput;
  RemoveRoleOnRoleSetFromOrganizationInput: RemoveRoleOnRoleSetFromOrganizationInput;
  RemoveRoleOnRoleSetFromUserInput: RemoveRoleOnRoleSetFromUserInput;
  RemoveRoleOnRoleSetFromVirtualContributorInput: RemoveRoleOnRoleSetFromVirtualContributorInput;
  RemoveUserGroupMemberInput: RemoveUserGroupMemberInput;
  RevokeAuthorizationCredentialInput: RevokeAuthorizationCredentialInput;
  RevokeLicensePlanFromAccount: RevokeLicensePlanFromAccount;
  RevokeLicensePlanFromSpace: RevokeLicensePlanFromSpace;
  RevokeOrganizationAuthorizationCredentialInput: RevokeOrganizationAuthorizationCredentialInput;
  Role: Role;
  RoleSet: Omit<
    RoleSet,
    | 'applications'
    | 'availableUsersForElevatedRole'
    | 'availableUsersForEntryRole'
    | 'availableVirtualContributorsForEntryRole'
    | 'invitations'
    | 'organizationsInRole'
    | 'organizationsInRoles'
    | 'platformInvitations'
    | 'usersInRole'
    | 'usersInRoles'
    | 'virtualContributorsInRole'
    | 'virtualContributorsInRoleInHierarchy'
    | 'virtualContributorsInRoles'
  > & {
    applications: Array<ResolversParentTypes['Application']>;
    availableUsersForElevatedRole: ResolversParentTypes['PaginatedUsers'];
    availableUsersForEntryRole: ResolversParentTypes['PaginatedUsers'];
    availableVirtualContributorsForEntryRole: ResolversParentTypes['PaginatedVirtualContributor'];
    invitations: Array<ResolversParentTypes['Invitation']>;
    organizationsInRole: Array<ResolversParentTypes['Organization']>;
    organizationsInRoles: Array<
      ResolversParentTypes['OrganizationsInRolesResponse']
    >;
    platformInvitations: Array<ResolversParentTypes['PlatformInvitation']>;
    usersInRole: Array<ResolversParentTypes['User']>;
    usersInRoles: Array<ResolversParentTypes['UsersInRolesResponse']>;
    virtualContributorsInRole: Array<
      ResolversParentTypes['VirtualContributor']
    >;
    virtualContributorsInRoleInHierarchy: Array<
      ResolversParentTypes['VirtualContributor']
    >;
    virtualContributorsInRoles: Array<
      ResolversParentTypes['VirtualContributorsInRolesResponse']
    >;
  };
  RoleSetInvitationResult: Omit<
    RoleSetInvitationResult,
    'invitation' | 'platformInvitation'
  > & {
    invitation?: Maybe<ResolversParentTypes['Invitation']>;
    platformInvitation?: Maybe<ResolversParentTypes['PlatformInvitation']>;
  };
  RolesOrganizationInput: RolesOrganizationInput;
  RolesResult: RolesResult;
  RolesResultCommunity: RolesResultCommunity;
  RolesResultOrganization: RolesResultOrganization;
  RolesResultSpace: RolesResultSpace;
  RolesUserInput: RolesUserInput;
  RolesVirtualContributorInput: RolesVirtualContributorInput;
  Room: Omit<Room, 'messages' | 'vcInteractions'> & {
    messages: Array<ResolversParentTypes['Message']>;
    vcInteractions: Array<ResolversParentTypes['VcInteraction']>;
  };
  RoomAddReactionToMessageInput: RoomAddReactionToMessageInput;
  RoomEventSubscriptionResult: Omit<
    RoomEventSubscriptionResult,
    'message' | 'reaction' | 'room'
  > & {
    message?: Maybe<ResolversParentTypes['RoomMessageEventSubscriptionResult']>;
    reaction?: Maybe<
      ResolversParentTypes['RoomMessageReactionEventSubscriptionResult']
    >;
    room: ResolversParentTypes['Room'];
  };
  RoomMessageEventSubscriptionResult: Omit<
    RoomMessageEventSubscriptionResult,
    'data'
  > & { data: ResolversParentTypes['Message'] };
  RoomMessageReactionEventSubscriptionResult: Omit<
    RoomMessageReactionEventSubscriptionResult,
    'data'
  > & { data: ResolversParentTypes['Reaction'] };
  RoomRemoveMessageInput: RoomRemoveMessageInput;
  RoomRemoveReactionToMessageInput: RoomRemoveReactionToMessageInput;
  RoomSendMessageInput: RoomSendMessageInput;
  RoomSendMessageReplyInput: RoomSendMessageReplyInput;
  SearchCursor: Scalars['SearchCursor']['output'];
  SearchFilterInput: SearchFilterInput;
  SearchInput: SearchInput;
  SearchResult: ResolversInterfaceTypes<ResolversParentTypes>['SearchResult'];
  SearchResultCallout: Omit<SearchResultCallout, 'callout' | 'space'> & {
    callout: ResolversParentTypes['Callout'];
    space: ResolversParentTypes['Space'];
  };
  SearchResultOrganization: Omit<SearchResultOrganization, 'organization'> & {
    organization: ResolversParentTypes['Organization'];
  };
  SearchResultPost: Omit<SearchResultPost, 'callout' | 'post' | 'space'> & {
    callout: ResolversParentTypes['Callout'];
    post: ResolversParentTypes['Post'];
    space: ResolversParentTypes['Space'];
  };
  SearchResultSpace: Omit<SearchResultSpace, 'parentSpace' | 'space'> & {
    parentSpace?: Maybe<ResolversParentTypes['Space']>;
    space: ResolversParentTypes['Space'];
  };
  SearchResultUser: Omit<SearchResultUser, 'user'> & {
    user: ResolversParentTypes['User'];
  };
  Sentry: Sentry;
  ServiceMetadata: ServiceMetadata;
  Space: Omit<
    Space,
    | 'about'
    | 'account'
    | 'collaboration'
    | 'community'
    | 'subspaceByNameID'
    | 'subspaces'
    | 'templatesManager'
  > & {
    about: ResolversParentTypes['SpaceAbout'];
    account: ResolversParentTypes['Account'];
    collaboration: ResolversParentTypes['Collaboration'];
    community: ResolversParentTypes['Community'];
    subspaceByNameID: ResolversParentTypes['Space'];
    subspaces: Array<ResolversParentTypes['Space']>;
    templatesManager?: Maybe<ResolversParentTypes['TemplatesManager']>;
  };
  SpaceAbout: Omit<
    SpaceAbout,
    'guidelines' | 'membership' | 'profile' | 'provider'
  > & {
    guidelines: ResolversParentTypes['CommunityGuidelines'];
    membership: ResolversParentTypes['SpaceAboutMembership'];
    profile: ResolversParentTypes['Profile'];
    provider: ResolversParentTypes['Contributor'];
  };
  SpaceAboutMembership: Omit<
    SpaceAboutMembership,
    'leadOrganizations' | 'leadUsers'
  > & {
    leadOrganizations: Array<ResolversParentTypes['Organization']>;
    leadUsers: Array<ResolversParentTypes['User']>;
  };
  SpaceFilterInput: SpaceFilterInput;
  SpacePendingMembershipInfo: Omit<
    SpacePendingMembershipInfo,
    'about' | 'communityGuidelines'
  > & {
    about: ResolversParentTypes['SpaceAbout'];
    communityGuidelines: ResolversParentTypes['CommunityGuidelines'];
  };
  SpaceSettings: SpaceSettings;
  SpaceSettingsCollaboration: SpaceSettingsCollaboration;
  SpaceSettingsMembership: SpaceSettingsMembership;
  SpaceSettingsPrivacy: SpaceSettingsPrivacy;
  SpaceSubscription: SpaceSubscription;
  StorageAggregator: Omit<
    StorageAggregator,
    'directStorageBucket' | 'storageBuckets'
  > & {
    directStorageBucket: ResolversParentTypes['StorageBucket'];
    storageBuckets: Array<ResolversParentTypes['StorageBucket']>;
  };
  StorageAggregatorParent: StorageAggregatorParent;
  StorageBucket: Omit<StorageBucket, 'document' | 'documents'> & {
    document?: Maybe<ResolversParentTypes['Document']>;
    documents: Array<ResolversParentTypes['Document']>;
  };
  StorageBucketParent: StorageBucketParent;
  StorageBucketUploadFileInput: StorageBucketUploadFileInput;
  StorageBucketUploadFileOnLinkInput: StorageBucketUploadFileOnLinkInput;
  StorageBucketUploadFileOnReferenceInput: StorageBucketUploadFileOnReferenceInput;
  StorageConfig: StorageConfig;
  String: Scalars['String']['output'];
  Subscription: {};
  SubspaceCreated: Omit<SubspaceCreated, 'subspace'> & {
    subspace: ResolversParentTypes['Space'];
  };
  Tagset: Tagset;
  TagsetArgs: TagsetArgs;
  TagsetTemplate: TagsetTemplate;
  Task: Task;
  Template: Omit<
    Template,
    | 'callout'
    | 'communityGuidelines'
    | 'contentSpace'
    | 'profile'
    | 'whiteboard'
  > & {
    callout?: Maybe<ResolversParentTypes['Callout']>;
    communityGuidelines?: Maybe<ResolversParentTypes['CommunityGuidelines']>;
    contentSpace?: Maybe<ResolversParentTypes['TemplateContentSpace']>;
    profile: ResolversParentTypes['Profile'];
    whiteboard?: Maybe<ResolversParentTypes['Whiteboard']>;
  };
  TemplateContentSpace: Omit<
    TemplateContentSpace,
    'about' | 'collaboration' | 'subspaces'
  > & {
    about: ResolversParentTypes['SpaceAbout'];
    collaboration: ResolversParentTypes['Collaboration'];
    subspaces: Array<ResolversParentTypes['TemplateContentSpace']>;
  };
  TemplateDefault: Omit<TemplateDefault, 'template'> & {
    template?: Maybe<ResolversParentTypes['Template']>;
  };
  TemplateResult: Omit<TemplateResult, 'innovationPack' | 'template'> & {
    innovationPack: ResolversParentTypes['InnovationPack'];
    template: ResolversParentTypes['Template'];
  };
  TemplatesManager: Omit<
    TemplatesManager,
    'templateDefaults' | 'templatesSet'
  > & {
    templateDefaults: Array<ResolversParentTypes['TemplateDefault']>;
    templatesSet?: Maybe<ResolversParentTypes['TemplatesSet']>;
  };
  TemplatesSet: Omit<
    TemplatesSet,
    | 'calloutTemplates'
    | 'communityGuidelinesTemplates'
    | 'postTemplates'
    | 'spaceTemplates'
    | 'templates'
    | 'whiteboardTemplates'
  > & {
    calloutTemplates: Array<ResolversParentTypes['Template']>;
    communityGuidelinesTemplates: Array<ResolversParentTypes['Template']>;
    postTemplates: Array<ResolversParentTypes['Template']>;
    spaceTemplates: Array<ResolversParentTypes['Template']>;
    templates: Array<ResolversParentTypes['Template']>;
    whiteboardTemplates: Array<ResolversParentTypes['Template']>;
  };
  Timeline: Omit<Timeline, 'calendar'> & {
    calendar: ResolversParentTypes['Calendar'];
  };
  TransferAccountInnovationHubInput: TransferAccountInnovationHubInput;
  TransferAccountInnovationPackInput: TransferAccountInnovationPackInput;
  TransferAccountSpaceInput: TransferAccountSpaceInput;
  TransferAccountVirtualContributorInput: TransferAccountVirtualContributorInput;
  TransferCalloutInput: TransferCalloutInput;
  UUID: Scalars['UUID']['output'];
  UpdateAiPersonaInput: UpdateAiPersonaInput;
  UpdateAiPersonaServiceInput: UpdateAiPersonaServiceInput;
  UpdateApplicationFormOnRoleSetInput: UpdateApplicationFormOnRoleSetInput;
  UpdateCalendarEventInput: UpdateCalendarEventInput;
  UpdateCalloutContributionDefaultsInput: UpdateCalloutContributionDefaultsInput;
  UpdateCalloutEntityInput: UpdateCalloutEntityInput;
  UpdateCalloutFramingInput: UpdateCalloutFramingInput;
  UpdateCalloutPublishInfoInput: UpdateCalloutPublishInfoInput;
  UpdateCalloutSettingsContributionInput: UpdateCalloutSettingsContributionInput;
  UpdateCalloutSettingsFramingInput: UpdateCalloutSettingsFramingInput;
  UpdateCalloutSettingsInput: UpdateCalloutSettingsInput;
  UpdateCalloutVisibilityInput: UpdateCalloutVisibilityInput;
  UpdateCalloutsSortOrderInput: UpdateCalloutsSortOrderInput;
  UpdateClassificationInput: UpdateClassificationInput;
  UpdateClassificationSelectTagsetValueInput: UpdateClassificationSelectTagsetValueInput;
  UpdateCollaborationFromSpaceTemplateInput: UpdateCollaborationFromSpaceTemplateInput;
  UpdateCommunityGuidelinesEntityInput: UpdateCommunityGuidelinesEntityInput;
  UpdateContributionCalloutsSortOrderInput: UpdateContributionCalloutsSortOrderInput;
  UpdateDiscussionInput: UpdateDiscussionInput;
  UpdateDocumentInput: UpdateDocumentInput;
  UpdateFormInput: UpdateFormInput;
  UpdateFormQuestionInput: UpdateFormQuestionInput;
  UpdateInnovationFlowCurrentStateInput: UpdateInnovationFlowCurrentStateInput;
  UpdateInnovationFlowInput: UpdateInnovationFlowInput;
  UpdateInnovationFlowStateInput: UpdateInnovationFlowStateInput;
  UpdateInnovationFlowStateSettingsInput: UpdateInnovationFlowStateSettingsInput;
  UpdateInnovationFlowStatesSortOrderInput: UpdateInnovationFlowStatesSortOrderInput;
  UpdateInnovationHubInput: UpdateInnovationHubInput;
  UpdateInnovationPackInput: UpdateInnovationPackInput;
  UpdateKnowledgeBaseInput: UpdateKnowledgeBaseInput;
  UpdateLicensePlanInput: UpdateLicensePlanInput;
  UpdateLinkInput: UpdateLinkInput;
  UpdateLocationInput: UpdateLocationInput;
  UpdateMemoEntityInput: UpdateMemoEntityInput;
  UpdateNotificationStateInput: UpdateNotificationStateInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateOrganizationPlatformSettingsInput: UpdateOrganizationPlatformSettingsInput;
  UpdateOrganizationSettingsEntityInput: UpdateOrganizationSettingsEntityInput;
  UpdateOrganizationSettingsInput: UpdateOrganizationSettingsInput;
  UpdateOrganizationSettingsMembershipInput: UpdateOrganizationSettingsMembershipInput;
  UpdateOrganizationSettingsPrivacyInput: UpdateOrganizationSettingsPrivacyInput;
  UpdatePlatformSettingsInput: UpdatePlatformSettingsInput;
  UpdatePlatformSettingsIntegrationInput: UpdatePlatformSettingsIntegrationInput;
  UpdatePostInput: UpdatePostInput;
  UpdateProfileDirectInput: UpdateProfileDirectInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateReferenceInput: UpdateReferenceInput;
  UpdateSpaceAboutInput: UpdateSpaceAboutInput;
  UpdateSpaceInput: UpdateSpaceInput;
  UpdateSpacePlatformSettingsInput: UpdateSpacePlatformSettingsInput;
  UpdateSpaceSettingsCollaborationInput: UpdateSpaceSettingsCollaborationInput;
  UpdateSpaceSettingsEntityInput: UpdateSpaceSettingsEntityInput;
  UpdateSpaceSettingsInput: UpdateSpaceSettingsInput;
  UpdateSpaceSettingsMembershipInput: UpdateSpaceSettingsMembershipInput;
  UpdateSpaceSettingsPrivacyInput: UpdateSpaceSettingsPrivacyInput;
  UpdateTagsetInput: UpdateTagsetInput;
  UpdateTemplateContentSpaceInput: UpdateTemplateContentSpaceInput;
  UpdateTemplateDefaultTemplateInput: UpdateTemplateDefaultTemplateInput;
  UpdateTemplateFromSpaceInput: UpdateTemplateFromSpaceInput;
  UpdateTemplateInput: UpdateTemplateInput;
  UpdateUserGroupInput: UpdateUserGroupInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserPlatformSettingsInput: UpdateUserPlatformSettingsInput;
  UpdateUserSettingsCommunicationInput: UpdateUserSettingsCommunicationInput;
  UpdateUserSettingsEntityInput: UpdateUserSettingsEntityInput;
  UpdateUserSettingsInput: UpdateUserSettingsInput;
  UpdateUserSettingsNotificationInput: UpdateUserSettingsNotificationInput;
  UpdateUserSettingsNotificationOrganizationInput: UpdateUserSettingsNotificationOrganizationInput;
  UpdateUserSettingsNotificationPlatformInput: UpdateUserSettingsNotificationPlatformInput;
  UpdateUserSettingsNotificationSpaceInput: UpdateUserSettingsNotificationSpaceInput;
  UpdateUserSettingsNotificationUserInput: UpdateUserSettingsNotificationUserInput;
  UpdateUserSettingsPrivacyInput: UpdateUserSettingsPrivacyInput;
  UpdateVirtualContributorInput: UpdateVirtualContributorInput;
  UpdateVirtualContributorSettingsEntityInput: UpdateVirtualContributorSettingsEntityInput;
  UpdateVirtualContributorSettingsInput: UpdateVirtualContributorSettingsInput;
  UpdateVirtualContributorSettingsPrivacyInput: UpdateVirtualContributorSettingsPrivacyInput;
  UpdateVisualInput: UpdateVisualInput;
  UpdateWhiteboardEntityInput: UpdateWhiteboardEntityInput;
  Upload: Scalars['Upload']['output'];
  UrlResolverQueryResultCalendar: UrlResolverQueryResultCalendar;
  UrlResolverQueryResultCalloutsSet: UrlResolverQueryResultCalloutsSet;
  UrlResolverQueryResultCollaboration: UrlResolverQueryResultCollaboration;
  UrlResolverQueryResultInnovationPack: UrlResolverQueryResultInnovationPack;
  UrlResolverQueryResultSpace: UrlResolverQueryResultSpace;
  UrlResolverQueryResultTemplatesSet: UrlResolverQueryResultTemplatesSet;
  UrlResolverQueryResultVirtualContributor: UrlResolverQueryResultVirtualContributor;
  UrlResolverQueryResults: UrlResolverQueryResults;
  User: Omit<
    User,
    'account' | 'communityRooms' | 'directRooms' | 'guidanceRoom' | 'profile'
  > & {
    account?: Maybe<ResolversParentTypes['Account']>;
    communityRooms?: Maybe<Array<ResolversParentTypes['CommunicationRoom']>>;
    directRooms?: Maybe<Array<ResolversParentTypes['DirectRoom']>>;
    guidanceRoom?: Maybe<ResolversParentTypes['Room']>;
    profile: ResolversParentTypes['Profile'];
  };
  UserAuthenticationResult: UserAuthenticationResult;
  UserAuthorizationPrivilegesInput: UserAuthorizationPrivilegesInput;
  UserAuthorizationResetInput: UserAuthorizationResetInput;
  UserFilterInput: UserFilterInput;
  UserGroup: Omit<UserGroup, 'members' | 'parent' | 'profile'> & {
    members?: Maybe<Array<ResolversParentTypes['User']>>;
    parent?: Maybe<ResolversParentTypes['Groupable']>;
    profile?: Maybe<ResolversParentTypes['Profile']>;
  };
  UserSendMessageInput: UserSendMessageInput;
  UserSettings: UserSettings;
  UserSettingsCommunication: UserSettingsCommunication;
  UserSettingsNotification: UserSettingsNotification;
  UserSettingsNotificationOrganization: UserSettingsNotificationOrganization;
  UserSettingsNotificationPlatform: UserSettingsNotificationPlatform;
  UserSettingsNotificationSpace: UserSettingsNotificationSpace;
  UserSettingsNotificationUser: UserSettingsNotificationUser;
  UserSettingsPrivacy: UserSettingsPrivacy;
  UsersInRolesResponse: Omit<UsersInRolesResponse, 'users'> & {
    users: Array<ResolversParentTypes['User']>;
  };
  UsersWithAuthorizationCredentialInput: UsersWithAuthorizationCredentialInput;
  VcInteraction: Omit<VcInteraction, 'room'> & {
    room: ResolversParentTypes['Room'];
  };
  VerifiedCredential: VerifiedCredential;
  VerifiedCredentialClaim: VerifiedCredentialClaim;
  VirtualContributor: Omit<
    VirtualContributor,
    'account' | 'knowledgeBase' | 'profile' | 'provider'
  > & {
    account?: Maybe<ResolversParentTypes['Account']>;
    knowledgeBase?: Maybe<ResolversParentTypes['KnowledgeBase']>;
    profile: ResolversParentTypes['Profile'];
    provider: ResolversParentTypes['Contributor'];
  };
  VirtualContributorSettings: VirtualContributorSettings;
  VirtualContributorSettingsPrivacy: VirtualContributorSettingsPrivacy;
  VirtualContributorUpdatedSubscriptionResult: Omit<
    VirtualContributorUpdatedSubscriptionResult,
    'virtualContributor'
  > & { virtualContributor: ResolversParentTypes['VirtualContributor'] };
  VirtualContributorsInRolesResponse: Omit<
    VirtualContributorsInRolesResponse,
    'virtualContributors'
  > & {
    virtualContributors: Array<ResolversParentTypes['VirtualContributor']>;
  };
  Visual: Visual;
  VisualConstraints: VisualConstraints;
  VisualUploadImageInput: VisualUploadImageInput;
  Whiteboard: Omit<Whiteboard, 'createdBy' | 'profile'> & {
    createdBy?: Maybe<ResolversParentTypes['User']>;
    profile: ResolversParentTypes['Profile'];
  };
  WhiteboardContent: Scalars['WhiteboardContent']['output'];
};

export type OneOfDirectiveArgs = {};

export type OneOfDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = OneOfDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ApmResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['APM'] = ResolversParentTypes['APM'],
> = {
  endpoint?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rumEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Account'] = ResolversParentTypes['Account'],
> = {
  agent?: Resolver<ResolversTypes['Agent'], ParentType, ContextType>;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  externalSubscriptionID?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  host?: Resolver<
    Maybe<ResolversTypes['Contributor']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  innovationHubs?: Resolver<
    Array<ResolversTypes['InnovationHub']>,
    ParentType,
    ContextType
  >;
  innovationPacks?: Resolver<
    Array<ResolversTypes['InnovationPack']>,
    ParentType,
    ContextType
  >;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  spaces?: Resolver<Array<ResolversTypes['Space']>, ParentType, ContextType>;
  storageAggregator?: Resolver<
    ResolversTypes['StorageAggregator'],
    ParentType,
    ContextType
  >;
  subscriptions?: Resolver<
    Array<ResolversTypes['AccountSubscription']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    Maybe<ResolversTypes['AccountType']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  virtualContributors?: Resolver<
    Array<ResolversTypes['VirtualContributor']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountSubscriptionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AccountSubscription'] = ResolversParentTypes['AccountSubscription'],
> = {
  expires?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<
    ResolversTypes['LicensingCredentialBasedCredentialType'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityCreatedSubscriptionResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityCreatedSubscriptionResult'] = ResolversParentTypes['ActivityCreatedSubscriptionResult'],
> = {
  activity?: Resolver<
    ResolversTypes['ActivityLogEntry'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityFeedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityFeed'] = ResolversParentTypes['ActivityFeed'],
> = {
  activityFeed?: Resolver<
    Array<ResolversTypes['ActivityLogEntry']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntry'] = ResolversParentTypes['ActivityLogEntry'],
> = {
  __resolveType: TypeResolveFn<
    | 'ActivityLogEntryCalendarEventCreated'
    | 'ActivityLogEntryCalloutDiscussionComment'
    | 'ActivityLogEntryCalloutLinkCreated'
    | 'ActivityLogEntryCalloutPostComment'
    | 'ActivityLogEntryCalloutPostCreated'
    | 'ActivityLogEntryCalloutPublished'
    | 'ActivityLogEntryCalloutWhiteboardContentModified'
    | 'ActivityLogEntryCalloutWhiteboardCreated'
    | 'ActivityLogEntryMemberJoined'
    | 'ActivityLogEntrySubspaceCreated'
    | 'ActivityLogEntryUpdateSent',
    ParentType,
    ContextType
  >;
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
};

export type ActivityLogEntryCalendarEventCreatedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryCalendarEventCreated'] = ResolversParentTypes['ActivityLogEntryCalendarEventCreated'],
> = {
  calendar?: Resolver<ResolversTypes['Calendar'], ParentType, ContextType>;
  calendarEvent?: Resolver<
    ResolversTypes['CalendarEvent'],
    ParentType,
    ContextType
  >;
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryCalloutDiscussionCommentResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryCalloutDiscussionComment'] = ResolversParentTypes['ActivityLogEntryCalloutDiscussionComment'],
> = {
  callout?: Resolver<ResolversTypes['Callout'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryCalloutLinkCreatedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryCalloutLinkCreated'] = ResolversParentTypes['ActivityLogEntryCalloutLinkCreated'],
> = {
  callout?: Resolver<ResolversTypes['Callout'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  link?: Resolver<ResolversTypes['Link'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryCalloutPostCommentResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryCalloutPostComment'] = ResolversParentTypes['ActivityLogEntryCalloutPostComment'],
> = {
  callout?: Resolver<ResolversTypes['Callout'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryCalloutPostCreatedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryCalloutPostCreated'] = ResolversParentTypes['ActivityLogEntryCalloutPostCreated'],
> = {
  callout?: Resolver<ResolversTypes['Callout'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryCalloutPublishedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryCalloutPublished'] = ResolversParentTypes['ActivityLogEntryCalloutPublished'],
> = {
  callout?: Resolver<ResolversTypes['Callout'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryCalloutWhiteboardContentModifiedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryCalloutWhiteboardContentModified'] = ResolversParentTypes['ActivityLogEntryCalloutWhiteboardContentModified'],
> = {
  callout?: Resolver<ResolversTypes['Callout'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  whiteboard?: Resolver<ResolversTypes['Whiteboard'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryCalloutWhiteboardCreatedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryCalloutWhiteboardCreated'] = ResolversParentTypes['ActivityLogEntryCalloutWhiteboardCreated'],
> = {
  callout?: Resolver<ResolversTypes['Callout'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  whiteboard?: Resolver<ResolversTypes['Whiteboard'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryMemberJoinedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryMemberJoined'] = ResolversParentTypes['ActivityLogEntryMemberJoined'],
> = {
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  community?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  contributor?: Resolver<
    ResolversTypes['Contributor'],
    ParentType,
    ContextType
  >;
  contributorType?: Resolver<
    ResolversTypes['RoleSetContributorType'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntrySubspaceCreatedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntrySubspaceCreated'] = ResolversParentTypes['ActivityLogEntrySubspaceCreated'],
> = {
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  subspace?: Resolver<ResolversTypes['Space'], ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityLogEntryUpdateSentResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ActivityLogEntryUpdateSent'] = ResolversParentTypes['ActivityLogEntryUpdateSent'],
> = {
  child?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  collaborationID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  journeyUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parentDisplayName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  triggeredBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityEventType'], ParentType, ContextType>;
  updates?: Resolver<ResolversTypes['Room'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AgentResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Agent'] = ResolversParentTypes['Agent'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  credentials?: Resolver<
    Maybe<Array<ResolversTypes['Credential']>>,
    ParentType,
    ContextType
  >;
  did?: Resolver<Maybe<ResolversTypes['DID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['AgentType'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verifiedCredentials?: Resolver<
    Maybe<Array<ResolversTypes['VerifiedCredential']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AgentBeginVerifiedCredentialOfferOutputResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AgentBeginVerifiedCredentialOfferOutput'] = ResolversParentTypes['AgentBeginVerifiedCredentialOfferOutput'],
> = {
  jwt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  qrCodeImg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AgentBeginVerifiedCredentialRequestOutputResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AgentBeginVerifiedCredentialRequestOutput'] = ResolversParentTypes['AgentBeginVerifiedCredentialRequestOutput'],
> = {
  jwt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  qrCodeImg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AiPersonaResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AiPersona'] = ResolversParentTypes['AiPersona'],
> = {
  aiPersonaServiceID?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  bodyOfKnowledge?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  bodyOfKnowledgeID?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bodyOfKnowledgeType?: Resolver<
    Maybe<ResolversTypes['AiPersonaBodyOfKnowledgeType']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dataAccessMode?: Resolver<
    ResolversTypes['AiPersonaDataAccessMode'],
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  engine?: Resolver<ResolversTypes['AiPersonaEngine'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  interactionModes?: Resolver<
    Array<ResolversTypes['AiPersonaInteractionMode']>,
    ParentType,
    ContextType
  >;
  modelCard?: Resolver<
    ResolversTypes['AiPersonaModelCard'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AiPersonaModelCardResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AiPersonaModelCard'] = ResolversParentTypes['AiPersonaModelCard'],
> = {
  aiEngine?: Resolver<
    Maybe<ResolversTypes['ModelCardAiEngineResult']>,
    ParentType,
    ContextType
  >;
  monitoring?: Resolver<
    Maybe<ResolversTypes['ModelCardMonitoringResult']>,
    ParentType,
    ContextType
  >;
  spaceUsage?: Resolver<
    Maybe<Array<ResolversTypes['ModelCardSpaceUsageResult']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AiPersonaModelCardFlagResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AiPersonaModelCardFlag'] = ResolversParentTypes['AiPersonaModelCardFlag'],
> = {
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<
    ResolversTypes['AiPersonaModelCardEntryFlagName'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AiPersonaServiceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AiPersonaService'] = ResolversParentTypes['AiPersonaService'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  bodyOfKnowledgeID?: Resolver<
    Maybe<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  bodyOfKnowledgeLastUpdated?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  bodyOfKnowledgeType?: Resolver<
    ResolversTypes['AiPersonaBodyOfKnowledgeType'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dataAccessMode?: Resolver<
    ResolversTypes['AiPersonaDataAccessMode'],
    ParentType,
    ContextType
  >;
  engine?: Resolver<ResolversTypes['AiPersonaEngine'], ParentType, ContextType>;
  externalConfig?: Resolver<
    Maybe<ResolversTypes['ExternalConfig']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  prompt?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AiServerResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AiServer'] = ResolversParentTypes['AiServer'],
> = {
  aiPersonaService?: Resolver<
    ResolversTypes['AiPersonaService'],
    ParentType,
    ContextType,
    RequireFields<AiServerAiPersonaServiceArgs, 'ID'>
  >;
  aiPersonaServices?: Resolver<
    Array<ResolversTypes['AiPersonaService']>,
    ParentType,
    ContextType
  >;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  defaultAiPersonaService?: Resolver<
    ResolversTypes['AiPersonaService'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApplicationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Application'] = ResolversParentTypes['Application'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  contributor?: Resolver<
    ResolversTypes['Contributor'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isFinalized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lifecycle?: Resolver<ResolversTypes['Lifecycle'], ParentType, ContextType>;
  nextEvents?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  questions?: Resolver<
    Array<ResolversTypes['Question']>,
    ParentType,
    ContextType
  >;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthenticationConfigResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AuthenticationConfig'] = ResolversParentTypes['AuthenticationConfig'],
> = {
  providers?: Resolver<
    Array<ResolversTypes['AuthenticationProviderConfig']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthenticationProviderConfigResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AuthenticationProviderConfig'] = ResolversParentTypes['AuthenticationProviderConfig'],
> = {
  config?: Resolver<
    ResolversTypes['AuthenticationProviderConfigUnion'],
    ParentType,
    ContextType
  >;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthenticationProviderConfigUnionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AuthenticationProviderConfigUnion'] = ResolversParentTypes['AuthenticationProviderConfigUnion'],
> = {
  __resolveType: TypeResolveFn<'OryConfig', ParentType, ContextType>;
};

export type AuthorizationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Authorization'] = ResolversParentTypes['Authorization'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  credentialRules?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPolicyRuleCredential']>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  myPrivileges?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType
  >;
  privilegeRules?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPolicyRulePrivilege']>>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    Maybe<ResolversTypes['AuthorizationPolicyType']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verifiedCredentialRules?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPolicyRuleVerifiedCredential']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorizationPolicyRuleCredentialResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AuthorizationPolicyRuleCredential'] = ResolversParentTypes['AuthorizationPolicyRuleCredential'],
> = {
  cascade?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  criterias?: Resolver<
    Array<ResolversTypes['CredentialDefinition']>,
    ParentType,
    ContextType
  >;
  grantedPrivileges?: Resolver<
    Array<ResolversTypes['AuthorizationPrivilege']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorizationPolicyRulePrivilegeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AuthorizationPolicyRulePrivilege'] = ResolversParentTypes['AuthorizationPolicyRulePrivilege'],
> = {
  grantedPrivileges?: Resolver<
    Array<ResolversTypes['AuthorizationPrivilege']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourcePrivilege?: Resolver<
    ResolversTypes['AuthorizationPrivilege'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorizationPolicyRuleVerifiedCredentialResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['AuthorizationPolicyRuleVerifiedCredential'] = ResolversParentTypes['AuthorizationPolicyRuleVerifiedCredential'],
> = {
  claimRule?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  credentialName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  grantedPrivileges?: Resolver<
    Array<ResolversTypes['AuthorizationPrivilege']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalendarResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Calendar'] = ResolversParentTypes['Calendar'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  event?: Resolver<
    Maybe<ResolversTypes['CalendarEvent']>,
    ParentType,
    ContextType,
    RequireFields<CalendarEventArgs, 'ID'>
  >;
  events?: Resolver<
    Array<ResolversTypes['CalendarEvent']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalendarEventResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CalendarEvent'] = ResolversParentTypes['CalendarEvent'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  comments?: Resolver<ResolversTypes['Room'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  durationDays?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  durationMinutes?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  multipleDays?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  startDate?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  subspace?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['CalendarEventType'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  visibleOnParentCalendar?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  wholeDay?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalloutResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Callout'] = ResolversParentTypes['Callout'],
> = {
  activity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  classification?: Resolver<
    Maybe<ResolversTypes['Classification']>,
    ParentType,
    ContextType
  >;
  comments?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType>;
  contributionDefaults?: Resolver<
    ResolversTypes['CalloutContributionDefaults'],
    ParentType,
    ContextType
  >;
  contributions?: Resolver<
    Array<ResolversTypes['CalloutContribution']>,
    ParentType,
    ContextType,
    Partial<CalloutContributionsArgs>
  >;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  framing?: Resolver<ResolversTypes['CalloutFraming'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isTemplate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  posts?: Resolver<
    Maybe<Array<ResolversTypes['Post']>>,
    ParentType,
    ContextType
  >;
  publishedBy?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType
  >;
  publishedDate?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  settings?: Resolver<
    ResolversTypes['CalloutSettings'],
    ParentType,
    ContextType
  >;
  sortOrder?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalloutContributionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CalloutContribution'] = ResolversParentTypes['CalloutContribution'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['Link']>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  whiteboard?: Resolver<
    Maybe<ResolversTypes['Whiteboard']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalloutContributionDefaultsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CalloutContributionDefaults'] = ResolversParentTypes['CalloutContributionDefaults'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  defaultDisplayName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  postDescription?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  whiteboardContent?: Resolver<
    Maybe<ResolversTypes['WhiteboardContent']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalloutFramingResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CalloutFraming'] = ResolversParentTypes['CalloutFraming'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['Link']>, ParentType, ContextType>;
  memo?: Resolver<Maybe<ResolversTypes['Memo']>, ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  type?: Resolver<
    ResolversTypes['CalloutFramingType'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  whiteboard?: Resolver<
    Maybe<ResolversTypes['Whiteboard']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalloutPostCreatedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CalloutPostCreated'] = ResolversParentTypes['CalloutPostCreated'],
> = {
  calloutID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contributionID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalloutSettingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CalloutSettings'] = ResolversParentTypes['CalloutSettings'],
> = {
  contribution?: Resolver<
    ResolversTypes['CalloutSettingsContribution'],
    ParentType,
    ContextType
  >;
  framing?: Resolver<
    ResolversTypes['CalloutSettingsFraming'],
    ParentType,
    ContextType
  >;
  visibility?: Resolver<
    ResolversTypes['CalloutVisibility'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalloutSettingsContributionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CalloutSettingsContribution'] = ResolversParentTypes['CalloutSettingsContribution'],
> = {
  allowedTypes?: Resolver<
    Array<ResolversTypes['CalloutContributionType']>,
    ParentType,
    ContextType
  >;
  canAddContributions?: Resolver<
    ResolversTypes['CalloutAllowedContributors'],
    ParentType,
    ContextType
  >;
  commentsEnabled?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalloutSettingsFramingResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CalloutSettingsFraming'] = ResolversParentTypes['CalloutSettingsFraming'],
> = {
  commentsEnabled?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalloutsSetResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CalloutsSet'] = ResolversParentTypes['CalloutsSet'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  callouts?: Resolver<
    Array<ResolversTypes['Callout']>,
    ParentType,
    ContextType,
    Partial<CalloutsSetCalloutsArgs>
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  tagsetTemplates?: Resolver<
    Maybe<Array<ResolversTypes['TagsetTemplate']>>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['CalloutsSetType'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClassificationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Classification'] = ResolversParentTypes['Classification'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  tagset?: Resolver<
    Maybe<ResolversTypes['Tagset']>,
    ParentType,
    ContextType,
    RequireFields<ClassificationTagsetArgs, 'tagsetName'>
  >;
  tagsets?: Resolver<
    Maybe<Array<ResolversTypes['Tagset']>>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollaborationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Collaboration'] = ResolversParentTypes['Collaboration'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  calloutsSet?: Resolver<
    ResolversTypes['CalloutsSet'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  innovationFlow?: Resolver<
    ResolversTypes['InnovationFlow'],
    ParentType,
    ContextType
  >;
  isTemplate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  timeline?: Resolver<ResolversTypes['Timeline'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunicationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Communication'] = ResolversParentTypes['Communication'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updates?: Resolver<ResolversTypes['Room'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunicationAdminMembershipResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunicationAdminMembershipResult'] = ResolversParentTypes['CommunicationAdminMembershipResult'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rooms?: Resolver<
    Array<ResolversTypes['CommunicationAdminRoomMembershipResult']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunicationAdminOrphanedUsageResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunicationAdminOrphanedUsageResult'] = ResolversParentTypes['CommunicationAdminOrphanedUsageResult'],
> = {
  rooms?: Resolver<
    Array<ResolversTypes['CommunicationAdminRoomResult']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunicationAdminRoomMembershipResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunicationAdminRoomMembershipResult'] = ResolversParentTypes['CommunicationAdminRoomMembershipResult'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  extraMembers?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  joinRule?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  missingMembers?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  roomID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunicationAdminRoomResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunicationAdminRoomResult'] = ResolversParentTypes['CommunicationAdminRoomResult'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunicationRoomResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunicationRoom'] = ResolversParentTypes['CommunicationRoom'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  messages?: Resolver<
    Array<ResolversTypes['Message']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunityResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Community'] = ResolversParentTypes['Community'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  communication?: Resolver<
    ResolversTypes['Communication'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  group?: Resolver<
    ResolversTypes['UserGroup'],
    ParentType,
    ContextType,
    RequireFields<CommunityGroupArgs, 'ID'>
  >;
  groups?: Resolver<
    Array<ResolversTypes['UserGroup']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  roleSet?: Resolver<ResolversTypes['RoleSet'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunityApplicationForRoleResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunityApplicationForRoleResult'] = ResolversParentTypes['CommunityApplicationForRoleResult'],
> = {
  communityID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  spaceID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  spaceLevel?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunityApplicationResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunityApplicationResult'] = ResolversParentTypes['CommunityApplicationResult'],
> = {
  application?: Resolver<
    ResolversTypes['Application'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  spacePendingMembershipInfo?: Resolver<
    ResolversTypes['SpacePendingMembershipInfo'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunityGuidelinesResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunityGuidelines'] = ResolversParentTypes['CommunityGuidelines'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunityInvitationForRoleResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunityInvitationForRoleResult'] = ResolversParentTypes['CommunityInvitationForRoleResult'],
> = {
  communityID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  contributorID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  contributorType?: Resolver<
    ResolversTypes['RoleSetContributorType'],
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  spaceID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  spaceLevel?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  welcomeMessage?: Resolver<
    Maybe<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunityInvitationResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunityInvitationResult'] = ResolversParentTypes['CommunityInvitationResult'],
> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  invitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType>;
  spacePendingMembershipInfo?: Resolver<
    ResolversTypes['SpacePendingMembershipInfo'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunityMembershipResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CommunityMembershipResult'] = ResolversParentTypes['CommunityMembershipResult'],
> = {
  childMemberships?: Resolver<
    Array<ResolversTypes['CommunityMembershipResult']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  space?: Resolver<ResolversTypes['Space'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConfigResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Config'] = ResolversParentTypes['Config'],
> = {
  apm?: Resolver<ResolversTypes['APM'], ParentType, ContextType>;
  authentication?: Resolver<
    ResolversTypes['AuthenticationConfig'],
    ParentType,
    ContextType
  >;
  defaultVisualTypeConstraints?: Resolver<
    ResolversTypes['VisualConstraints'],
    ParentType,
    ContextType,
    RequireFields<ConfigDefaultVisualTypeConstraintsArgs, 'type'>
  >;
  featureFlags?: Resolver<
    Array<ResolversTypes['PlatformFeatureFlag']>,
    ParentType,
    ContextType
  >;
  geo?: Resolver<ResolversTypes['Geo'], ParentType, ContextType>;
  locations?: Resolver<
    ResolversTypes['PlatformLocations'],
    ParentType,
    ContextType
  >;
  sentry?: Resolver<ResolversTypes['Sentry'], ParentType, ContextType>;
  storage?: Resolver<ResolversTypes['StorageConfig'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContributorResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Contributor'] = ResolversParentTypes['Contributor'],
> = {
  __resolveType: TypeResolveFn<
    'Organization' | 'User' | 'VirtualContributor',
    ParentType,
    ContextType
  >;
  agent?: Resolver<ResolversTypes['Agent'], ParentType, ContextType>;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type ContributorRolePolicyResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ContributorRolePolicy'] = ResolversParentTypes['ContributorRolePolicy'],
> = {
  maximum?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minimum?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContributorRolesResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ContributorRoles'] = ResolversParentTypes['ContributorRoles'],
> = {
  applications?: Resolver<
    Array<ResolversTypes['CommunityApplicationForRoleResult']>,
    ParentType,
    ContextType,
    Partial<ContributorRolesApplicationsArgs>
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  invitations?: Resolver<
    Array<ResolversTypes['CommunityInvitationForRoleResult']>,
    ParentType,
    ContextType,
    Partial<ContributorRolesInvitationsArgs>
  >;
  organizations?: Resolver<
    Array<ResolversTypes['RolesResultOrganization']>,
    ParentType,
    ContextType
  >;
  spaces?: Resolver<
    Array<ResolversTypes['RolesResultSpace']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCalloutContributionDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCalloutContributionData'] = ResolversParentTypes['CreateCalloutContributionData'],
> = {
  link?: Resolver<
    Maybe<ResolversTypes['CreateLinkData']>,
    ParentType,
    ContextType
  >;
  post?: Resolver<
    Maybe<ResolversTypes['CreatePostData']>,
    ParentType,
    ContextType
  >;
  sortOrder?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  whiteboard?: Resolver<
    Maybe<ResolversTypes['CreateWhiteboardData']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCalloutContributionDefaultsDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCalloutContributionDefaultsData'] = ResolversParentTypes['CreateCalloutContributionDefaultsData'],
> = {
  defaultDisplayName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  postDescription?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  whiteboardContent?: Resolver<
    Maybe<ResolversTypes['WhiteboardContent']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCalloutDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCalloutData'] = ResolversParentTypes['CreateCalloutData'],
> = {
  classification?: Resolver<
    Maybe<ResolversTypes['CreateClassificationData']>,
    ParentType,
    ContextType
  >;
  contributionDefaults?: Resolver<
    Maybe<ResolversTypes['CreateCalloutContributionDefaultsData']>,
    ParentType,
    ContextType
  >;
  contributions?: Resolver<
    Maybe<Array<ResolversTypes['CreateCalloutContributionData']>>,
    ParentType,
    ContextType
  >;
  framing?: Resolver<
    ResolversTypes['CreateCalloutFramingData'],
    ParentType,
    ContextType
  >;
  nameID?: Resolver<Maybe<ResolversTypes['NameID']>, ParentType, ContextType>;
  sendNotification?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  settings?: Resolver<
    Maybe<ResolversTypes['CreateCalloutSettingsData']>,
    ParentType,
    ContextType
  >;
  sortOrder?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCalloutFramingDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCalloutFramingData'] = ResolversParentTypes['CreateCalloutFramingData'],
> = {
  link?: Resolver<
    Maybe<ResolversTypes['CreateLinkData']>,
    ParentType,
    ContextType
  >;
  memo?: Resolver<
    Maybe<ResolversTypes['CreateMemoData']>,
    ParentType,
    ContextType
  >;
  profile?: Resolver<
    ResolversTypes['CreateProfileData'],
    ParentType,
    ContextType
  >;
  tags?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    Maybe<ResolversTypes['CalloutFramingType']>,
    ParentType,
    ContextType
  >;
  whiteboard?: Resolver<
    Maybe<ResolversTypes['CreateWhiteboardData']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCalloutSettingsContributionDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCalloutSettingsContributionData'] = ResolversParentTypes['CreateCalloutSettingsContributionData'],
> = {
  allowedTypes?: Resolver<
    Maybe<Array<ResolversTypes['CalloutContributionType']>>,
    ParentType,
    ContextType
  >;
  canAddContributions?: Resolver<
    Maybe<ResolversTypes['CalloutAllowedContributors']>,
    ParentType,
    ContextType
  >;
  commentsEnabled?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCalloutSettingsDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCalloutSettingsData'] = ResolversParentTypes['CreateCalloutSettingsData'],
> = {
  contribution?: Resolver<
    Maybe<ResolversTypes['CreateCalloutSettingsContributionData']>,
    ParentType,
    ContextType
  >;
  framing?: Resolver<
    Maybe<ResolversTypes['CreateCalloutSettingsFramingData']>,
    ParentType,
    ContextType
  >;
  visibility?: Resolver<
    Maybe<ResolversTypes['CalloutVisibility']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCalloutSettingsFramingDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCalloutSettingsFramingData'] = ResolversParentTypes['CreateCalloutSettingsFramingData'],
> = {
  commentsEnabled?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCalloutsSetDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCalloutsSetData'] = ResolversParentTypes['CreateCalloutsSetData'],
> = {
  calloutsData?: Resolver<
    Maybe<Array<ResolversTypes['CreateCalloutData']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateClassificationDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateClassificationData'] = ResolversParentTypes['CreateClassificationData'],
> = {
  tagsets?: Resolver<
    Array<ResolversTypes['CreateTagsetData']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCollaborationDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCollaborationData'] = ResolversParentTypes['CreateCollaborationData'],
> = {
  calloutsSetData?: Resolver<
    ResolversTypes['CreateCalloutsSetData'],
    ParentType,
    ContextType
  >;
  innovationFlowData?: Resolver<
    Maybe<ResolversTypes['CreateInnovationFlowData']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCommunityGuidelinesDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateCommunityGuidelinesData'] = ResolversParentTypes['CreateCommunityGuidelinesData'],
> = {
  profile?: Resolver<
    ResolversTypes['CreateProfileData'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateInnovationFlowDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateInnovationFlowData'] = ResolversParentTypes['CreateInnovationFlowData'],
> = {
  profile?: Resolver<
    ResolversTypes['CreateProfileData'],
    ParentType,
    ContextType
  >;
  states?: Resolver<
    Array<ResolversTypes['CreateInnovationFlowStateData']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateInnovationFlowStateDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateInnovationFlowStateData'] = ResolversParentTypes['CreateInnovationFlowStateData'],
> = {
  description?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  settings?: Resolver<
    Maybe<ResolversTypes['CreateInnovationFlowStateSettingsData']>,
    ParentType,
    ContextType
  >;
  sortOrder?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateInnovationFlowStateSettingsDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateInnovationFlowStateSettingsData'] = ResolversParentTypes['CreateInnovationFlowStateSettingsData'],
> = {
  allowNewCallouts?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateLinkDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateLinkData'] = ResolversParentTypes['CreateLinkData'],
> = {
  profile?: Resolver<
    ResolversTypes['CreateProfileData'],
    ParentType,
    ContextType
  >;
  uri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateLocationDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateLocationData'] = ResolversParentTypes['CreateLocationData'],
> = {
  addressLine1?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  addressLine2?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postalCode?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  stateOrProvince?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateMemoDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateMemoData'] = ResolversParentTypes['CreateMemoData'],
> = {
  profile?: Resolver<
    Maybe<ResolversTypes['CreateProfileData']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatePostDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreatePostData'] = ResolversParentTypes['CreatePostData'],
> = {
  tags?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateProfileDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateProfileData'] = ResolversParentTypes['CreateProfileData'],
> = {
  description?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  location?: Resolver<
    Maybe<ResolversTypes['CreateLocationData']>,
    ParentType,
    ContextType
  >;
  referencesData?: Resolver<
    Maybe<Array<ResolversTypes['CreateReferenceData']>>,
    ParentType,
    ContextType
  >;
  tagline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  tagsets?: Resolver<
    Maybe<Array<ResolversTypes['CreateTagsetData']>>,
    ParentType,
    ContextType
  >;
  visuals?: Resolver<
    Maybe<Array<ResolversTypes['CreateVisualOnProfileData']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateReferenceDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateReferenceData'] = ResolversParentTypes['CreateReferenceData'],
> = {
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTagsetDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateTagsetData'] = ResolversParentTypes['CreateTagsetData'],
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes['TagsetType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateVisualOnProfileDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateVisualOnProfileData'] = ResolversParentTypes['CreateVisualOnProfileData'],
> = {
  name?: Resolver<ResolversTypes['VisualType'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateWhiteboardDataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CreateWhiteboardData'] = ResolversParentTypes['CreateWhiteboardData'],
> = {
  content?: Resolver<
    Maybe<ResolversTypes['WhiteboardContent']>,
    ParentType,
    ContextType
  >;
  nameID?: Resolver<Maybe<ResolversTypes['NameID']>, ParentType, ContextType>;
  profile?: Resolver<
    Maybe<ResolversTypes['CreateProfileData']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CredentialResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Credential'] = ResolversParentTypes['Credential'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  expires?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  issuer?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  resourceID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['CredentialType'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CredentialDefinitionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CredentialDefinition'] = ResolversParentTypes['CredentialDefinition'],
> = {
  resourceID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CredentialMetadataOutputResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CredentialMetadataOutput'] = ResolversParentTypes['CredentialMetadataOutput'],
> = {
  context?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schema?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  types?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  uniqueType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DID'], any> {
  name: 'DID';
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DirectRoomResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['DirectRoom'] = ResolversParentTypes['DirectRoom'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  messages?: Resolver<
    Array<ResolversTypes['Message']>,
    ParentType,
    ContextType
  >;
  receiverID?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DiscussionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Discussion'] = ResolversParentTypes['Discussion'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  category?: Resolver<
    ResolversTypes['ForumDiscussionCategory'],
    ParentType,
    ContextType
  >;
  comments?: Resolver<ResolversTypes['Room'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  privacy?: Resolver<
    ResolversTypes['ForumDiscussionPrivacy'],
    ParentType,
    ContextType
  >;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Document'] = ResolversParentTypes['Document'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['MimeType'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tagset?: Resolver<ResolversTypes['Tagset'], ParentType, ContextType>;
  temporaryLocation?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  uploadedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface EmojiScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Emoji'], any> {
  name: 'Emoji';
}

export type ExternalConfigResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ExternalConfig'] = ResolversParentTypes['ExternalConfig'],
> = {
  apiKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assistantId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  model?: Resolver<ResolversTypes['OpenAIModel'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileStorageConfigResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FileStorageConfig'] = ResolversParentTypes['FileStorageConfig'],
> = {
  maxFileSize?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FormResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Form'] = ResolversParentTypes['Form'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  questions?: Resolver<
    Array<ResolversTypes['FormQuestion']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FormQuestionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FormQuestion'] = ResolversParentTypes['FormQuestion'],
> = {
  explanation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  maxLength?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sortOrder?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ForumResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Forum'] = ResolversParentTypes['Forum'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  discussion?: Resolver<
    Maybe<ResolversTypes['Discussion']>,
    ParentType,
    ContextType,
    RequireFields<ForumDiscussionArgs, 'ID'>
  >;
  discussionCategories?: Resolver<
    Array<ResolversTypes['ForumDiscussionCategory']>,
    ParentType,
    ContextType
  >;
  discussions?: Resolver<
    Maybe<Array<ResolversTypes['Discussion']>>,
    ParentType,
    ContextType,
    Partial<ForumDiscussionsArgs>
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GeoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Geo'] = ResolversParentTypes['Geo'],
> = {
  endpoint?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GeoLocationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['GeoLocation'] = ResolversParentTypes['GeoLocation'],
> = {
  latitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  longitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupableResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Groupable'] = ResolversParentTypes['Groupable'],
> = {
  __resolveType: TypeResolveFn<
    'Community' | 'Organization',
    ParentType,
    ContextType
  >;
  groups?: Resolver<
    Maybe<Array<ResolversTypes['UserGroup']>>,
    ParentType,
    ContextType
  >;
};

export type ISearchCategoryResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ISearchCategoryResult'] = ResolversParentTypes['ISearchCategoryResult'],
> = {
  cursor?: Resolver<
    Maybe<ResolversTypes['SearchCursor']>,
    ParentType,
    ContextType
  >;
  results?: Resolver<
    Array<ResolversTypes['SearchResult']>,
    ParentType,
    ContextType
  >;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ISearchResultsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ISearchResults'] = ResolversParentTypes['ISearchResults'],
> = {
  calloutResults?: Resolver<
    ResolversTypes['ISearchCategoryResult'],
    ParentType,
    ContextType
  >;
  contributionResults?: Resolver<
    ResolversTypes['ISearchCategoryResult'],
    ParentType,
    ContextType
  >;
  contributorResults?: Resolver<
    ResolversTypes['ISearchCategoryResult'],
    ParentType,
    ContextType
  >;
  spaceResults?: Resolver<
    ResolversTypes['ISearchCategoryResult'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InAppNotificationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InAppNotification'] = ResolversParentTypes['InAppNotification'],
> = {
  __resolveType: TypeResolveFn<
    | 'InAppNotificationCalloutPublished'
    | 'InAppNotificationCommunityNewMember'
    | 'InAppNotificationUserMentioned',
    ParentType,
    ContextType
  >;
  category?: Resolver<
    ResolversTypes['InAppNotificationCategory'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  receiver?: Resolver<ResolversTypes['Contributor'], ParentType, ContextType>;
  state?: Resolver<
    ResolversTypes['InAppNotificationState'],
    ParentType,
    ContextType
  >;
  triggeredAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  triggeredBy?: Resolver<
    Maybe<ResolversTypes['Contributor']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['NotificationEvent'], ParentType, ContextType>;
};

export type InAppNotificationCalloutPublishedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InAppNotificationCalloutPublished'] = ResolversParentTypes['InAppNotificationCalloutPublished'],
> = {
  callout?: Resolver<Maybe<ResolversTypes['Callout']>, ParentType, ContextType>;
  category?: Resolver<
    ResolversTypes['InAppNotificationCategory'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  receiver?: Resolver<ResolversTypes['Contributor'], ParentType, ContextType>;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  state?: Resolver<
    ResolversTypes['InAppNotificationState'],
    ParentType,
    ContextType
  >;
  triggeredAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  triggeredBy?: Resolver<
    Maybe<ResolversTypes['Contributor']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['NotificationEvent'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InAppNotificationCommunityNewMemberResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InAppNotificationCommunityNewMember'] = ResolversParentTypes['InAppNotificationCommunityNewMember'],
> = {
  actor?: Resolver<
    Maybe<ResolversTypes['Contributor']>,
    ParentType,
    ContextType
  >;
  category?: Resolver<
    ResolversTypes['InAppNotificationCategory'],
    ParentType,
    ContextType
  >;
  contributorType?: Resolver<
    ResolversTypes['RoleSetContributorType'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  receiver?: Resolver<ResolversTypes['Contributor'], ParentType, ContextType>;
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType>;
  state?: Resolver<
    ResolversTypes['InAppNotificationState'],
    ParentType,
    ContextType
  >;
  triggeredAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  triggeredBy?: Resolver<
    Maybe<ResolversTypes['Contributor']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['NotificationEvent'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InAppNotificationUserMentionedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InAppNotificationUserMentioned'] = ResolversParentTypes['InAppNotificationUserMentioned'],
> = {
  category?: Resolver<
    ResolversTypes['InAppNotificationCategory'],
    ParentType,
    ContextType
  >;
  comment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  commentOriginName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  commentUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contributorType?: Resolver<
    ResolversTypes['RoleSetContributorType'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  receiver?: Resolver<ResolversTypes['Contributor'], ParentType, ContextType>;
  state?: Resolver<
    ResolversTypes['InAppNotificationState'],
    ParentType,
    ContextType
  >;
  triggeredAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  triggeredBy?: Resolver<
    Maybe<ResolversTypes['Contributor']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['NotificationEvent'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InnovationFlowResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InnovationFlow'] = ResolversParentTypes['InnovationFlow'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentState?: Resolver<
    Maybe<ResolversTypes['InnovationFlowState']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  settings?: Resolver<
    ResolversTypes['InnovationFlowSettings'],
    ParentType,
    ContextType
  >;
  states?: Resolver<
    Array<ResolversTypes['InnovationFlowState']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InnovationFlowSettingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InnovationFlowSettings'] = ResolversParentTypes['InnovationFlowSettings'],
> = {
  maximumNumberOfStates?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  minimumNumberOfStates?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InnovationFlowStateResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InnovationFlowState'] = ResolversParentTypes['InnovationFlowState'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  settings?: Resolver<
    ResolversTypes['InnovationFlowStateSettings'],
    ParentType,
    ContextType
  >;
  sortOrder?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InnovationFlowStateSettingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InnovationFlowStateSettings'] = ResolversParentTypes['InnovationFlowStateSettings'],
> = {
  allowNewCallouts?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InnovationHubResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InnovationHub'] = ResolversParentTypes['InnovationHub'],
> = {
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  listedInStore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['Contributor'], ParentType, ContextType>;
  searchVisibility?: Resolver<
    ResolversTypes['SearchVisibility'],
    ParentType,
    ContextType
  >;
  spaceListFilter?: Resolver<
    Maybe<Array<ResolversTypes['Space']>>,
    ParentType,
    ContextType
  >;
  spaceVisibilityFilter?: Resolver<
    Maybe<ResolversTypes['SpaceVisibility']>,
    ParentType,
    ContextType
  >;
  subdomain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['InnovationHubType'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InnovationPackResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InnovationPack'] = ResolversParentTypes['InnovationPack'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  listedInStore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['Contributor'], ParentType, ContextType>;
  searchVisibility?: Resolver<
    ResolversTypes['SearchVisibility'],
    ParentType,
    ContextType
  >;
  templatesSet?: Resolver<
    Maybe<ResolversTypes['TemplatesSet']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InputCreatorQueryResultsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['InputCreatorQueryResults'] = ResolversParentTypes['InputCreatorQueryResults'],
> = {
  callout?: Resolver<
    Maybe<ResolversTypes['CreateCalloutData']>,
    ParentType,
    ContextType,
    RequireFields<InputCreatorQueryResultsCalloutArgs, 'ID'>
  >;
  collaboration?: Resolver<
    Maybe<ResolversTypes['CreateCollaborationData']>,
    ParentType,
    ContextType,
    RequireFields<InputCreatorQueryResultsCollaborationArgs, 'ID'>
  >;
  communityGuidelines?: Resolver<
    Maybe<ResolversTypes['CreateCommunityGuidelinesData']>,
    ParentType,
    ContextType,
    RequireFields<InputCreatorQueryResultsCommunityGuidelinesArgs, 'ID'>
  >;
  innovationFlow?: Resolver<
    Maybe<ResolversTypes['CreateInnovationFlowData']>,
    ParentType,
    ContextType,
    RequireFields<InputCreatorQueryResultsInnovationFlowArgs, 'ID'>
  >;
  whiteboard?: Resolver<
    Maybe<ResolversTypes['CreateWhiteboardData']>,
    ParentType,
    ContextType,
    RequireFields<InputCreatorQueryResultsWhiteboardArgs, 'ID'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvitationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Invitation'] = ResolversParentTypes['Invitation'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  contributor?: Resolver<
    ResolversTypes['Contributor'],
    ParentType,
    ContextType
  >;
  contributorType?: Resolver<
    ResolversTypes['RoleSetContributorType'],
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  extraRoles?: Resolver<
    Array<ResolversTypes['RoleName']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  invitedToParent?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  isFinalized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lifecycle?: Resolver<ResolversTypes['Lifecycle'], ParentType, ContextType>;
  nextEvents?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  welcomeMessage?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type KnowledgeBaseResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['KnowledgeBase'] = ResolversParentTypes['KnowledgeBase'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  calloutsSet?: Resolver<
    ResolversTypes['CalloutsSet'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LatestReleaseDiscussionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LatestReleaseDiscussion'] = ResolversParentTypes['LatestReleaseDiscussion'],
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LibraryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Library'] = ResolversParentTypes['Library'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  innovationHubs?: Resolver<
    Array<ResolversTypes['InnovationHub']>,
    ParentType,
    ContextType
  >;
  innovationPacks?: Resolver<
    Array<ResolversTypes['InnovationPack']>,
    ParentType,
    ContextType,
    Partial<LibraryInnovationPacksArgs>
  >;
  templates?: Resolver<
    Array<ResolversTypes['TemplateResult']>,
    ParentType,
    ContextType,
    Partial<LibraryTemplatesArgs>
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  virtualContributors?: Resolver<
    Array<ResolversTypes['VirtualContributor']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LicenseResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['License'] = ResolversParentTypes['License'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  availableEntitlements?: Resolver<
    Maybe<Array<ResolversTypes['LicenseEntitlementType']>>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  entitlements?: Resolver<
    Array<ResolversTypes['LicenseEntitlement']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  type?: Resolver<
    Maybe<ResolversTypes['LicenseType']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LicenseEntitlementResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LicenseEntitlement'] = ResolversParentTypes['LicenseEntitlement'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dataType?: Resolver<
    ResolversTypes['LicenseEntitlementDataType'],
    ParentType,
    ContextType
  >;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  type?: Resolver<
    ResolversTypes['LicenseEntitlementType'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  usage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LicensePlanResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LicensePlan'] = ResolversParentTypes['LicensePlan'],
> = {
  assignToNewOrganizationAccounts?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  assignToNewUserAccounts?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isFree?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  licenseCredential?: Resolver<
    ResolversTypes['LicensingCredentialBasedCredentialType'],
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pricePerMonth?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  requiresContactSupport?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  requiresPaymentMethod?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  sortOrder?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  trialEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<
    ResolversTypes['LicensingCredentialBasedPlanType'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LicensePolicyResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LicensePolicy'] = ResolversParentTypes['LicensePolicy'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  credentialRules?: Resolver<
    Array<ResolversTypes['LicensingCredentialBasedPolicyCredentialRule']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LicensingResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Licensing'] = ResolversParentTypes['Licensing'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  plans?: Resolver<
    Array<ResolversTypes['LicensePlan']>,
    ParentType,
    ContextType
  >;
  policy?: Resolver<ResolversTypes['LicensePolicy'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LicensingCredentialBasedPolicyCredentialRuleResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LicensingCredentialBasedPolicyCredentialRule'] = ResolversParentTypes['LicensingCredentialBasedPolicyCredentialRule'],
> = {
  credentialType?: Resolver<
    ResolversTypes['LicensingCredentialBasedCredentialType'],
    ParentType,
    ContextType
  >;
  grantedEntitlements?: Resolver<
    Array<ResolversTypes['LicensingGrantedEntitlement']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LicensingGrantedEntitlementResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LicensingGrantedEntitlement'] = ResolversParentTypes['LicensingGrantedEntitlement'],
> = {
  limit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  type?: Resolver<
    ResolversTypes['LicenseEntitlementType'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LifecycleResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Lifecycle'] = ResolversParentTypes['Lifecycle'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface LifecycleDefinitionScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['LifecycleDefinition'], any> {
  name: 'LifecycleDefinition';
}

export type LinkResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Link'] = ResolversParentTypes['Link'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Location'] = ResolversParentTypes['Location'],
> = {
  addressLine1?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  addressLine2?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  geoLocation?: Resolver<
    ResolversTypes['GeoLocation'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  postalCode?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  stateOrProvince?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LookupByNameQueryResultsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LookupByNameQueryResults'] = ResolversParentTypes['LookupByNameQueryResults'],
> = {
  innovationHub?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<LookupByNameQueryResultsInnovationHubArgs, 'NAMEID'>
  >;
  innovationPack?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<LookupByNameQueryResultsInnovationPackArgs, 'NAMEID'>
  >;
  organization?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<LookupByNameQueryResultsOrganizationArgs, 'NAMEID'>
  >;
  space?: Resolver<
    Maybe<ResolversTypes['Space']>,
    ParentType,
    ContextType,
    RequireFields<LookupByNameQueryResultsSpaceArgs, 'NAMEID'>
  >;
  template?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<
      LookupByNameQueryResultsTemplateArgs,
      'NAMEID' | 'templatesSetID'
    >
  >;
  user?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<LookupByNameQueryResultsUserArgs, 'NAMEID'>
  >;
  virtualContributor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<LookupByNameQueryResultsVirtualContributorArgs, 'NAMEID'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LookupMyPrivilegesQueryResultsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LookupMyPrivilegesQueryResults'] = ResolversParentTypes['LookupMyPrivilegesQueryResults'],
> = {
  account?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsAccountArgs, 'ID'>
  >;
  application?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsApplicationArgs, 'ID'>
  >;
  calendar?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsCalendarArgs, 'ID'>
  >;
  calendarEvent?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsCalendarEventArgs, 'ID'>
  >;
  callout?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsCalloutArgs, 'ID'>
  >;
  collaboration?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsCollaborationArgs, 'ID'>
  >;
  community?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsCommunityArgs, 'ID'>
  >;
  communityGuidelines?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsCommunityGuidelinesArgs, 'ID'>
  >;
  document?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsDocumentArgs, 'ID'>
  >;
  innovationFlow?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsInnovationFlowArgs, 'ID'>
  >;
  innovationHub?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsInnovationHubArgs, 'ID'>
  >;
  innovationPack?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsInnovationPackArgs, 'ID'>
  >;
  invitation?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsInvitationArgs, 'ID'>
  >;
  license?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsLicenseArgs, 'ID'>
  >;
  post?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsPostArgs, 'ID'>
  >;
  profile?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsProfileArgs, 'ID'>
  >;
  roleSet?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsRoleSetArgs, 'ID'>
  >;
  room?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsRoomArgs, 'ID'>
  >;
  space?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsSpaceArgs, 'ID'>
  >;
  spaceAbout?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsSpaceAboutArgs, 'ID'>
  >;
  storageAggregator?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsStorageAggregatorArgs, 'ID'>
  >;
  storageBucket?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsStorageBucketArgs, 'ID'>
  >;
  template?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsTemplateArgs, 'ID'>
  >;
  templatesManager?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsTemplatesManagerArgs, 'ID'>
  >;
  templatesSet?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsTemplatesSetArgs, 'ID'>
  >;
  user?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsUserArgs, 'ID'>
  >;
  virtualContributor?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsVirtualContributorArgs, 'ID'>
  >;
  whiteboard?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<LookupMyPrivilegesQueryResultsWhiteboardArgs, 'ID'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LookupQueryResultsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['LookupQueryResults'] = ResolversParentTypes['LookupQueryResults'],
> = {
  about?: Resolver<
    Maybe<ResolversTypes['SpaceAbout']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsAboutArgs, 'ID'>
  >;
  account?: Resolver<
    Maybe<ResolversTypes['Account']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsAccountArgs, 'ID'>
  >;
  application?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsApplicationArgs, 'ID'>
  >;
  authorizationPolicy?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsAuthorizationPolicyArgs, 'ID'>
  >;
  authorizationPrivilegesForUser?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType,
    RequireFields<
      LookupQueryResultsAuthorizationPrivilegesForUserArgs,
      'authorizationPolicyID' | 'userID'
    >
  >;
  calendar?: Resolver<
    Maybe<ResolversTypes['Calendar']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsCalendarArgs, 'ID'>
  >;
  calendarEvent?: Resolver<
    Maybe<ResolversTypes['CalendarEvent']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsCalendarEventArgs, 'ID'>
  >;
  callout?: Resolver<
    Maybe<ResolversTypes['Callout']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsCalloutArgs, 'ID'>
  >;
  calloutsSet?: Resolver<
    Maybe<ResolversTypes['CalloutsSet']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsCalloutsSetArgs, 'ID'>
  >;
  collaboration?: Resolver<
    Maybe<ResolversTypes['Collaboration']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsCollaborationArgs, 'ID'>
  >;
  community?: Resolver<
    Maybe<ResolversTypes['Community']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsCommunityArgs, 'ID'>
  >;
  communityGuidelines?: Resolver<
    Maybe<ResolversTypes['CommunityGuidelines']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsCommunityGuidelinesArgs, 'ID'>
  >;
  document?: Resolver<
    Maybe<ResolversTypes['Document']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsDocumentArgs, 'ID'>
  >;
  innovationFlow?: Resolver<
    Maybe<ResolversTypes['InnovationFlow']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsInnovationFlowArgs, 'ID'>
  >;
  innovationHub?: Resolver<
    Maybe<ResolversTypes['InnovationHub']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsInnovationHubArgs, 'ID'>
  >;
  innovationPack?: Resolver<
    Maybe<ResolversTypes['InnovationPack']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsInnovationPackArgs, 'ID'>
  >;
  invitation?: Resolver<
    Maybe<ResolversTypes['Invitation']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsInvitationArgs, 'ID'>
  >;
  knowledgeBase?: Resolver<
    ResolversTypes['KnowledgeBase'],
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsKnowledgeBaseArgs, 'ID'>
  >;
  license?: Resolver<
    Maybe<ResolversTypes['License']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsLicenseArgs, 'ID'>
  >;
  memo?: Resolver<
    Maybe<ResolversTypes['Memo']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsMemoArgs, 'ID'>
  >;
  myPrivileges?: Resolver<
    Maybe<ResolversTypes['LookupMyPrivilegesQueryResults']>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes['Organization']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsOrganizationArgs, 'ID'>
  >;
  platformInvitation?: Resolver<
    Maybe<ResolversTypes['PlatformInvitation']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsPlatformInvitationArgs, 'ID'>
  >;
  post?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsPostArgs, 'ID'>
  >;
  profile?: Resolver<
    Maybe<ResolversTypes['Profile']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsProfileArgs, 'ID'>
  >;
  roleSet?: Resolver<
    Maybe<ResolversTypes['RoleSet']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsRoleSetArgs, 'ID'>
  >;
  room?: Resolver<
    Maybe<ResolversTypes['Room']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsRoomArgs, 'ID'>
  >;
  space?: Resolver<
    Maybe<ResolversTypes['Space']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsSpaceArgs, 'ID'>
  >;
  storageAggregator?: Resolver<
    Maybe<ResolversTypes['StorageAggregator']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsStorageAggregatorArgs, 'ID'>
  >;
  storageBucket?: Resolver<
    Maybe<ResolversTypes['StorageBucket']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsStorageBucketArgs, 'ID'>
  >;
  template?: Resolver<
    Maybe<ResolversTypes['Template']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsTemplateArgs, 'ID'>
  >;
  templateContentSpace?: Resolver<
    Maybe<ResolversTypes['TemplateContentSpace']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsTemplateContentSpaceArgs, 'ID'>
  >;
  templatesManager?: Resolver<
    Maybe<ResolversTypes['TemplatesManager']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsTemplatesManagerArgs, 'ID'>
  >;
  templatesSet?: Resolver<
    Maybe<ResolversTypes['TemplatesSet']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsTemplatesSetArgs, 'ID'>
  >;
  user?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsUserArgs, 'ID'>
  >;
  virtualContributor?: Resolver<
    Maybe<ResolversTypes['VirtualContributor']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsVirtualContributorArgs, 'ID'>
  >;
  whiteboard?: Resolver<
    Maybe<ResolversTypes['Whiteboard']>,
    ParentType,
    ContextType,
    RequireFields<LookupQueryResultsWhiteboardArgs, 'ID'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface MarkdownScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Markdown'], any> {
  name: 'Markdown';
}

export type MeQueryResultsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MeQueryResults'] = ResolversParentTypes['MeQueryResults'],
> = {
  communityApplications?: Resolver<
    Array<ResolversTypes['CommunityApplicationResult']>,
    ParentType,
    ContextType,
    Partial<MeQueryResultsCommunityApplicationsArgs>
  >;
  communityInvitations?: Resolver<
    Array<ResolversTypes['CommunityInvitationResult']>,
    ParentType,
    ContextType,
    Partial<MeQueryResultsCommunityInvitationsArgs>
  >;
  communityInvitationsCount?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType,
    Partial<MeQueryResultsCommunityInvitationsCountArgs>
  >;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mySpaces?: Resolver<
    Array<ResolversTypes['MySpaceResults']>,
    ParentType,
    ContextType,
    Partial<MeQueryResultsMySpacesArgs>
  >;
  spaceMembershipsFlat?: Resolver<
    Array<ResolversTypes['CommunityMembershipResult']>,
    ParentType,
    ContextType
  >;
  spaceMembershipsHierarchical?: Resolver<
    Array<ResolversTypes['CommunityMembershipResult']>,
    ParentType,
    ContextType,
    Partial<MeQueryResultsSpaceMembershipsHierarchicalArgs>
  >;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Memo'] = ResolversParentTypes['Memo'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contentUpdatePolicy?: Resolver<
    ResolversTypes['ContentUpdatePolicy'],
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isMultiUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface MemoContentScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['MemoContent'], any> {
  name: 'MemoContent';
}

export type MessageResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Message'] = ResolversParentTypes['Message'],
> = {
  id?: Resolver<ResolversTypes['MessageID'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['Markdown'], ParentType, ContextType>;
  reactions?: Resolver<
    Array<ResolversTypes['Reaction']>,
    ParentType,
    ContextType
  >;
  sender?: Resolver<
    Maybe<ResolversTypes['Contributor']>,
    ParentType,
    ContextType
  >;
  threadID?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageAnswerQuestionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MessageAnswerQuestion'] = ResolversParentTypes['MessageAnswerQuestion'],
> = {
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface MessageIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['MessageID'], any> {
  name: 'MessageID';
}

export type MetadataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Metadata'] = ResolversParentTypes['Metadata'],
> = {
  services?: Resolver<
    Array<ResolversTypes['ServiceMetadata']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MigrateEmbeddingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MigrateEmbeddings'] = ResolversParentTypes['MigrateEmbeddings'],
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModelCardAiEngineResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ModelCardAiEngineResult'] = ResolversParentTypes['ModelCardAiEngineResult'],
> = {
  additionalTechnicalDetails?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  areAnswersRestrictedToBodyOfKnowledge?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  canAccessWebWhenAnswering?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  hostingLocation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isExternal?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isInteractionDataUsedForTraining?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  isUsingOpenWeightsModel?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModelCardMonitoringResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ModelCardMonitoringResult'] = ResolversParentTypes['ModelCardMonitoringResult'],
> = {
  isUsageMonitoredByAlkemio?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModelCardSpaceUsageResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ModelCardSpaceUsageResult'] = ResolversParentTypes['ModelCardSpaceUsageResult'],
> = {
  flags?: Resolver<
    Array<ResolversTypes['AiPersonaModelCardFlag']>,
    ParentType,
    ContextType
  >;
  modelCardEntry?: Resolver<
    ResolversTypes['AiPersonaModelCardEntry'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  addIframeAllowedURL?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<MutationAddIframeAllowedUrlArgs, 'whitelistedURL'>
  >;
  addReactionToMessageInRoom?: Resolver<
    ResolversTypes['Reaction'],
    ParentType,
    ContextType,
    RequireFields<MutationAddReactionToMessageInRoomArgs, 'reactionData'>
  >;
  adminCommunicationEnsureAccessToCommunications?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<
      MutationAdminCommunicationEnsureAccessToCommunicationsArgs,
      'communicationData'
    >
  >;
  adminCommunicationRemoveOrphanedRoom?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<
      MutationAdminCommunicationRemoveOrphanedRoomArgs,
      'orphanedRoomData'
    >
  >;
  adminCommunicationUpdateRoomState?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<
      MutationAdminCommunicationUpdateRoomStateArgs,
      'roomStateData'
    >
  >;
  adminSearchIngestFromScratch?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  adminUpdateContributorAvatars?: Resolver<
    ResolversTypes['Profile'],
    ParentType,
    ContextType,
    RequireFields<MutationAdminUpdateContributorAvatarsArgs, 'profileID'>
  >;
  adminUpdateGeoLocationData?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  adminUserAccountDelete?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationAdminUserAccountDeleteArgs, 'userID'>
  >;
  adminWingbackCreateTestCustomer?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  adminWingbackGetCustomerEntitlements?: Resolver<
    Array<ResolversTypes['LicensingGrantedEntitlement']>,
    ParentType,
    ContextType,
    RequireFields<
      MutationAdminWingbackGetCustomerEntitlementsArgs,
      'customerID'
    >
  >;
  aiServerAuthorizationPolicyReset?: Resolver<
    ResolversTypes['AiServer'],
    ParentType,
    ContextType
  >;
  aiServerCreateAiPersonaService?: Resolver<
    ResolversTypes['AiPersonaService'],
    ParentType,
    ContextType,
    RequireFields<
      MutationAiServerCreateAiPersonaServiceArgs,
      'aiPersonaServiceData'
    >
  >;
  aiServerDeleteAiPersonaService?: Resolver<
    ResolversTypes['AiPersonaService'],
    ParentType,
    ContextType,
    RequireFields<MutationAiServerDeleteAiPersonaServiceArgs, 'deleteData'>
  >;
  aiServerUpdateAiPersonaService?: Resolver<
    ResolversTypes['AiPersonaService'],
    ParentType,
    ContextType,
    RequireFields<
      MutationAiServerUpdateAiPersonaServiceArgs,
      'aiPersonaServiceData'
    >
  >;
  applyForEntryRoleOnRoleSet?: Resolver<
    ResolversTypes['Application'],
    ParentType,
    ContextType,
    RequireFields<MutationApplyForEntryRoleOnRoleSetArgs, 'applicationData'>
  >;
  askChatGuidanceQuestion?: Resolver<
    ResolversTypes['MessageAnswerQuestion'],
    ParentType,
    ContextType,
    RequireFields<MutationAskChatGuidanceQuestionArgs, 'chatData'>
  >;
  assignLicensePlanToAccount?: Resolver<
    ResolversTypes['Account'],
    ParentType,
    ContextType,
    RequireFields<MutationAssignLicensePlanToAccountArgs, 'planData'>
  >;
  assignLicensePlanToSpace?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationAssignLicensePlanToSpaceArgs, 'planData'>
  >;
  assignPlatformRoleToUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationAssignPlatformRoleToUserArgs, 'roleData'>
  >;
  assignRoleToOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<MutationAssignRoleToOrganizationArgs, 'roleData'>
  >;
  assignRoleToUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationAssignRoleToUserArgs, 'roleData'>
  >;
  assignRoleToVirtualContributor?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType,
    RequireFields<MutationAssignRoleToVirtualContributorArgs, 'roleData'>
  >;
  assignUserToGroup?: Resolver<
    ResolversTypes['UserGroup'],
    ParentType,
    ContextType,
    RequireFields<MutationAssignUserToGroupArgs, 'membershipData'>
  >;
  authorizationPolicyResetAll?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  authorizationPolicyResetOnAccount?: Resolver<
    ResolversTypes['Account'],
    ParentType,
    ContextType,
    RequireFields<
      MutationAuthorizationPolicyResetOnAccountArgs,
      'authorizationResetData'
    >
  >;
  authorizationPolicyResetOnOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<
      MutationAuthorizationPolicyResetOnOrganizationArgs,
      'authorizationResetData'
    >
  >;
  authorizationPolicyResetOnPlatform?: Resolver<
    ResolversTypes['Platform'],
    ParentType,
    ContextType
  >;
  authorizationPolicyResetOnUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<
      MutationAuthorizationPolicyResetOnUserArgs,
      'authorizationResetData'
    >
  >;
  authorizationPolicyResetToGlobalAdminsAccess?: Resolver<
    ResolversTypes['Authorization'],
    ParentType,
    ContextType,
    RequireFields<
      MutationAuthorizationPolicyResetToGlobalAdminsAccessArgs,
      'authorizationID'
    >
  >;
  beginAlkemioUserVerifiedCredentialOfferInteraction?: Resolver<
    ResolversTypes['AgentBeginVerifiedCredentialOfferOutput'],
    ParentType,
    ContextType
  >;
  beginCommunityMemberVerifiedCredentialOfferInteraction?: Resolver<
    ResolversTypes['AgentBeginVerifiedCredentialOfferOutput'],
    ParentType,
    ContextType,
    RequireFields<
      MutationBeginCommunityMemberVerifiedCredentialOfferInteractionArgs,
      'communityID'
    >
  >;
  beginVerifiedCredentialRequestInteraction?: Resolver<
    ResolversTypes['AgentBeginVerifiedCredentialRequestOutput'],
    ParentType,
    ContextType,
    RequireFields<
      MutationBeginVerifiedCredentialRequestInteractionArgs,
      'types'
    >
  >;
  cleanupCollections?: Resolver<
    ResolversTypes['MigrateEmbeddings'],
    ParentType,
    ContextType
  >;
  convertSpaceL1ToSpaceL0?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationConvertSpaceL1ToSpaceL0Args, 'convertData'>
  >;
  convertSpaceL1ToSpaceL2?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationConvertSpaceL1ToSpaceL2Args, 'convertData'>
  >;
  convertSpaceL2ToSpaceL1?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationConvertSpaceL2ToSpaceL1Args, 'convertData'>
  >;
  convertVirtualContributorToUseKnowledgeBase?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType,
    RequireFields<
      MutationConvertVirtualContributorToUseKnowledgeBaseArgs,
      'conversionData'
    >
  >;
  createCalloutOnCalloutsSet?: Resolver<
    ResolversTypes['Callout'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateCalloutOnCalloutsSetArgs, 'calloutData'>
  >;
  createChatGuidanceRoom?: Resolver<
    Maybe<ResolversTypes['Room']>,
    ParentType,
    ContextType
  >;
  createContributionOnCallout?: Resolver<
    ResolversTypes['CalloutContribution'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateContributionOnCalloutArgs, 'contributionData'>
  >;
  createDiscussion?: Resolver<
    ResolversTypes['Discussion'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateDiscussionArgs, 'createData'>
  >;
  createEventOnCalendar?: Resolver<
    ResolversTypes['CalendarEvent'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateEventOnCalendarArgs, 'eventData'>
  >;
  createGroupOnCommunity?: Resolver<
    ResolversTypes['UserGroup'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateGroupOnCommunityArgs, 'groupData'>
  >;
  createGroupOnOrganization?: Resolver<
    ResolversTypes['UserGroup'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateGroupOnOrganizationArgs, 'groupData'>
  >;
  createInnovationHub?: Resolver<
    ResolversTypes['InnovationHub'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateInnovationHubArgs, 'createData'>
  >;
  createInnovationPack?: Resolver<
    ResolversTypes['InnovationPack'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateInnovationPackArgs, 'innovationPackData'>
  >;
  createLicensePlan?: Resolver<
    ResolversTypes['LicensePlan'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateLicensePlanArgs, 'planData'>
  >;
  createOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateOrganizationArgs, 'organizationData'>
  >;
  createReferenceOnProfile?: Resolver<
    ResolversTypes['Reference'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateReferenceOnProfileArgs, 'referenceInput'>
  >;
  createSpace?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateSpaceArgs, 'spaceData'>
  >;
  createStateOnInnovationFlow?: Resolver<
    ResolversTypes['InnovationFlowState'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateStateOnInnovationFlowArgs, 'stateData'>
  >;
  createSubspace?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateSubspaceArgs, 'subspaceData'>
  >;
  createTagsetOnProfile?: Resolver<
    ResolversTypes['Tagset'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTagsetOnProfileArgs, 'tagsetData'>
  >;
  createTemplate?: Resolver<
    ResolversTypes['Template'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTemplateArgs, 'templateData'>
  >;
  createTemplateFromContentSpace?: Resolver<
    ResolversTypes['Template'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTemplateFromContentSpaceArgs, 'templateData'>
  >;
  createTemplateFromSpace?: Resolver<
    ResolversTypes['Template'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTemplateFromSpaceArgs, 'templateData'>
  >;
  createUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'userData'>
  >;
  createUserNewRegistration?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType
  >;
  createVirtualContributor?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType,
    RequireFields<
      MutationCreateVirtualContributorArgs,
      'virtualContributorData'
    >
  >;
  createWingbackAccount?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateWingbackAccountArgs, 'accountID'>
  >;
  deleteCalendarEvent?: Resolver<
    ResolversTypes['CalendarEvent'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteCalendarEventArgs, 'deleteData'>
  >;
  deleteCallout?: Resolver<
    ResolversTypes['Callout'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteCalloutArgs, 'deleteData'>
  >;
  deleteContribution?: Resolver<
    ResolversTypes['CalloutContribution'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteContributionArgs, 'contributionID'>
  >;
  deleteDiscussion?: Resolver<
    ResolversTypes['Discussion'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteDiscussionArgs, 'deleteData'>
  >;
  deleteDocument?: Resolver<
    ResolversTypes['Document'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteDocumentArgs, 'deleteData'>
  >;
  deleteInnovationHub?: Resolver<
    ResolversTypes['InnovationHub'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteInnovationHubArgs, 'deleteData'>
  >;
  deleteInnovationPack?: Resolver<
    ResolversTypes['InnovationPack'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteInnovationPackArgs, 'deleteData'>
  >;
  deleteInvitation?: Resolver<
    ResolversTypes['Invitation'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteInvitationArgs, 'deleteData'>
  >;
  deleteLicensePlan?: Resolver<
    ResolversTypes['LicensePlan'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteLicensePlanArgs, 'deleteData'>
  >;
  deleteLink?: Resolver<
    ResolversTypes['Link'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteLinkArgs, 'deleteData'>
  >;
  deleteMemo?: Resolver<
    ResolversTypes['Memo'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteMemoArgs, 'memoData'>
  >;
  deleteOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteOrganizationArgs, 'deleteData'>
  >;
  deletePlatformInvitation?: Resolver<
    ResolversTypes['PlatformInvitation'],
    ParentType,
    ContextType,
    RequireFields<MutationDeletePlatformInvitationArgs, 'deleteData'>
  >;
  deletePost?: Resolver<
    ResolversTypes['Post'],
    ParentType,
    ContextType,
    RequireFields<MutationDeletePostArgs, 'deleteData'>
  >;
  deleteReference?: Resolver<
    ResolversTypes['Reference'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteReferenceArgs, 'deleteData'>
  >;
  deleteSpace?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteSpaceArgs, 'deleteData'>
  >;
  deleteStateOnInnovationFlow?: Resolver<
    ResolversTypes['InnovationFlowState'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteStateOnInnovationFlowArgs, 'stateData'>
  >;
  deleteStorageBucket?: Resolver<
    ResolversTypes['StorageBucket'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteStorageBucketArgs, 'deleteData'>
  >;
  deleteTemplate?: Resolver<
    ResolversTypes['Template'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteTemplateArgs, 'deleteData'>
  >;
  deleteUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserArgs, 'deleteData'>
  >;
  deleteUserApplication?: Resolver<
    ResolversTypes['Application'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserApplicationArgs, 'deleteData'>
  >;
  deleteUserGroup?: Resolver<
    ResolversTypes['UserGroup'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserGroupArgs, 'deleteData'>
  >;
  deleteVirtualContributor?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteVirtualContributorArgs, 'deleteData'>
  >;
  deleteWhiteboard?: Resolver<
    ResolversTypes['Whiteboard'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteWhiteboardArgs, 'whiteboardData'>
  >;
  eventOnApplication?: Resolver<
    ResolversTypes['Application'],
    ParentType,
    ContextType,
    RequireFields<MutationEventOnApplicationArgs, 'eventData'>
  >;
  eventOnInvitation?: Resolver<
    ResolversTypes['Invitation'],
    ParentType,
    ContextType,
    RequireFields<MutationEventOnInvitationArgs, 'eventData'>
  >;
  eventOnOrganizationVerification?: Resolver<
    ResolversTypes['OrganizationVerification'],
    ParentType,
    ContextType,
    RequireFields<MutationEventOnOrganizationVerificationArgs, 'eventData'>
  >;
  grantCredentialToOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<
      MutationGrantCredentialToOrganizationArgs,
      'grantCredentialData'
    >
  >;
  grantCredentialToUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationGrantCredentialToUserArgs, 'grantCredentialData'>
  >;
  inviteForEntryRoleOnRoleSet?: Resolver<
    Array<ResolversTypes['RoleSetInvitationResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationInviteForEntryRoleOnRoleSetArgs, 'invitationData'>
  >;
  joinRoleSet?: Resolver<
    ResolversTypes['RoleSet'],
    ParentType,
    ContextType,
    RequireFields<MutationJoinRoleSetArgs, 'joinData'>
  >;
  licenseResetOnAccount?: Resolver<
    ResolversTypes['Account'],
    ParentType,
    ContextType,
    RequireFields<MutationLicenseResetOnAccountArgs, 'resetData'>
  >;
  markNotificationsAsRead?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationMarkNotificationsAsReadArgs, 'notificationIds'>
  >;
  markNotificationsAsUnread?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationMarkNotificationsAsUnreadArgs, 'notificationIds'>
  >;
  messageUser?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<MutationMessageUserArgs, 'messageData'>
  >;
  moveContributionToCallout?: Resolver<
    ResolversTypes['CalloutContribution'],
    ParentType,
    ContextType,
    RequireFields<MutationMoveContributionToCalloutArgs, 'moveContributionData'>
  >;
  refreshAllBodiesOfKnowledge?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  refreshVirtualContributorBodyOfKnowledge?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<
      MutationRefreshVirtualContributorBodyOfKnowledgeArgs,
      'refreshData'
    >
  >;
  removeCommunityGuidelinesContent?: Resolver<
    ResolversTypes['CommunityGuidelines'],
    ParentType,
    ContextType,
    RequireFields<
      MutationRemoveCommunityGuidelinesContentArgs,
      'communityGuidelinesData'
    >
  >;
  removeIframeAllowedURL?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveIframeAllowedUrlArgs, 'whitelistedURL'>
  >;
  removeMessageOnRoom?: Resolver<
    ResolversTypes['MessageID'],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveMessageOnRoomArgs, 'messageData'>
  >;
  removePlatformRoleFromUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationRemovePlatformRoleFromUserArgs, 'roleData'>
  >;
  removeReactionToMessageInRoom?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveReactionToMessageInRoomArgs, 'reactionData'>
  >;
  removeRoleFromOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveRoleFromOrganizationArgs, 'roleData'>
  >;
  removeRoleFromUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveRoleFromUserArgs, 'roleData'>
  >;
  removeRoleFromVirtualContributor?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveRoleFromVirtualContributorArgs, 'roleData'>
  >;
  removeUserFromGroup?: Resolver<
    ResolversTypes['UserGroup'],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveUserFromGroupArgs, 'membershipData'>
  >;
  resetChatGuidance?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  resetLicenseOnAccounts?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType
  >;
  revokeCredentialFromOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<
      MutationRevokeCredentialFromOrganizationArgs,
      'revokeCredentialData'
    >
  >;
  revokeCredentialFromUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationRevokeCredentialFromUserArgs, 'revokeCredentialData'>
  >;
  revokeLicensePlanFromAccount?: Resolver<
    ResolversTypes['Account'],
    ParentType,
    ContextType,
    RequireFields<MutationRevokeLicensePlanFromAccountArgs, 'planData'>
  >;
  revokeLicensePlanFromSpace?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationRevokeLicensePlanFromSpaceArgs, 'planData'>
  >;
  sendMessageReplyToRoom?: Resolver<
    ResolversTypes['Message'],
    ParentType,
    ContextType,
    RequireFields<MutationSendMessageReplyToRoomArgs, 'messageData'>
  >;
  sendMessageToCommunityLeads?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationSendMessageToCommunityLeadsArgs, 'messageData'>
  >;
  sendMessageToOrganization?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationSendMessageToOrganizationArgs, 'messageData'>
  >;
  sendMessageToRoom?: Resolver<
    ResolversTypes['Message'],
    ParentType,
    ContextType,
    RequireFields<MutationSendMessageToRoomArgs, 'messageData'>
  >;
  sendMessageToUser?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationSendMessageToUserArgs, 'messageData'>
  >;
  transferCallout?: Resolver<
    ResolversTypes['Callout'],
    ParentType,
    ContextType,
    RequireFields<MutationTransferCalloutArgs, 'transferData'>
  >;
  transferInnovationHubToAccount?: Resolver<
    ResolversTypes['InnovationHub'],
    ParentType,
    ContextType,
    RequireFields<MutationTransferInnovationHubToAccountArgs, 'transferData'>
  >;
  transferInnovationPackToAccount?: Resolver<
    ResolversTypes['InnovationPack'],
    ParentType,
    ContextType,
    RequireFields<MutationTransferInnovationPackToAccountArgs, 'transferData'>
  >;
  transferSpaceToAccount?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationTransferSpaceToAccountArgs, 'transferData'>
  >;
  transferVirtualContributorToAccount?: Resolver<
    ResolversTypes['InnovationPack'],
    ParentType,
    ContextType,
    RequireFields<
      MutationTransferVirtualContributorToAccountArgs,
      'transferData'
    >
  >;
  updateAiPersona?: Resolver<
    ResolversTypes['AiPersona'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateAiPersonaArgs, 'aiPersonaData'>
  >;
  updateAnswerRelevance?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateAnswerRelevanceArgs, 'input'>
  >;
  updateApplicationFormOnRoleSet?: Resolver<
    ResolversTypes['RoleSet'],
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateApplicationFormOnRoleSetArgs,
      'applicationFormData'
    >
  >;
  updateCalendarEvent?: Resolver<
    ResolversTypes['CalendarEvent'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCalendarEventArgs, 'eventData'>
  >;
  updateCallout?: Resolver<
    ResolversTypes['Callout'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCalloutArgs, 'calloutData'>
  >;
  updateCalloutPublishInfo?: Resolver<
    ResolversTypes['Callout'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCalloutPublishInfoArgs, 'calloutData'>
  >;
  updateCalloutVisibility?: Resolver<
    ResolversTypes['Callout'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCalloutVisibilityArgs, 'calloutData'>
  >;
  updateCalloutsSortOrder?: Resolver<
    Array<ResolversTypes['Callout']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCalloutsSortOrderArgs, 'sortOrderData'>
  >;
  updateClassificationTagset?: Resolver<
    ResolversTypes['Tagset'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateClassificationTagsetArgs, 'updateData'>
  >;
  updateCollaborationFromSpaceTemplate?: Resolver<
    ResolversTypes['Collaboration'],
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateCollaborationFromSpaceTemplateArgs,
      'updateData'
    >
  >;
  updateCommunityGuidelines?: Resolver<
    ResolversTypes['CommunityGuidelines'],
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateCommunityGuidelinesArgs,
      'communityGuidelinesData'
    >
  >;
  updateContributionsSortOrder?: Resolver<
    Array<ResolversTypes['CalloutContribution']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateContributionsSortOrderArgs, 'sortOrderData'>
  >;
  updateDiscussion?: Resolver<
    ResolversTypes['Discussion'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateDiscussionArgs, 'updateData'>
  >;
  updateDocument?: Resolver<
    ResolversTypes['Document'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateDocumentArgs, 'documentData'>
  >;
  updateInnovationFlow?: Resolver<
    ResolversTypes['InnovationFlow'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateInnovationFlowArgs, 'innovationFlowData'>
  >;
  updateInnovationFlowCurrentState?: Resolver<
    ResolversTypes['InnovationFlow'],
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateInnovationFlowCurrentStateArgs,
      'innovationFlowStateData'
    >
  >;
  updateInnovationFlowState?: Resolver<
    ResolversTypes['InnovationFlowState'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateInnovationFlowStateArgs, 'stateData'>
  >;
  updateInnovationFlowStatesSortOrder?: Resolver<
    Array<ResolversTypes['InnovationFlowState']>,
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateInnovationFlowStatesSortOrderArgs,
      'sortOrderData'
    >
  >;
  updateInnovationHub?: Resolver<
    ResolversTypes['InnovationHub'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateInnovationHubArgs, 'updateData'>
  >;
  updateInnovationPack?: Resolver<
    ResolversTypes['InnovationPack'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateInnovationPackArgs, 'innovationPackData'>
  >;
  updateLicensePlan?: Resolver<
    ResolversTypes['LicensePlan'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateLicensePlanArgs, 'updateData'>
  >;
  updateLink?: Resolver<
    ResolversTypes['Link'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateLinkArgs, 'linkData'>
  >;
  updateMemo?: Resolver<
    ResolversTypes['Memo'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateMemoArgs, 'memoData'>
  >;
  updateNotificationState?: Resolver<
    ResolversTypes['InAppNotificationState'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateNotificationStateArgs, 'notificationData'>
  >;
  updateOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateOrganizationArgs, 'organizationData'>
  >;
  updateOrganizationPlatformSettings?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateOrganizationPlatformSettingsArgs,
      'organizationData'
    >
  >;
  updateOrganizationSettings?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateOrganizationSettingsArgs, 'settingsData'>
  >;
  updatePlatformSettings?: Resolver<
    ResolversTypes['PlatformSettings'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePlatformSettingsArgs, 'settingsData'>
  >;
  updatePost?: Resolver<
    ResolversTypes['Post'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePostArgs, 'postData'>
  >;
  updateProfile?: Resolver<
    ResolversTypes['Profile'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateProfileArgs, 'profileData'>
  >;
  updateReference?: Resolver<
    ResolversTypes['Reference'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateReferenceArgs, 'referenceData'>
  >;
  updateSpace?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSpaceArgs, 'spaceData'>
  >;
  updateSpacePlatformSettings?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSpacePlatformSettingsArgs, 'updateData'>
  >;
  updateSpaceSettings?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSpaceSettingsArgs, 'settingsData'>
  >;
  updateTagset?: Resolver<
    ResolversTypes['Tagset'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTagsetArgs, 'updateData'>
  >;
  updateTemplate?: Resolver<
    ResolversTypes['Template'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTemplateArgs, 'updateData'>
  >;
  updateTemplateContentSpace?: Resolver<
    ResolversTypes['TemplateContentSpace'],
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateTemplateContentSpaceArgs,
      'templateContentSpaceData'
    >
  >;
  updateTemplateDefault?: Resolver<
    ResolversTypes['TemplateDefault'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTemplateDefaultArgs, 'templateDefaultData'>
  >;
  updateTemplateFromSpace?: Resolver<
    ResolversTypes['Template'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTemplateFromSpaceArgs, 'updateData'>
  >;
  updateUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'userData'>
  >;
  updateUserGroup?: Resolver<
    ResolversTypes['UserGroup'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserGroupArgs, 'userGroupData'>
  >;
  updateUserPlatformSettings?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserPlatformSettingsArgs, 'updateData'>
  >;
  updateUserSettings?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserSettingsArgs, 'settingsData'>
  >;
  updateVirtualContributor?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateVirtualContributorArgs,
      'virtualContributorData'
    >
  >;
  updateVirtualContributorSettings?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateVirtualContributorSettingsArgs, 'settingsData'>
  >;
  updateVisual?: Resolver<
    ResolversTypes['Visual'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateVisualArgs, 'updateData'>
  >;
  updateWhiteboard?: Resolver<
    ResolversTypes['Whiteboard'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateWhiteboardArgs, 'whiteboardData'>
  >;
  uploadFileOnLink?: Resolver<
    ResolversTypes['Link'],
    ParentType,
    ContextType,
    RequireFields<MutationUploadFileOnLinkArgs, 'file' | 'uploadData'>
  >;
  uploadFileOnReference?: Resolver<
    ResolversTypes['Reference'],
    ParentType,
    ContextType,
    RequireFields<MutationUploadFileOnReferenceArgs, 'file' | 'uploadData'>
  >;
  uploadFileOnStorageBucket?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<MutationUploadFileOnStorageBucketArgs, 'file' | 'uploadData'>
  >;
  uploadImageOnVisual?: Resolver<
    ResolversTypes['Visual'],
    ParentType,
    ContextType,
    RequireFields<MutationUploadImageOnVisualArgs, 'file' | 'uploadData'>
  >;
};

export type MySpaceResultsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['MySpaceResults'] = ResolversParentTypes['MySpaceResults'],
> = {
  latestActivity?: Resolver<
    Maybe<ResolversTypes['ActivityLogEntry']>,
    ParentType,
    ContextType
  >;
  space?: Resolver<ResolversTypes['Space'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NvpResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['NVP'] = ResolversParentTypes['NVP'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface NameIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['NameID'], any> {
  name: 'NameID';
}

export type NotificationRecipientResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NotificationRecipientResult'] = ResolversParentTypes['NotificationRecipientResult'],
> = {
  emailRecipients?: Resolver<
    Array<ResolversTypes['User']>,
    ParentType,
    ContextType
  >;
  inAppRecipients?: Resolver<
    Array<ResolversTypes['User']>,
    ParentType,
    ContextType
  >;
  triggeredBy?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Organization'] = ResolversParentTypes['Organization'],
> = {
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  agent?: Resolver<ResolversTypes['Agent'], ParentType, ContextType>;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  contactEmail?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  domain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  group?: Resolver<
    Maybe<ResolversTypes['UserGroup']>,
    ParentType,
    ContextType,
    RequireFields<OrganizationGroupArgs, 'ID'>
  >;
  groups?: Resolver<
    Maybe<Array<ResolversTypes['UserGroup']>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  legalEntityName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  metrics?: Resolver<
    Maybe<Array<ResolversTypes['NVP']>>,
    ParentType,
    ContextType
  >;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  roleSet?: Resolver<ResolversTypes['RoleSet'], ParentType, ContextType>;
  settings?: Resolver<
    ResolversTypes['OrganizationSettings'],
    ParentType,
    ContextType
  >;
  storageAggregator?: Resolver<
    Maybe<ResolversTypes['StorageAggregator']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verification?: Resolver<
    ResolversTypes['OrganizationVerification'],
    ParentType,
    ContextType
  >;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationSettingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['OrganizationSettings'] = ResolversParentTypes['OrganizationSettings'],
> = {
  membership?: Resolver<
    ResolversTypes['OrganizationSettingsMembership'],
    ParentType,
    ContextType
  >;
  privacy?: Resolver<
    ResolversTypes['OrganizationSettingsPrivacy'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationSettingsMembershipResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['OrganizationSettingsMembership'] = ResolversParentTypes['OrganizationSettingsMembership'],
> = {
  allowUsersMatchingDomainToJoin?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationSettingsPrivacyResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['OrganizationSettingsPrivacy'] = ResolversParentTypes['OrganizationSettingsPrivacy'],
> = {
  contributionRolesPubliclyVisible?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationVerificationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['OrganizationVerification'] = ResolversParentTypes['OrganizationVerification'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isFinalized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lifecycle?: Resolver<ResolversTypes['Lifecycle'], ParentType, ContextType>;
  nextEvents?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<
    ResolversTypes['OrganizationVerificationEnum'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrganizationsInRolesResponseResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['OrganizationsInRolesResponse'] = ResolversParentTypes['OrganizationsInRolesResponse'],
> = {
  organizations?: Resolver<
    Array<ResolversTypes['Organization']>,
    ParentType,
    ContextType
  >;
  role?: Resolver<ResolversTypes['RoleName'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OryConfigResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['OryConfig'] = ResolversParentTypes['OryConfig'],
> = {
  issuer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kratosPublicBaseURL?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo'],
> = {
  endCursor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  startCursor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedOrganizationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PaginatedOrganization'] = ResolversParentTypes['PaginatedOrganization'],
> = {
  organization?: Resolver<
    Array<ResolversTypes['Organization']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedSpacesResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PaginatedSpaces'] = ResolversParentTypes['PaginatedSpaces'],
> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  spaces?: Resolver<Array<ResolversTypes['Space']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedUsersResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PaginatedUsers'] = ResolversParentTypes['PaginatedUsers'],
> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedVirtualContributorResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PaginatedVirtualContributor'] = ResolversParentTypes['PaginatedVirtualContributor'],
> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  virtualContributors?: Resolver<
    Array<ResolversTypes['VirtualContributor']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlatformResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Platform'] = ResolversParentTypes['Platform'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  chatGuidanceVirtualContributor?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType
  >;
  configuration?: Resolver<ResolversTypes['Config'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  forum?: Resolver<ResolversTypes['Forum'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  innovationHub?: Resolver<
    Maybe<ResolversTypes['InnovationHub']>,
    ParentType,
    ContextType,
    Partial<PlatformInnovationHubArgs>
  >;
  latestReleaseDiscussion?: Resolver<
    Maybe<ResolversTypes['LatestReleaseDiscussion']>,
    ParentType,
    ContextType
  >;
  library?: Resolver<ResolversTypes['Library'], ParentType, ContextType>;
  licensingFramework?: Resolver<
    ResolversTypes['Licensing'],
    ParentType,
    ContextType
  >;
  metadata?: Resolver<ResolversTypes['Metadata'], ParentType, ContextType>;
  roleSet?: Resolver<ResolversTypes['RoleSet'], ParentType, ContextType>;
  settings?: Resolver<
    ResolversTypes['PlatformSettings'],
    ParentType,
    ContextType
  >;
  storageAggregator?: Resolver<
    ResolversTypes['StorageAggregator'],
    ParentType,
    ContextType
  >;
  templatesManager?: Resolver<
    Maybe<ResolversTypes['TemplatesManager']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlatformFeatureFlagResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PlatformFeatureFlag'] = ResolversParentTypes['PlatformFeatureFlag'],
> = {
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<
    ResolversTypes['PlatformFeatureFlagName'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlatformIntegrationSettingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PlatformIntegrationSettings'] = ResolversParentTypes['PlatformIntegrationSettings'],
> = {
  iframeAllowedUrls?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlatformInvitationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PlatformInvitation'] = ResolversParentTypes['PlatformInvitation'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  platformRole?: Resolver<
    Maybe<ResolversTypes['RoleName']>,
    ParentType,
    ContextType
  >;
  profileCreated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  roleSetExtraRoles?: Resolver<
    Array<ResolversTypes['RoleName']>,
    ParentType,
    ContextType
  >;
  roleSetInvitedToParent?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  welcomeMessage?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlatformLocationsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PlatformLocations'] = ResolversParentTypes['PlatformLocations'],
> = {
  about?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aup?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blog?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  community?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contactsupport?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  environment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  feedback?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  forumreleases?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  foundation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  help?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  impact?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  innovationLibrary?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  inspiration?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  landing?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  newuser?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  opensource?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  privacy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  releases?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  security?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  support?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  switchplan?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  terms?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tips?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlatformSettingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PlatformSettings'] = ResolversParentTypes['PlatformSettings'],
> = {
  integration?: Resolver<
    ResolversTypes['PlatformIntegrationSettings'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Post'] = ResolversParentTypes['Post'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  comments?: Resolver<ResolversTypes['Room'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Profile'] = ResolversParentTypes['Profile'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  location?: Resolver<
    Maybe<ResolversTypes['Location']>,
    ParentType,
    ContextType
  >;
  references?: Resolver<
    Maybe<Array<ResolversTypes['Reference']>>,
    ParentType,
    ContextType
  >;
  storageBucket?: Resolver<
    ResolversTypes['StorageBucket'],
    ParentType,
    ContextType
  >;
  tagline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tagset?: Resolver<
    Maybe<ResolversTypes['Tagset']>,
    ParentType,
    ContextType,
    Partial<ProfileTagsetArgs>
  >;
  tagsets?: Resolver<
    Maybe<Array<ResolversTypes['Tagset']>>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    Maybe<ResolversTypes['ProfileType']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  visual?: Resolver<
    Maybe<ResolversTypes['Visual']>,
    ParentType,
    ContextType,
    RequireFields<ProfileVisualArgs, 'type'>
  >;
  visuals?: Resolver<Array<ResolversTypes['Visual']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileCredentialVerifiedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ProfileCredentialVerified'] = ResolversParentTypes['ProfileCredentialVerified'],
> = {
  userEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vc?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  accounts?: Resolver<
    Array<ResolversTypes['Account']>,
    ParentType,
    ContextType
  >;
  activityFeed?: Resolver<
    ResolversTypes['ActivityFeed'],
    ParentType,
    ContextType,
    Partial<QueryActivityFeedArgs>
  >;
  activityFeedGrouped?: Resolver<
    Array<ResolversTypes['ActivityLogEntry']>,
    ParentType,
    ContextType,
    Partial<QueryActivityFeedGroupedArgs>
  >;
  activityLogOnCollaboration?: Resolver<
    Array<ResolversTypes['ActivityLogEntry']>,
    ParentType,
    ContextType,
    RequireFields<QueryActivityLogOnCollaborationArgs, 'queryData'>
  >;
  adminCommunicationMembership?: Resolver<
    ResolversTypes['CommunicationAdminMembershipResult'],
    ParentType,
    ContextType,
    RequireFields<QueryAdminCommunicationMembershipArgs, 'communicationData'>
  >;
  adminCommunicationOrphanedUsage?: Resolver<
    ResolversTypes['CommunicationAdminOrphanedUsageResult'],
    ParentType,
    ContextType
  >;
  aiServer?: Resolver<ResolversTypes['AiServer'], ParentType, ContextType>;
  exploreSpaces?: Resolver<
    Array<ResolversTypes['Space']>,
    ParentType,
    ContextType,
    Partial<QueryExploreSpacesArgs>
  >;
  getSupportedVerifiedCredentialMetadata?: Resolver<
    Array<ResolversTypes['CredentialMetadataOutput']>,
    ParentType,
    ContextType
  >;
  inputCreator?: Resolver<
    ResolversTypes['InputCreatorQueryResults'],
    ParentType,
    ContextType
  >;
  lookup?: Resolver<
    ResolversTypes['LookupQueryResults'],
    ParentType,
    ContextType
  >;
  lookupByName?: Resolver<
    ResolversTypes['LookupByNameQueryResults'],
    ParentType,
    ContextType
  >;
  me?: Resolver<ResolversTypes['MeQueryResults'], ParentType, ContextType>;
  notificationRecipients?: Resolver<
    ResolversTypes['NotificationRecipientResult'],
    ParentType,
    ContextType,
    RequireFields<QueryNotificationRecipientsArgs, 'eventData'>
  >;
  notifications?: Resolver<
    Array<ResolversTypes['InAppNotification']>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<QueryOrganizationArgs, 'ID'>
  >;
  organizations?: Resolver<
    Array<ResolversTypes['Organization']>,
    ParentType,
    ContextType,
    Partial<QueryOrganizationsArgs>
  >;
  organizationsPaginated?: Resolver<
    ResolversTypes['PaginatedOrganization'],
    ParentType,
    ContextType,
    Partial<QueryOrganizationsPaginatedArgs>
  >;
  platform?: Resolver<ResolversTypes['Platform'], ParentType, ContextType>;
  restrictedSpaceNames?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  rolesOrganization?: Resolver<
    ResolversTypes['ContributorRoles'],
    ParentType,
    ContextType,
    RequireFields<QueryRolesOrganizationArgs, 'rolesData'>
  >;
  rolesUser?: Resolver<
    ResolversTypes['ContributorRoles'],
    ParentType,
    ContextType,
    RequireFields<QueryRolesUserArgs, 'rolesData'>
  >;
  rolesVirtualContributor?: Resolver<
    ResolversTypes['ContributorRoles'],
    ParentType,
    ContextType,
    RequireFields<QueryRolesVirtualContributorArgs, 'rolesData'>
  >;
  search?: Resolver<
    ResolversTypes['ISearchResults'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchArgs, 'searchData'>
  >;
  spaces?: Resolver<
    Array<ResolversTypes['Space']>,
    ParentType,
    ContextType,
    Partial<QuerySpacesArgs>
  >;
  spacesPaginated?: Resolver<
    ResolversTypes['PaginatedSpaces'],
    ParentType,
    ContextType,
    Partial<QuerySpacesPaginatedArgs>
  >;
  task?: Resolver<
    ResolversTypes['Task'],
    ParentType,
    ContextType,
    RequireFields<QueryTaskArgs, 'id'>
  >;
  tasks?: Resolver<
    Array<ResolversTypes['Task']>,
    ParentType,
    ContextType,
    Partial<QueryTasksArgs>
  >;
  urlResolver?: Resolver<
    ResolversTypes['UrlResolverQueryResults'],
    ParentType,
    ContextType,
    RequireFields<QueryUrlResolverArgs, 'url'>
  >;
  user?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, 'ID'>
  >;
  userAuthorizationPrivileges?: Resolver<
    Array<ResolversTypes['AuthorizationPrivilege']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryUserAuthorizationPrivilegesArgs,
      'userAuthorizationPrivilegesData'
    >
  >;
  users?: Resolver<
    Array<ResolversTypes['User']>,
    ParentType,
    ContextType,
    Partial<QueryUsersArgs>
  >;
  usersPaginated?: Resolver<
    ResolversTypes['PaginatedUsers'],
    ParentType,
    ContextType,
    Partial<QueryUsersPaginatedArgs>
  >;
  usersWithAuthorizationCredential?: Resolver<
    Array<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryUsersWithAuthorizationCredentialArgs,
      'credentialsCriteriaData'
    >
  >;
  virtualContributor?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType,
    RequireFields<QueryVirtualContributorArgs, 'ID'>
  >;
  virtualContributors?: Resolver<
    Array<ResolversTypes['VirtualContributor']>,
    ParentType,
    ContextType,
    Partial<QueryVirtualContributorsArgs>
  >;
};

export type QuestionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Question'] = ResolversParentTypes['Question'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReactionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Reaction'] = ResolversParentTypes['Reaction'],
> = {
  emoji?: Resolver<ResolversTypes['Emoji'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['MessageID'], ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReferenceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Reference'] = ResolversParentTypes['Reference'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelayPaginatedSpaceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RelayPaginatedSpace'] = ResolversParentTypes['RelayPaginatedSpace'],
> = {
  about?: Resolver<ResolversTypes['SpaceAbout'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  activeSubscription?: Resolver<
    Maybe<ResolversTypes['SpaceSubscription']>,
    ParentType,
    ContextType
  >;
  agent?: Resolver<ResolversTypes['Agent'], ParentType, ContextType>;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  collaboration?: Resolver<
    ResolversTypes['Collaboration'],
    ParentType,
    ContextType
  >;
  community?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['SpaceLevel'], ParentType, ContextType>;
  levelZeroSpaceID?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['SpaceSettings'], ParentType, ContextType>;
  storageAggregator?: Resolver<
    ResolversTypes['StorageAggregator'],
    ParentType,
    ContextType
  >;
  subscriptions?: Resolver<
    Array<ResolversTypes['SpaceSubscription']>,
    ParentType,
    ContextType
  >;
  subspaceByNameID?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<RelayPaginatedSpaceSubspaceByNameIdArgs, 'NAMEID'>
  >;
  subspaces?: Resolver<
    Array<ResolversTypes['Space']>,
    ParentType,
    ContextType,
    Partial<RelayPaginatedSpaceSubspacesArgs>
  >;
  templatesManager?: Resolver<
    Maybe<ResolversTypes['TemplatesManager']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  visibility?: Resolver<
    ResolversTypes['SpaceVisibility'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelayPaginatedSpaceEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RelayPaginatedSpaceEdge'] = ResolversParentTypes['RelayPaginatedSpaceEdge'],
> = {
  node?: Resolver<
    ResolversTypes['RelayPaginatedSpace'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelayPaginatedSpacePageInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RelayPaginatedSpacePageInfo'] = ResolversParentTypes['RelayPaginatedSpacePageInfo'],
> = {
  endCursor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  startCursor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Role'] = ResolversParentTypes['Role'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  credential?: Resolver<
    ResolversTypes['CredentialDefinition'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['RoleName'], ParentType, ContextType>;
  organizationPolicy?: Resolver<
    ResolversTypes['ContributorRolePolicy'],
    ParentType,
    ContextType
  >;
  parentCredentials?: Resolver<
    Array<ResolversTypes['CredentialDefinition']>,
    ParentType,
    ContextType
  >;
  requiresEntryRole?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  requiresSameRoleInParentRoleSet?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userPolicy?: Resolver<
    ResolversTypes['ContributorRolePolicy'],
    ParentType,
    ContextType
  >;
  virtualContributorPolicy?: Resolver<
    ResolversTypes['ContributorRolePolicy'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleSetResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RoleSet'] = ResolversParentTypes['RoleSet'],
> = {
  applicationForm?: Resolver<ResolversTypes['Form'], ParentType, ContextType>;
  applications?: Resolver<
    Array<ResolversTypes['Application']>,
    ParentType,
    ContextType
  >;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  availableUsersForElevatedRole?: Resolver<
    ResolversTypes['PaginatedUsers'],
    ParentType,
    ContextType,
    RequireFields<RoleSetAvailableUsersForElevatedRoleArgs, 'role'>
  >;
  availableUsersForEntryRole?: Resolver<
    ResolversTypes['PaginatedUsers'],
    ParentType,
    ContextType,
    Partial<RoleSetAvailableUsersForEntryRoleArgs>
  >;
  availableVirtualContributorsForEntryRole?: Resolver<
    ResolversTypes['PaginatedVirtualContributor'],
    ParentType,
    ContextType,
    Partial<RoleSetAvailableVirtualContributorsForEntryRoleArgs>
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  entryRoleName?: Resolver<ResolversTypes['RoleName'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  invitations?: Resolver<
    Array<ResolversTypes['Invitation']>,
    ParentType,
    ContextType
  >;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  myMembershipStatus?: Resolver<
    Maybe<ResolversTypes['CommunityMembershipStatus']>,
    ParentType,
    ContextType
  >;
  myRoles?: Resolver<
    Array<ResolversTypes['RoleName']>,
    ParentType,
    ContextType
  >;
  myRolesImplicit?: Resolver<
    Array<ResolversTypes['RoleSetRoleImplicit']>,
    ParentType,
    ContextType
  >;
  organizationsInRole?: Resolver<
    Array<ResolversTypes['Organization']>,
    ParentType,
    ContextType,
    RequireFields<RoleSetOrganizationsInRoleArgs, 'role'>
  >;
  organizationsInRoles?: Resolver<
    Array<ResolversTypes['OrganizationsInRolesResponse']>,
    ParentType,
    ContextType,
    RequireFields<RoleSetOrganizationsInRolesArgs, 'roles'>
  >;
  platformInvitations?: Resolver<
    Array<ResolversTypes['PlatformInvitation']>,
    ParentType,
    ContextType
  >;
  roleDefinition?: Resolver<
    ResolversTypes['Role'],
    ParentType,
    ContextType,
    RequireFields<RoleSetRoleDefinitionArgs, 'role'>
  >;
  roleDefinitions?: Resolver<
    Array<ResolversTypes['Role']>,
    ParentType,
    ContextType,
    Partial<RoleSetRoleDefinitionsArgs>
  >;
  roleNames?: Resolver<
    Array<ResolversTypes['RoleName']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    Maybe<ResolversTypes['RoleSetType']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  usersInRole?: Resolver<
    Array<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<RoleSetUsersInRoleArgs, 'role'>
  >;
  usersInRoles?: Resolver<
    Array<ResolversTypes['UsersInRolesResponse']>,
    ParentType,
    ContextType,
    RequireFields<RoleSetUsersInRolesArgs, 'roles'>
  >;
  virtualContributorsInRole?: Resolver<
    Array<ResolversTypes['VirtualContributor']>,
    ParentType,
    ContextType,
    RequireFields<RoleSetVirtualContributorsInRoleArgs, 'role'>
  >;
  virtualContributorsInRoleInHierarchy?: Resolver<
    Array<ResolversTypes['VirtualContributor']>,
    ParentType,
    ContextType,
    RequireFields<RoleSetVirtualContributorsInRoleInHierarchyArgs, 'role'>
  >;
  virtualContributorsInRoles?: Resolver<
    Array<ResolversTypes['VirtualContributorsInRolesResponse']>,
    ParentType,
    ContextType,
    RequireFields<RoleSetVirtualContributorsInRolesArgs, 'roles'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleSetInvitationResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RoleSetInvitationResult'] = ResolversParentTypes['RoleSetInvitationResult'],
> = {
  invitation?: Resolver<
    Maybe<ResolversTypes['Invitation']>,
    ParentType,
    ContextType
  >;
  platformInvitation?: Resolver<
    Maybe<ResolversTypes['PlatformInvitation']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    ResolversTypes['RoleSetInvitationResultType'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RolesResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RolesResult'] = ResolversParentTypes['RolesResult'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RolesResultCommunityResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RolesResultCommunity'] = ResolversParentTypes['RolesResultCommunity'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['SpaceLevel'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RolesResultOrganizationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RolesResultOrganization'] = ResolversParentTypes['RolesResultOrganization'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  organizationID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  userGroups?: Resolver<
    Array<ResolversTypes['RolesResult']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RolesResultSpaceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RolesResultSpace'] = ResolversParentTypes['RolesResultSpace'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['SpaceLevel'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  spaceID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subspaces?: Resolver<
    Array<ResolversTypes['RolesResultCommunity']>,
    ParentType,
    ContextType
  >;
  visibility?: Resolver<
    ResolversTypes['SpaceVisibility'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoomResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Room'] = ResolversParentTypes['Room'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  messages?: Resolver<
    Array<ResolversTypes['Message']>,
    ParentType,
    ContextType
  >;
  messagesCount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vcInteractions?: Resolver<
    Array<ResolversTypes['VcInteraction']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoomEventSubscriptionResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RoomEventSubscriptionResult'] = ResolversParentTypes['RoomEventSubscriptionResult'],
> = {
  message?: Resolver<
    Maybe<ResolversTypes['RoomMessageEventSubscriptionResult']>,
    ParentType,
    ContextType
  >;
  reaction?: Resolver<
    Maybe<ResolversTypes['RoomMessageReactionEventSubscriptionResult']>,
    ParentType,
    ContextType
  >;
  room?: Resolver<ResolversTypes['Room'], ParentType, ContextType>;
  roomID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoomMessageEventSubscriptionResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RoomMessageEventSubscriptionResult'] = ResolversParentTypes['RoomMessageEventSubscriptionResult'],
> = {
  data?: Resolver<ResolversTypes['Message'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoomMessageReactionEventSubscriptionResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['RoomMessageReactionEventSubscriptionResult'] = ResolversParentTypes['RoomMessageReactionEventSubscriptionResult'],
> = {
  data?: Resolver<ResolversTypes['Reaction'], ParentType, ContextType>;
  messageID?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface SearchCursorScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['SearchCursor'], any> {
  name: 'SearchCursor';
}

export type SearchResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult'],
> = {
  __resolveType: TypeResolveFn<
    | 'SearchResultCallout'
    | 'SearchResultOrganization'
    | 'SearchResultPost'
    | 'SearchResultSpace'
    | 'SearchResultUser',
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  terms?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SearchResultType'], ParentType, ContextType>;
};

export type SearchResultCalloutResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SearchResultCallout'] = ResolversParentTypes['SearchResultCallout'],
> = {
  callout?: Resolver<ResolversTypes['Callout'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  space?: Resolver<ResolversTypes['Space'], ParentType, ContextType>;
  terms?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SearchResultType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchResultOrganizationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SearchResultOrganization'] = ResolversParentTypes['SearchResultOrganization'],
> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  organization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType
  >;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  terms?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SearchResultType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchResultPostResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SearchResultPost'] = ResolversParentTypes['SearchResultPost'],
> = {
  callout?: Resolver<ResolversTypes['Callout'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  space?: Resolver<ResolversTypes['Space'], ParentType, ContextType>;
  terms?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SearchResultType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchResultSpaceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SearchResultSpace'] = ResolversParentTypes['SearchResultSpace'],
> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentSpace?: Resolver<
    Maybe<ResolversTypes['Space']>,
    ParentType,
    ContextType
  >;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  space?: Resolver<ResolversTypes['Space'], ParentType, ContextType>;
  terms?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SearchResultType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchResultUserResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SearchResultUser'] = ResolversParentTypes['SearchResultUser'],
> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  terms?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['SearchResultType'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SentryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Sentry'] = ResolversParentTypes['Sentry'],
> = {
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  endpoint?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  environment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  submitPII?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ServiceMetadataResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ServiceMetadata'] = ResolversParentTypes['ServiceMetadata'],
> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Space'] = ResolversParentTypes['Space'],
> = {
  about?: Resolver<ResolversTypes['SpaceAbout'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  activeSubscription?: Resolver<
    Maybe<ResolversTypes['SpaceSubscription']>,
    ParentType,
    ContextType
  >;
  agent?: Resolver<ResolversTypes['Agent'], ParentType, ContextType>;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  collaboration?: Resolver<
    ResolversTypes['Collaboration'],
    ParentType,
    ContextType
  >;
  community?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['SpaceLevel'], ParentType, ContextType>;
  levelZeroSpaceID?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['SpaceSettings'], ParentType, ContextType>;
  storageAggregator?: Resolver<
    ResolversTypes['StorageAggregator'],
    ParentType,
    ContextType
  >;
  subscriptions?: Resolver<
    Array<ResolversTypes['SpaceSubscription']>,
    ParentType,
    ContextType
  >;
  subspaceByNameID?: Resolver<
    ResolversTypes['Space'],
    ParentType,
    ContextType,
    RequireFields<SpaceSubspaceByNameIdArgs, 'NAMEID'>
  >;
  subspaces?: Resolver<
    Array<ResolversTypes['Space']>,
    ParentType,
    ContextType,
    Partial<SpaceSubspacesArgs>
  >;
  templatesManager?: Resolver<
    Maybe<ResolversTypes['TemplatesManager']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  visibility?: Resolver<
    ResolversTypes['SpaceVisibility'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceAboutResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SpaceAbout'] = ResolversParentTypes['SpaceAbout'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  guidelines?: Resolver<
    ResolversTypes['CommunityGuidelines'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isContentPublic?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  membership?: Resolver<
    ResolversTypes['SpaceAboutMembership'],
    ParentType,
    ContextType
  >;
  metrics?: Resolver<
    Maybe<Array<ResolversTypes['NVP']>>,
    ParentType,
    ContextType
  >;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['Contributor'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  who?: Resolver<Maybe<ResolversTypes['Markdown']>, ParentType, ContextType>;
  why?: Resolver<Maybe<ResolversTypes['Markdown']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceAboutMembershipResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SpaceAboutMembership'] = ResolversParentTypes['SpaceAboutMembership'],
> = {
  applicationForm?: Resolver<ResolversTypes['Form'], ParentType, ContextType>;
  communityID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  leadOrganizations?: Resolver<
    Array<ResolversTypes['Organization']>,
    ParentType,
    ContextType
  >;
  leadUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  myMembershipStatus?: Resolver<
    Maybe<ResolversTypes['CommunityMembershipStatus']>,
    ParentType,
    ContextType
  >;
  myPrivileges?: Resolver<
    Maybe<Array<ResolversTypes['AuthorizationPrivilege']>>,
    ParentType,
    ContextType
  >;
  roleSetID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpacePendingMembershipInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SpacePendingMembershipInfo'] = ResolversParentTypes['SpacePendingMembershipInfo'],
> = {
  about?: Resolver<ResolversTypes['SpaceAbout'], ParentType, ContextType>;
  communityGuidelines?: Resolver<
    ResolversTypes['CommunityGuidelines'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['SpaceLevel'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceSettingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SpaceSettings'] = ResolversParentTypes['SpaceSettings'],
> = {
  collaboration?: Resolver<
    ResolversTypes['SpaceSettingsCollaboration'],
    ParentType,
    ContextType
  >;
  membership?: Resolver<
    ResolversTypes['SpaceSettingsMembership'],
    ParentType,
    ContextType
  >;
  privacy?: Resolver<
    ResolversTypes['SpaceSettingsPrivacy'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceSettingsCollaborationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SpaceSettingsCollaboration'] = ResolversParentTypes['SpaceSettingsCollaboration'],
> = {
  allowEventsFromSubspaces?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  allowMembersToCreateCallouts?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  allowMembersToCreateSubspaces?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  inheritMembershipRights?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceSettingsMembershipResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SpaceSettingsMembership'] = ResolversParentTypes['SpaceSettingsMembership'],
> = {
  allowSubspaceAdminsToInviteMembers?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  policy?: Resolver<
    ResolversTypes['CommunityMembershipPolicy'],
    ParentType,
    ContextType
  >;
  trustedOrganizations?: Resolver<
    Array<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceSettingsPrivacyResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SpaceSettingsPrivacy'] = ResolversParentTypes['SpaceSettingsPrivacy'],
> = {
  allowPlatformSupportAsAdmin?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  mode?: Resolver<ResolversTypes['SpacePrivacyMode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceSubscriptionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SpaceSubscription'] = ResolversParentTypes['SpaceSubscription'],
> = {
  expires?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<
    ResolversTypes['LicensingCredentialBasedCredentialType'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StorageAggregatorResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['StorageAggregator'] = ResolversParentTypes['StorageAggregator'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  directStorageBucket?: Resolver<
    ResolversTypes['StorageBucket'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentEntity?: Resolver<
    Maybe<ResolversTypes['StorageAggregatorParent']>,
    ParentType,
    ContextType
  >;
  size?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  storageAggregators?: Resolver<
    Array<ResolversTypes['StorageAggregator']>,
    ParentType,
    ContextType
  >;
  storageBuckets?: Resolver<
    Array<ResolversTypes['StorageBucket']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    Maybe<ResolversTypes['StorageAggregatorType']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StorageAggregatorParentResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['StorageAggregatorParent'] = ResolversParentTypes['StorageAggregatorParent'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  level?: Resolver<
    Maybe<ResolversTypes['SpaceLevel']>,
    ParentType,
    ContextType
  >;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StorageBucketResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['StorageBucket'] = ResolversParentTypes['StorageBucket'],
> = {
  allowedMimeTypes?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  document?: Resolver<
    Maybe<ResolversTypes['Document']>,
    ParentType,
    ContextType,
    RequireFields<StorageBucketDocumentArgs, 'ID'>
  >;
  documents?: Resolver<
    Array<ResolversTypes['Document']>,
    ParentType,
    ContextType,
    Partial<StorageBucketDocumentsArgs>
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  maxFileSize?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  parentEntity?: Resolver<
    Maybe<ResolversTypes['StorageBucketParent']>,
    ParentType,
    ContextType
  >;
  size?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StorageBucketParentResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['StorageBucketParent'] = ResolversParentTypes['StorageBucketParent'],
> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ProfileType'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StorageConfigResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['StorageConfig'] = ResolversParentTypes['StorageConfig'],
> = {
  file?: Resolver<ResolversTypes['FileStorageConfig'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription'],
> = {
  activityCreated?: SubscriptionResolver<
    ResolversTypes['ActivityCreatedSubscriptionResult'],
    'activityCreated',
    ParentType,
    ContextType,
    RequireFields<SubscriptionActivityCreatedArgs, 'input'>
  >;
  calloutPostCreated?: SubscriptionResolver<
    ResolversTypes['CalloutPostCreated'],
    'calloutPostCreated',
    ParentType,
    ContextType,
    RequireFields<SubscriptionCalloutPostCreatedArgs, 'calloutID'>
  >;
  forumDiscussionUpdated?: SubscriptionResolver<
    ResolversTypes['Discussion'],
    'forumDiscussionUpdated',
    ParentType,
    ContextType,
    RequireFields<SubscriptionForumDiscussionUpdatedArgs, 'forumID'>
  >;
  inAppNotificationReceived?: SubscriptionResolver<
    ResolversTypes['InAppNotification'],
    'inAppNotificationReceived',
    ParentType,
    ContextType
  >;
  profileVerifiedCredential?: SubscriptionResolver<
    ResolversTypes['ProfileCredentialVerified'],
    'profileVerifiedCredential',
    ParentType,
    ContextType
  >;
  roomEvents?: SubscriptionResolver<
    ResolversTypes['RoomEventSubscriptionResult'],
    'roomEvents',
    ParentType,
    ContextType,
    RequireFields<SubscriptionRoomEventsArgs, 'roomID'>
  >;
  subspaceCreated?: SubscriptionResolver<
    ResolversTypes['SubspaceCreated'],
    'subspaceCreated',
    ParentType,
    ContextType,
    RequireFields<SubscriptionSubspaceCreatedArgs, 'spaceID'>
  >;
  virtualContributorUpdated?: SubscriptionResolver<
    ResolversTypes['VirtualContributorUpdatedSubscriptionResult'],
    'virtualContributorUpdated',
    ParentType,
    ContextType,
    RequireFields<
      SubscriptionVirtualContributorUpdatedArgs,
      'virtualContributorID'
    >
  >;
};

export type SubspaceCreatedResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SubspaceCreated'] = ResolversParentTypes['SubspaceCreated'],
> = {
  spaceID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  subspace?: Resolver<ResolversTypes['Space'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagsetResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Tagset'] = ResolversParentTypes['Tagset'],
> = {
  allowedValues?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TagsetType'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagsetTemplateResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TagsetTemplate'] = ResolversParentTypes['TagsetTemplate'],
> = {
  allowedValues?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  defaultSelectedValue?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TagsetType'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Task'] = ResolversParentTypes['Task'],
> = {
  created?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  errors?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  itemsCount?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  itemsDone?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  results?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  start?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemplateResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Template'] = ResolversParentTypes['Template'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  callout?: Resolver<Maybe<ResolversTypes['Callout']>, ParentType, ContextType>;
  communityGuidelines?: Resolver<
    Maybe<ResolversTypes['CommunityGuidelines']>,
    ParentType,
    ContextType
  >;
  contentSpace?: Resolver<
    Maybe<ResolversTypes['TemplateContentSpace']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  postDefaultDescription?: Resolver<
    Maybe<ResolversTypes['Markdown']>,
    ParentType,
    ContextType
  >;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TemplateType'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  whiteboard?: Resolver<
    Maybe<ResolversTypes['Whiteboard']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemplateContentSpaceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TemplateContentSpace'] = ResolversParentTypes['TemplateContentSpace'],
> = {
  about?: Resolver<ResolversTypes['SpaceAbout'], ParentType, ContextType>;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  collaboration?: Resolver<
    ResolversTypes['Collaboration'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['SpaceLevel'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['SpaceSettings'], ParentType, ContextType>;
  subspaces?: Resolver<
    Array<ResolversTypes['TemplateContentSpace']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemplateDefaultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TemplateDefault'] = ResolversParentTypes['TemplateDefault'],
> = {
  allowedTemplateType?: Resolver<
    ResolversTypes['TemplateType'],
    ParentType,
    ContextType
  >;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  template?: Resolver<
    Maybe<ResolversTypes['Template']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    ResolversTypes['TemplateDefaultType'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemplateResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TemplateResult'] = ResolversParentTypes['TemplateResult'],
> = {
  innovationPack?: Resolver<
    ResolversTypes['InnovationPack'],
    ParentType,
    ContextType
  >;
  template?: Resolver<ResolversTypes['Template'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemplatesManagerResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TemplatesManager'] = ResolversParentTypes['TemplatesManager'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  templateDefaults?: Resolver<
    Array<ResolversTypes['TemplateDefault']>,
    ParentType,
    ContextType
  >;
  templatesSet?: Resolver<
    Maybe<ResolversTypes['TemplatesSet']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemplatesSetResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TemplatesSet'] = ResolversParentTypes['TemplatesSet'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  calloutTemplates?: Resolver<
    Array<ResolversTypes['Template']>,
    ParentType,
    ContextType
  >;
  calloutTemplatesCount?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  communityGuidelinesTemplates?: Resolver<
    Array<ResolversTypes['Template']>,
    ParentType,
    ContextType
  >;
  communityGuidelinesTemplatesCount?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  postTemplates?: Resolver<
    Array<ResolversTypes['Template']>,
    ParentType,
    ContextType
  >;
  postTemplatesCount?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  spaceTemplates?: Resolver<
    Array<ResolversTypes['Template']>,
    ParentType,
    ContextType
  >;
  spaceTemplatesCount?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  templates?: Resolver<
    Array<ResolversTypes['Template']>,
    ParentType,
    ContextType
  >;
  templatesCount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  whiteboardTemplates?: Resolver<
    Array<ResolversTypes['Template']>,
    ParentType,
    ContextType
  >;
  whiteboardTemplatesCount?: Resolver<
    ResolversTypes['Float'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimelineResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Timeline'] = ResolversParentTypes['Timeline'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  calendar?: Resolver<ResolversTypes['Calendar'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UuidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UrlResolverQueryResultCalendarResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UrlResolverQueryResultCalendar'] = ResolversParentTypes['UrlResolverQueryResultCalendar'],
> = {
  calendarEventId?: Resolver<
    Maybe<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UrlResolverQueryResultCalloutsSetResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UrlResolverQueryResultCalloutsSet'] = ResolversParentTypes['UrlResolverQueryResultCalloutsSet'],
> = {
  calloutId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  contributionId?: Resolver<
    Maybe<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  postId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['UrlType'], ParentType, ContextType>;
  whiteboardId?: Resolver<
    Maybe<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UrlResolverQueryResultCollaborationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UrlResolverQueryResultCollaboration'] = ResolversParentTypes['UrlResolverQueryResultCollaboration'],
> = {
  calloutsSet?: Resolver<
    ResolversTypes['UrlResolverQueryResultCalloutsSet'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UrlResolverQueryResultInnovationPackResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UrlResolverQueryResultInnovationPack'] = ResolversParentTypes['UrlResolverQueryResultInnovationPack'],
> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  templatesSet?: Resolver<
    ResolversTypes['UrlResolverQueryResultTemplatesSet'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UrlResolverQueryResultSpaceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UrlResolverQueryResultSpace'] = ResolversParentTypes['UrlResolverQueryResultSpace'],
> = {
  calendar?: Resolver<
    Maybe<ResolversTypes['UrlResolverQueryResultCalendar']>,
    ParentType,
    ContextType
  >;
  collaboration?: Resolver<
    ResolversTypes['UrlResolverQueryResultCollaboration'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['SpaceLevel'], ParentType, ContextType>;
  levelZeroSpaceID?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  parentSpaces?: Resolver<
    Array<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  templatesSet?: Resolver<
    Maybe<ResolversTypes['UrlResolverQueryResultTemplatesSet']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UrlResolverQueryResultTemplatesSetResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UrlResolverQueryResultTemplatesSet'] = ResolversParentTypes['UrlResolverQueryResultTemplatesSet'],
> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  templateId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UrlResolverQueryResultVirtualContributorResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UrlResolverQueryResultVirtualContributor'] = ResolversParentTypes['UrlResolverQueryResultVirtualContributor'],
> = {
  calloutsSet?: Resolver<
    ResolversTypes['UrlResolverQueryResultCalloutsSet'],
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UrlResolverQueryResultsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UrlResolverQueryResults'] = ResolversParentTypes['UrlResolverQueryResults'],
> = {
  discussionId?: Resolver<
    Maybe<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  innovationHubId?: Resolver<
    Maybe<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  innovationPack?: Resolver<
    Maybe<ResolversTypes['UrlResolverQueryResultInnovationPack']>,
    ParentType,
    ContextType
  >;
  organizationId?: Resolver<
    Maybe<ResolversTypes['UUID']>,
    ParentType,
    ContextType
  >;
  space?: Resolver<
    Maybe<ResolversTypes['UrlResolverQueryResultSpace']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['UrlType'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  virtualContributor?: Resolver<
    Maybe<ResolversTypes['UrlResolverQueryResultVirtualContributor']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  accountUpn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  agent?: Resolver<ResolversTypes['Agent'], ParentType, ContextType>;
  authentication?: Resolver<
    Maybe<ResolversTypes['UserAuthenticationResult']>,
    ParentType,
    ContextType
  >;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  communityRooms?: Resolver<
    Maybe<Array<ResolversTypes['CommunicationRoom']>>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  directRooms?: Resolver<
    Maybe<Array<ResolversTypes['DirectRoom']>>,
    ParentType,
    ContextType
  >;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  guidanceRoom?: Resolver<
    Maybe<ResolversTypes['Room']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isContactable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['UserSettings'], ParentType, ContextType>;
  storageAggregator?: Resolver<
    Maybe<ResolversTypes['StorageAggregator']>,
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserAuthenticationResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserAuthenticationResult'] = ResolversParentTypes['UserAuthenticationResult'],
> = {
  authenticatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  method?: Resolver<
    ResolversTypes['AuthenticationType'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserGroupResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserGroup'] = ResolversParentTypes['UserGroup'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  members?: Resolver<
    Maybe<Array<ResolversTypes['User']>>,
    ParentType,
    ContextType
  >;
  parent?: Resolver<
    Maybe<ResolversTypes['Groupable']>,
    ParentType,
    ContextType
  >;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserSettings'] = ResolversParentTypes['UserSettings'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  communication?: Resolver<
    ResolversTypes['UserSettingsCommunication'],
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  notification?: Resolver<
    ResolversTypes['UserSettingsNotification'],
    ParentType,
    ContextType
  >;
  privacy?: Resolver<
    ResolversTypes['UserSettingsPrivacy'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsCommunicationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserSettingsCommunication'] = ResolversParentTypes['UserSettingsCommunication'],
> = {
  allowOtherUsersToSendMessages?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsNotificationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserSettingsNotification'] = ResolversParentTypes['UserSettingsNotification'],
> = {
  organization?: Resolver<
    ResolversTypes['UserSettingsNotificationOrganization'],
    ParentType,
    ContextType
  >;
  platform?: Resolver<
    ResolversTypes['UserSettingsNotificationPlatform'],
    ParentType,
    ContextType
  >;
  space?: Resolver<
    ResolversTypes['UserSettingsNotificationSpace'],
    ParentType,
    ContextType
  >;
  user?: Resolver<
    ResolversTypes['UserSettingsNotificationUser'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsNotificationOrganizationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserSettingsNotificationOrganization'] = ResolversParentTypes['UserSettingsNotificationOrganization'],
> = {
  mentioned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  messageReceived?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsNotificationPlatformResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserSettingsNotificationPlatform'] = ResolversParentTypes['UserSettingsNotificationPlatform'],
> = {
  forumDiscussionComment?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  forumDiscussionCreated?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  newUserSignUp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  spaceCreated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userProfileRemoved?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsNotificationSpaceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserSettingsNotificationSpace'] = ResolversParentTypes['UserSettingsNotificationSpace'],
> = {
  applicationReceived?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  applicationSubmitted?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  calloutPublished?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  commentReply?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  communicationMention?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  communicationUpdates?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  communicationUpdatesAdmin?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  communityInvitationUser?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  communityNewMember?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  communityNewMemberAdmin?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  postCommentCreated?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  postCreated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  postCreatedAdmin?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  whiteboardCreated?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsNotificationUserResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserSettingsNotificationUser'] = ResolversParentTypes['UserSettingsNotificationUser'],
> = {
  commentReply?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  mentioned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  messageReceived?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  messageSent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsPrivacyResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UserSettingsPrivacy'] = ResolversParentTypes['UserSettingsPrivacy'],
> = {
  contributionRolesPubliclyVisible?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersInRolesResponseResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['UsersInRolesResponse'] = ResolversParentTypes['UsersInRolesResponse'],
> = {
  role?: Resolver<ResolversTypes['RoleName'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VcInteractionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VcInteraction'] = ResolversParentTypes['VcInteraction'],
> = {
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  room?: Resolver<ResolversTypes['Room'], ParentType, ContextType>;
  threadID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  virtualContributorID?: Resolver<
    ResolversTypes['UUID'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerifiedCredentialResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VerifiedCredential'] = ResolversParentTypes['VerifiedCredential'],
> = {
  claims?: Resolver<
    Array<ResolversTypes['VerifiedCredentialClaim']>,
    ParentType,
    ContextType
  >;
  context?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  expires?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issued?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issuer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerifiedCredentialClaimResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VerifiedCredentialClaim'] = ResolversParentTypes['VerifiedCredentialClaim'],
> = {
  name?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VirtualContributorResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VirtualContributor'] = ResolversParentTypes['VirtualContributor'],
> = {
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  agent?: Resolver<ResolversTypes['Agent'], ParentType, ContextType>;
  aiPersona?: Resolver<
    Maybe<ResolversTypes['AiPersona']>,
    ParentType,
    ContextType
  >;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  knowledgeBase?: Resolver<
    Maybe<ResolversTypes['KnowledgeBase']>,
    ParentType,
    ContextType
  >;
  listedInStore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['Contributor'], ParentType, ContextType>;
  searchVisibility?: Resolver<
    ResolversTypes['SearchVisibility'],
    ParentType,
    ContextType
  >;
  settings?: Resolver<
    ResolversTypes['VirtualContributorSettings'],
    ParentType,
    ContextType
  >;
  status?: Resolver<
    ResolversTypes['VirtualContributorStatus'],
    ParentType,
    ContextType
  >;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VirtualContributorSettingsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VirtualContributorSettings'] = ResolversParentTypes['VirtualContributorSettings'],
> = {
  privacy?: Resolver<
    ResolversTypes['VirtualContributorSettingsPrivacy'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VirtualContributorSettingsPrivacyResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VirtualContributorSettingsPrivacy'] = ResolversParentTypes['VirtualContributorSettingsPrivacy'],
> = {
  knowledgeBaseContentVisible?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VirtualContributorUpdatedSubscriptionResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VirtualContributorUpdatedSubscriptionResult'] = ResolversParentTypes['VirtualContributorUpdatedSubscriptionResult'],
> = {
  virtualContributor?: Resolver<
    ResolversTypes['VirtualContributor'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VirtualContributorsInRolesResponseResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VirtualContributorsInRolesResponse'] = ResolversParentTypes['VirtualContributorsInRolesResponse'],
> = {
  role?: Resolver<ResolversTypes['RoleName'], ParentType, ContextType>;
  virtualContributors?: Resolver<
    Array<ResolversTypes['VirtualContributor']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VisualResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Visual'] = ResolversParentTypes['Visual'],
> = {
  allowedTypes?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  alternativeText?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  aspectRatio?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  maxHeight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  maxWidth?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minHeight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minWidth?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VisualConstraintsResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['VisualConstraints'] = ResolversParentTypes['VisualConstraints'],
> = {
  allowedTypes?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  aspectRatio?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  maxHeight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  maxWidth?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minHeight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minWidth?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WhiteboardResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Whiteboard'] = ResolversParentTypes['Whiteboard'],
> = {
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType
  >;
  content?: Resolver<
    ResolversTypes['WhiteboardContent'],
    ParentType,
    ContextType
  >;
  contentUpdatePolicy?: Resolver<
    ResolversTypes['ContentUpdatePolicy'],
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isMultiUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nameID?: Resolver<ResolversTypes['NameID'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface WhiteboardContentScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['WhiteboardContent'], any> {
  name: 'WhiteboardContent';
}

export type Resolvers<ContextType = any> = {
  APM?: ApmResolvers<ContextType>;
  Account?: AccountResolvers<ContextType>;
  AccountSubscription?: AccountSubscriptionResolvers<ContextType>;
  ActivityCreatedSubscriptionResult?: ActivityCreatedSubscriptionResultResolvers<ContextType>;
  ActivityFeed?: ActivityFeedResolvers<ContextType>;
  ActivityLogEntry?: ActivityLogEntryResolvers<ContextType>;
  ActivityLogEntryCalendarEventCreated?: ActivityLogEntryCalendarEventCreatedResolvers<ContextType>;
  ActivityLogEntryCalloutDiscussionComment?: ActivityLogEntryCalloutDiscussionCommentResolvers<ContextType>;
  ActivityLogEntryCalloutLinkCreated?: ActivityLogEntryCalloutLinkCreatedResolvers<ContextType>;
  ActivityLogEntryCalloutPostComment?: ActivityLogEntryCalloutPostCommentResolvers<ContextType>;
  ActivityLogEntryCalloutPostCreated?: ActivityLogEntryCalloutPostCreatedResolvers<ContextType>;
  ActivityLogEntryCalloutPublished?: ActivityLogEntryCalloutPublishedResolvers<ContextType>;
  ActivityLogEntryCalloutWhiteboardContentModified?: ActivityLogEntryCalloutWhiteboardContentModifiedResolvers<ContextType>;
  ActivityLogEntryCalloutWhiteboardCreated?: ActivityLogEntryCalloutWhiteboardCreatedResolvers<ContextType>;
  ActivityLogEntryMemberJoined?: ActivityLogEntryMemberJoinedResolvers<ContextType>;
  ActivityLogEntrySubspaceCreated?: ActivityLogEntrySubspaceCreatedResolvers<ContextType>;
  ActivityLogEntryUpdateSent?: ActivityLogEntryUpdateSentResolvers<ContextType>;
  Agent?: AgentResolvers<ContextType>;
  AgentBeginVerifiedCredentialOfferOutput?: AgentBeginVerifiedCredentialOfferOutputResolvers<ContextType>;
  AgentBeginVerifiedCredentialRequestOutput?: AgentBeginVerifiedCredentialRequestOutputResolvers<ContextType>;
  AiPersona?: AiPersonaResolvers<ContextType>;
  AiPersonaModelCard?: AiPersonaModelCardResolvers<ContextType>;
  AiPersonaModelCardFlag?: AiPersonaModelCardFlagResolvers<ContextType>;
  AiPersonaService?: AiPersonaServiceResolvers<ContextType>;
  AiServer?: AiServerResolvers<ContextType>;
  Application?: ApplicationResolvers<ContextType>;
  AuthenticationConfig?: AuthenticationConfigResolvers<ContextType>;
  AuthenticationProviderConfig?: AuthenticationProviderConfigResolvers<ContextType>;
  AuthenticationProviderConfigUnion?: AuthenticationProviderConfigUnionResolvers<ContextType>;
  Authorization?: AuthorizationResolvers<ContextType>;
  AuthorizationPolicyRuleCredential?: AuthorizationPolicyRuleCredentialResolvers<ContextType>;
  AuthorizationPolicyRulePrivilege?: AuthorizationPolicyRulePrivilegeResolvers<ContextType>;
  AuthorizationPolicyRuleVerifiedCredential?: AuthorizationPolicyRuleVerifiedCredentialResolvers<ContextType>;
  Calendar?: CalendarResolvers<ContextType>;
  CalendarEvent?: CalendarEventResolvers<ContextType>;
  Callout?: CalloutResolvers<ContextType>;
  CalloutContribution?: CalloutContributionResolvers<ContextType>;
  CalloutContributionDefaults?: CalloutContributionDefaultsResolvers<ContextType>;
  CalloutFraming?: CalloutFramingResolvers<ContextType>;
  CalloutPostCreated?: CalloutPostCreatedResolvers<ContextType>;
  CalloutSettings?: CalloutSettingsResolvers<ContextType>;
  CalloutSettingsContribution?: CalloutSettingsContributionResolvers<ContextType>;
  CalloutSettingsFraming?: CalloutSettingsFramingResolvers<ContextType>;
  CalloutsSet?: CalloutsSetResolvers<ContextType>;
  Classification?: ClassificationResolvers<ContextType>;
  Collaboration?: CollaborationResolvers<ContextType>;
  Communication?: CommunicationResolvers<ContextType>;
  CommunicationAdminMembershipResult?: CommunicationAdminMembershipResultResolvers<ContextType>;
  CommunicationAdminOrphanedUsageResult?: CommunicationAdminOrphanedUsageResultResolvers<ContextType>;
  CommunicationAdminRoomMembershipResult?: CommunicationAdminRoomMembershipResultResolvers<ContextType>;
  CommunicationAdminRoomResult?: CommunicationAdminRoomResultResolvers<ContextType>;
  CommunicationRoom?: CommunicationRoomResolvers<ContextType>;
  Community?: CommunityResolvers<ContextType>;
  CommunityApplicationForRoleResult?: CommunityApplicationForRoleResultResolvers<ContextType>;
  CommunityApplicationResult?: CommunityApplicationResultResolvers<ContextType>;
  CommunityGuidelines?: CommunityGuidelinesResolvers<ContextType>;
  CommunityInvitationForRoleResult?: CommunityInvitationForRoleResultResolvers<ContextType>;
  CommunityInvitationResult?: CommunityInvitationResultResolvers<ContextType>;
  CommunityMembershipResult?: CommunityMembershipResultResolvers<ContextType>;
  Config?: ConfigResolvers<ContextType>;
  Contributor?: ContributorResolvers<ContextType>;
  ContributorRolePolicy?: ContributorRolePolicyResolvers<ContextType>;
  ContributorRoles?: ContributorRolesResolvers<ContextType>;
  CreateCalloutContributionData?: CreateCalloutContributionDataResolvers<ContextType>;
  CreateCalloutContributionDefaultsData?: CreateCalloutContributionDefaultsDataResolvers<ContextType>;
  CreateCalloutData?: CreateCalloutDataResolvers<ContextType>;
  CreateCalloutFramingData?: CreateCalloutFramingDataResolvers<ContextType>;
  CreateCalloutSettingsContributionData?: CreateCalloutSettingsContributionDataResolvers<ContextType>;
  CreateCalloutSettingsData?: CreateCalloutSettingsDataResolvers<ContextType>;
  CreateCalloutSettingsFramingData?: CreateCalloutSettingsFramingDataResolvers<ContextType>;
  CreateCalloutsSetData?: CreateCalloutsSetDataResolvers<ContextType>;
  CreateClassificationData?: CreateClassificationDataResolvers<ContextType>;
  CreateCollaborationData?: CreateCollaborationDataResolvers<ContextType>;
  CreateCommunityGuidelinesData?: CreateCommunityGuidelinesDataResolvers<ContextType>;
  CreateInnovationFlowData?: CreateInnovationFlowDataResolvers<ContextType>;
  CreateInnovationFlowStateData?: CreateInnovationFlowStateDataResolvers<ContextType>;
  CreateInnovationFlowStateSettingsData?: CreateInnovationFlowStateSettingsDataResolvers<ContextType>;
  CreateLinkData?: CreateLinkDataResolvers<ContextType>;
  CreateLocationData?: CreateLocationDataResolvers<ContextType>;
  CreateMemoData?: CreateMemoDataResolvers<ContextType>;
  CreatePostData?: CreatePostDataResolvers<ContextType>;
  CreateProfileData?: CreateProfileDataResolvers<ContextType>;
  CreateReferenceData?: CreateReferenceDataResolvers<ContextType>;
  CreateTagsetData?: CreateTagsetDataResolvers<ContextType>;
  CreateVisualOnProfileData?: CreateVisualOnProfileDataResolvers<ContextType>;
  CreateWhiteboardData?: CreateWhiteboardDataResolvers<ContextType>;
  Credential?: CredentialResolvers<ContextType>;
  CredentialDefinition?: CredentialDefinitionResolvers<ContextType>;
  CredentialMetadataOutput?: CredentialMetadataOutputResolvers<ContextType>;
  DID?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DirectRoom?: DirectRoomResolvers<ContextType>;
  Discussion?: DiscussionResolvers<ContextType>;
  Document?: DocumentResolvers<ContextType>;
  Emoji?: GraphQLScalarType;
  ExternalConfig?: ExternalConfigResolvers<ContextType>;
  FileStorageConfig?: FileStorageConfigResolvers<ContextType>;
  Form?: FormResolvers<ContextType>;
  FormQuestion?: FormQuestionResolvers<ContextType>;
  Forum?: ForumResolvers<ContextType>;
  Geo?: GeoResolvers<ContextType>;
  GeoLocation?: GeoLocationResolvers<ContextType>;
  Groupable?: GroupableResolvers<ContextType>;
  ISearchCategoryResult?: ISearchCategoryResultResolvers<ContextType>;
  ISearchResults?: ISearchResultsResolvers<ContextType>;
  InAppNotification?: InAppNotificationResolvers<ContextType>;
  InAppNotificationCalloutPublished?: InAppNotificationCalloutPublishedResolvers<ContextType>;
  InAppNotificationCommunityNewMember?: InAppNotificationCommunityNewMemberResolvers<ContextType>;
  InAppNotificationUserMentioned?: InAppNotificationUserMentionedResolvers<ContextType>;
  InnovationFlow?: InnovationFlowResolvers<ContextType>;
  InnovationFlowSettings?: InnovationFlowSettingsResolvers<ContextType>;
  InnovationFlowState?: InnovationFlowStateResolvers<ContextType>;
  InnovationFlowStateSettings?: InnovationFlowStateSettingsResolvers<ContextType>;
  InnovationHub?: InnovationHubResolvers<ContextType>;
  InnovationPack?: InnovationPackResolvers<ContextType>;
  InputCreatorQueryResults?: InputCreatorQueryResultsResolvers<ContextType>;
  Invitation?: InvitationResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  KnowledgeBase?: KnowledgeBaseResolvers<ContextType>;
  LatestReleaseDiscussion?: LatestReleaseDiscussionResolvers<ContextType>;
  Library?: LibraryResolvers<ContextType>;
  License?: LicenseResolvers<ContextType>;
  LicenseEntitlement?: LicenseEntitlementResolvers<ContextType>;
  LicensePlan?: LicensePlanResolvers<ContextType>;
  LicensePolicy?: LicensePolicyResolvers<ContextType>;
  Licensing?: LicensingResolvers<ContextType>;
  LicensingCredentialBasedPolicyCredentialRule?: LicensingCredentialBasedPolicyCredentialRuleResolvers<ContextType>;
  LicensingGrantedEntitlement?: LicensingGrantedEntitlementResolvers<ContextType>;
  Lifecycle?: LifecycleResolvers<ContextType>;
  LifecycleDefinition?: GraphQLScalarType;
  Link?: LinkResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  LookupByNameQueryResults?: LookupByNameQueryResultsResolvers<ContextType>;
  LookupMyPrivilegesQueryResults?: LookupMyPrivilegesQueryResultsResolvers<ContextType>;
  LookupQueryResults?: LookupQueryResultsResolvers<ContextType>;
  Markdown?: GraphQLScalarType;
  MeQueryResults?: MeQueryResultsResolvers<ContextType>;
  Memo?: MemoResolvers<ContextType>;
  MemoContent?: GraphQLScalarType;
  Message?: MessageResolvers<ContextType>;
  MessageAnswerQuestion?: MessageAnswerQuestionResolvers<ContextType>;
  MessageID?: GraphQLScalarType;
  Metadata?: MetadataResolvers<ContextType>;
  MigrateEmbeddings?: MigrateEmbeddingsResolvers<ContextType>;
  ModelCardAiEngineResult?: ModelCardAiEngineResultResolvers<ContextType>;
  ModelCardMonitoringResult?: ModelCardMonitoringResultResolvers<ContextType>;
  ModelCardSpaceUsageResult?: ModelCardSpaceUsageResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MySpaceResults?: MySpaceResultsResolvers<ContextType>;
  NVP?: NvpResolvers<ContextType>;
  NameID?: GraphQLScalarType;
  NotificationRecipientResult?: NotificationRecipientResultResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  OrganizationSettings?: OrganizationSettingsResolvers<ContextType>;
  OrganizationSettingsMembership?: OrganizationSettingsMembershipResolvers<ContextType>;
  OrganizationSettingsPrivacy?: OrganizationSettingsPrivacyResolvers<ContextType>;
  OrganizationVerification?: OrganizationVerificationResolvers<ContextType>;
  OrganizationsInRolesResponse?: OrganizationsInRolesResponseResolvers<ContextType>;
  OryConfig?: OryConfigResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PaginatedOrganization?: PaginatedOrganizationResolvers<ContextType>;
  PaginatedSpaces?: PaginatedSpacesResolvers<ContextType>;
  PaginatedUsers?: PaginatedUsersResolvers<ContextType>;
  PaginatedVirtualContributor?: PaginatedVirtualContributorResolvers<ContextType>;
  Platform?: PlatformResolvers<ContextType>;
  PlatformFeatureFlag?: PlatformFeatureFlagResolvers<ContextType>;
  PlatformIntegrationSettings?: PlatformIntegrationSettingsResolvers<ContextType>;
  PlatformInvitation?: PlatformInvitationResolvers<ContextType>;
  PlatformLocations?: PlatformLocationsResolvers<ContextType>;
  PlatformSettings?: PlatformSettingsResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  ProfileCredentialVerified?: ProfileCredentialVerifiedResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  Reaction?: ReactionResolvers<ContextType>;
  Reference?: ReferenceResolvers<ContextType>;
  RelayPaginatedSpace?: RelayPaginatedSpaceResolvers<ContextType>;
  RelayPaginatedSpaceEdge?: RelayPaginatedSpaceEdgeResolvers<ContextType>;
  RelayPaginatedSpacePageInfo?: RelayPaginatedSpacePageInfoResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  RoleSet?: RoleSetResolvers<ContextType>;
  RoleSetInvitationResult?: RoleSetInvitationResultResolvers<ContextType>;
  RolesResult?: RolesResultResolvers<ContextType>;
  RolesResultCommunity?: RolesResultCommunityResolvers<ContextType>;
  RolesResultOrganization?: RolesResultOrganizationResolvers<ContextType>;
  RolesResultSpace?: RolesResultSpaceResolvers<ContextType>;
  Room?: RoomResolvers<ContextType>;
  RoomEventSubscriptionResult?: RoomEventSubscriptionResultResolvers<ContextType>;
  RoomMessageEventSubscriptionResult?: RoomMessageEventSubscriptionResultResolvers<ContextType>;
  RoomMessageReactionEventSubscriptionResult?: RoomMessageReactionEventSubscriptionResultResolvers<ContextType>;
  SearchCursor?: GraphQLScalarType;
  SearchResult?: SearchResultResolvers<ContextType>;
  SearchResultCallout?: SearchResultCalloutResolvers<ContextType>;
  SearchResultOrganization?: SearchResultOrganizationResolvers<ContextType>;
  SearchResultPost?: SearchResultPostResolvers<ContextType>;
  SearchResultSpace?: SearchResultSpaceResolvers<ContextType>;
  SearchResultUser?: SearchResultUserResolvers<ContextType>;
  Sentry?: SentryResolvers<ContextType>;
  ServiceMetadata?: ServiceMetadataResolvers<ContextType>;
  Space?: SpaceResolvers<ContextType>;
  SpaceAbout?: SpaceAboutResolvers<ContextType>;
  SpaceAboutMembership?: SpaceAboutMembershipResolvers<ContextType>;
  SpacePendingMembershipInfo?: SpacePendingMembershipInfoResolvers<ContextType>;
  SpaceSettings?: SpaceSettingsResolvers<ContextType>;
  SpaceSettingsCollaboration?: SpaceSettingsCollaborationResolvers<ContextType>;
  SpaceSettingsMembership?: SpaceSettingsMembershipResolvers<ContextType>;
  SpaceSettingsPrivacy?: SpaceSettingsPrivacyResolvers<ContextType>;
  SpaceSubscription?: SpaceSubscriptionResolvers<ContextType>;
  StorageAggregator?: StorageAggregatorResolvers<ContextType>;
  StorageAggregatorParent?: StorageAggregatorParentResolvers<ContextType>;
  StorageBucket?: StorageBucketResolvers<ContextType>;
  StorageBucketParent?: StorageBucketParentResolvers<ContextType>;
  StorageConfig?: StorageConfigResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SubspaceCreated?: SubspaceCreatedResolvers<ContextType>;
  Tagset?: TagsetResolvers<ContextType>;
  TagsetTemplate?: TagsetTemplateResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  Template?: TemplateResolvers<ContextType>;
  TemplateContentSpace?: TemplateContentSpaceResolvers<ContextType>;
  TemplateDefault?: TemplateDefaultResolvers<ContextType>;
  TemplateResult?: TemplateResultResolvers<ContextType>;
  TemplatesManager?: TemplatesManagerResolvers<ContextType>;
  TemplatesSet?: TemplatesSetResolvers<ContextType>;
  Timeline?: TimelineResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  Upload?: GraphQLScalarType;
  UrlResolverQueryResultCalendar?: UrlResolverQueryResultCalendarResolvers<ContextType>;
  UrlResolverQueryResultCalloutsSet?: UrlResolverQueryResultCalloutsSetResolvers<ContextType>;
  UrlResolverQueryResultCollaboration?: UrlResolverQueryResultCollaborationResolvers<ContextType>;
  UrlResolverQueryResultInnovationPack?: UrlResolverQueryResultInnovationPackResolvers<ContextType>;
  UrlResolverQueryResultSpace?: UrlResolverQueryResultSpaceResolvers<ContextType>;
  UrlResolverQueryResultTemplatesSet?: UrlResolverQueryResultTemplatesSetResolvers<ContextType>;
  UrlResolverQueryResultVirtualContributor?: UrlResolverQueryResultVirtualContributorResolvers<ContextType>;
  UrlResolverQueryResults?: UrlResolverQueryResultsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserAuthenticationResult?: UserAuthenticationResultResolvers<ContextType>;
  UserGroup?: UserGroupResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserSettingsCommunication?: UserSettingsCommunicationResolvers<ContextType>;
  UserSettingsNotification?: UserSettingsNotificationResolvers<ContextType>;
  UserSettingsNotificationOrganization?: UserSettingsNotificationOrganizationResolvers<ContextType>;
  UserSettingsNotificationPlatform?: UserSettingsNotificationPlatformResolvers<ContextType>;
  UserSettingsNotificationSpace?: UserSettingsNotificationSpaceResolvers<ContextType>;
  UserSettingsNotificationUser?: UserSettingsNotificationUserResolvers<ContextType>;
  UserSettingsPrivacy?: UserSettingsPrivacyResolvers<ContextType>;
  UsersInRolesResponse?: UsersInRolesResponseResolvers<ContextType>;
  VcInteraction?: VcInteractionResolvers<ContextType>;
  VerifiedCredential?: VerifiedCredentialResolvers<ContextType>;
  VerifiedCredentialClaim?: VerifiedCredentialClaimResolvers<ContextType>;
  VirtualContributor?: VirtualContributorResolvers<ContextType>;
  VirtualContributorSettings?: VirtualContributorSettingsResolvers<ContextType>;
  VirtualContributorSettingsPrivacy?: VirtualContributorSettingsPrivacyResolvers<ContextType>;
  VirtualContributorUpdatedSubscriptionResult?: VirtualContributorUpdatedSubscriptionResultResolvers<ContextType>;
  VirtualContributorsInRolesResponse?: VirtualContributorsInRolesResponseResolvers<ContextType>;
  Visual?: VisualResolvers<ContextType>;
  VisualConstraints?: VisualConstraintsResolvers<ContextType>;
  Whiteboard?: WhiteboardResolvers<ContextType>;
  WhiteboardContent?: GraphQLScalarType;
};

export type DirectiveResolvers<ContextType = any> = {
  oneOf?: OneOfDirectiveResolver<any, any, ContextType>;
};

export type FeatureFlagsQueryVariables = Exact<{ [key: string]: never }>;

export type FeatureFlagsQuery = {
  platform: {
    configuration: {
      featureFlags: Array<{ name: PlatformFeatureFlagName; enabled: boolean }>;
    };
  };
};

export type NotificationRecipientsQueryVariables = Exact<{
  eventType: NotificationEvent;
  entityId?: InputMaybe<Scalars['UUID']['input']>;
  triggeredBy?: InputMaybe<Scalars['UUID']['input']>;
}>;

export type NotificationRecipientsQuery = {
  notificationRecipients: {
    emailRecipients: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      nameID: string;
      profile: { id: string; displayName: string; url: string };
    }>;
    inAppRecipients: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      nameID: string;
      profile: { id: string; displayName: string; url: string };
    }>;
    triggeredBy?:
      | {
          id: string;
          firstName: string;
          lastName: string;
          email: string;
          nameID: string;
          profile: { id: string; displayName: string; url: string };
        }
      | undefined;
  };
};

export type UserRecipientFragment = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nameID: string;
  profile: { id: string; displayName: string; url: string };
};

export type UserLookupQueryVariables = Exact<{
  userID: Scalars['UUID']['input'];
}>;

export type UserLookupQuery = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    nameID: string;
    profile: { id: string; displayName: string; url: string };
  };
};
