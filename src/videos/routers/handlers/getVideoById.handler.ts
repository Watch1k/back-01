import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { videosRepository } from '../../repositories/videos-repository';
import { mapToVideoViewModel } from '../mappers/map-to-driver-view-model.util';
import { VideoViewModel } from '../../types/video-view-model';
import { ValidationErrorDto } from '../../../core/types/validationError.dto';

export const getVideoByIdHandler = async (
  req: Request,
  res: Response<VideoViewModel | ValidationErrorDto>,
) => {
  try {
    const id = req.params.id;
    const video = await videosRepository.findVideo(id);

    if (!video) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Video not found' }]),
        );
      return;
    }
    res.status(HttpStatus.Ok).send(mapToVideoViewModel(video));
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
