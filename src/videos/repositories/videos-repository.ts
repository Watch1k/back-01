import { VideoCreateInput } from '../dto/video-create.input';
import { Video } from '../types/video';
import { VideoUpdateInput } from '../dto/video-update.input';
import { videoCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

type OperationResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export const videosRepository = {
  getAllVideos: () => videoCollection.find().toArray(),

  findVideo: async (id: string) =>
    await videoCollection.findOne({
      _id: new ObjectId(id),
    }),

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

    const resp = await videoCollection.insertOne(newVideo);

    return {
      success: true,
      message: `Video with id ${resp.insertedId} successfully created`,
      data: { ...newVideo, _id: resp.insertedId },
    };
  },

  updateVideo: async (data: {
    id: string;
    input: VideoUpdateInput;
  }): Promise<OperationResult<WithId<Video>>> => {
    const updatedVideo = {
      title: data.input.title,
      minAgeRestriction: data.input.minAgeRestriction,
      publicationDate: data.input.publicationDate,
      canBeDownloaded: data.input.canBeDownloaded,
      author: data.input.author,
      availableResolutions: data.input.availableResolutions,
    };

    const updateResult = await videoCollection.updateOne(
      {
        _id: new ObjectId(data.id),
      },
      {
        $set: updatedVideo,
      },
    );

    if (updateResult.matchedCount < 1) {
      return {
        success: false,
        message: `Video with id ${data.id} not found`,
      };
    }

    const newVideo = await videoCollection.findOne({
      id: data.id,
    });

    if (!newVideo) {
      return {
        success: false,
        message: `Video with id ${data.id} not found`,
      };
    }

    return {
      success: true,
      message: `Video with id ${data.id} successfully updated`,
      data: newVideo,
    };
  },

  deleteVideo: async (id: string): Promise<OperationResult> => {
    const deleteResult = await videoCollection.deleteOne({
      id: id,
    });

    if (deleteResult.deletedCount < 1) {
      return {
        success: false,
        message: `Video with id ${id} not found`,
      };
    }

    return {
      success: true,
      message: `Video with id ${id} successfully deleted`,
    };
  },
};
