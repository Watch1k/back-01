import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { VideoViewModel } from '../../types/video-view-model';
import { mapToVideoViewModel } from '../mappers/map-to-driver-view-model.util';
import { ValidationErrorDto } from '../../../core/types/validationError.dto';
import { videosService } from '../../domain/videos-service';

export const getAllVideosHandler = async (
  req: Request,
  res: Response<VideoViewModel[] | ValidationErrorDto>,
) => {
  try {
    const videos = await videosService.getAllVideos();
    res.status(HttpStatus.Ok).send(videos.map(mapToVideoViewModel));
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
