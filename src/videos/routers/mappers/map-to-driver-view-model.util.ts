import { WithId } from 'mongodb';
import { Video } from '../../types/video';
import { VideoViewModel } from '../../types/video-view-model';

export const mapToVideoViewModel = (driver: WithId<Video>): VideoViewModel => ({
  id: driver._id.toString(),
  title: driver.title,
  author: driver.author,
  canBeDownloaded: driver.canBeDownloaded,
  minAgeRestriction: driver.minAgeRestriction,
  createdAt: driver.createdAt,
  publicationDate: driver.publicationDate,
  availableResolutions: driver.availableResolutions,
});
