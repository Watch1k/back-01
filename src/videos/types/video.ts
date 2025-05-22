export type EnumType<T> = T[keyof T];

export const VideoCategory = {
  Education: 'education',
  Entertainment: 'entertainment',
  Sports: 'sports',
} as const;
export type VideoCategory = EnumType<typeof VideoCategory>;

export const VideoResolution = {
  Resolution144p: 'P144',
  Resolution240p: 'P240',
  Resolution360p: 'P360',
  Resolution480p: 'P480',
  Resolution720p: 'P720',
  Resolution1080p: 'P1080',
  Resolution1440p: 'P1440',
  Resolution2160p: 'P2160',
} as const;
export type VideoResolution = EnumType<typeof VideoResolution>;

export type Video = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: [VideoResolution, ...VideoResolution[]];
};
