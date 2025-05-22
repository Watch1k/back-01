import { VideoResolution } from '../types/video';

export type VideoUpdateInput = {
  title: string;
  author: string;
  availableResolutions: [VideoResolution, ...VideoResolution[]];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
