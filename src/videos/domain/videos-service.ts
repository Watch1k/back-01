import { VideoCreateInput } from '../dto/video-create.input';
import { Video } from '../types/video';
import { WithId } from 'mongodb';
import { videosRepository } from '../repositories/videos-repository';

type OperationResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export const videosService = {
  getAllVideos: videosRepository.getAllVideos,

  findVideo: videosRepository.findVideo,

  createVideo: async (
    video: VideoCreateInput,
  ): Promise<OperationResult<WithId<Video>>> => {
    const newVideo: Video = {
      title: video.title,
      author: video.author,
      availableResolutions: video.availableResolutions,
      minAgeRestriction: null,
      publicationDate: new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000,
      ).toISOString(),
      canBeDownloaded: false,
      createdAt: new Date().toISOString(),
    };

    return await videosRepository.createVideo(newVideo);
  },

  updateVideo: videosRepository.updateVideo,

  deleteVideo: videosRepository.deleteVideo,
};
