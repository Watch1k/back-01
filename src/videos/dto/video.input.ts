import { VideoResolution } from '../types/video';

export type VideoInput = {
  title: string;
  author: string;
  availableResolutions: [VideoResolution, ...VideoResolution[]];
};
