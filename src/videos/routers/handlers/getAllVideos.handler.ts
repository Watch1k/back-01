import { Request, Response } from 'express';
import { videosRepository } from '../../repositories/videos-repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { VideoViewModel } from '../../types/video-view-model';
import { mapToVideoViewModel } from '../mappers/map-to-driver-view-model.util';
import { ValidationErrorDto } from '../../../core/types/validationError.dto';

export const getAllVideosHandler = async (
  req: Request,
  res: Response<VideoViewModel[] | ValidationErrorDto>,
) => {
  try {
    const videos = await videosRepository.getAllVideos();
    res.status(HttpStatus.Ok).send(videos.map(mapToVideoViewModel));
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
