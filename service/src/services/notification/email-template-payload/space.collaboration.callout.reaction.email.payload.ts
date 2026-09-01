import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface SpaceCollaborationCalloutReactionEmailPayload extends BaseSpaceEmailPayload {
  reactor: {
    displayName: string;
  };
  reaction: {
    emoji: string;
    emojiGlyph: string;
  };
  callout: {
    displayName: string;
    url: string;
  };
}
