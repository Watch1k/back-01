import { Request, Response } from 'express';
import { VideoListOutput } from '../../dto/video-list.output';
import { videosRepository } from '../../repositories/videos-repository';

export const getAllVideosHandler = (
  req: Request,
  res: Response<VideoListOutput>,
) => {
  res.status(200).send(videosRepository.getAllVideos());
};
