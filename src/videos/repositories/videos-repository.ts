import { db } from '../../db/in-memory.db';
import { VideoCreateInput } from '../dto/video-create.input';
import { Video } from '../types/video';
import { VideoUpdateInput } from '../dto/video-update.input';

type OperationResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export const videosRepository = {
  getAllVideos: () => db.videos,

  findVideo: (id: number) => db.videos.find((v) => v.id === id),

  createVideo: (video: VideoCreateInput) => {
    const newVideo: Video = {
      title: video.title,
      author: video.author,
      availableResolutions: video.availableResolutions,
      id: new Date().getTime(),
      minAgeRestriction: null,
      publicationDate: new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000,
      ).toISOString(),
      canBeDownloaded: false,
      createdAt: new Date().toISOString(),
    };

    db.videos.push(newVideo);

    return newVideo;
  },

  updateVideo: (data: {
    id: number;
    input: VideoUpdateInput;
  }): OperationResult<Video> => {
    const index = db.videos.findIndex((v) => v.id === data.id);

    if (index === -1) {
      return {
        success: false,
        message: `Video with id ${data.id} not found`,
      };
    }

    const video = db.videos[index];

    const updatedVideo = {
      title: data.input.title,
      minAgeRestriction: data.input.minAgeRestriction,
      publicationDate: data.input.publicationDate,
      canBeDownloaded: data.input.canBeDownloaded,
      author: data.input.author,
      availableResolutions: data.input.availableResolutions,
      id: video.id,
      createdAt: video.createdAt,
    };

    db.videos[index] = updatedVideo;

    return {
      success: true,
      message: `Video with id ${data.id} successfully updated`,
      data: updatedVideo,
    };
  },

  deleteVideo: (id: number): OperationResult => {
    const index = db.videos.findIndex((v) => v.id === id);

    if (index === -1) {
      return {
        success: false,
        message: `Video with id ${id} not found`,
      };
    }

    db.videos.splice(index, 1);
    return {
      success: true,
      message: `Video with id ${id} successfully deleted`,
    };
  },
};
