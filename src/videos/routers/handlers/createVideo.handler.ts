import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { VideoCreateInput } from '../../dto/video-create.input';
import { videosRepository } from '../../repositories/videos-repository';
import { VideoViewModel } from '../../types/video-view-model';
import { mapToVideoViewModel } from '../mappers/map-to-driver-view-model.util';
import { ValidationErrorDto } from '../../../core/types/validationError.dto';

export const createVideoHandler = async (
  req: Request<{}, {}, VideoCreateInput>,
  res: Response<VideoViewModel | ValidationErrorDto>,
) => {
  try {
    const resp = await videosRepository.createVideo(req.body);
    if (!resp.data) {
      res.status(HttpStatus.InternalServerError).send();
      return;
    }
    res.status(HttpStatus.Created).send(mapToVideoViewModel(resp.data));
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
