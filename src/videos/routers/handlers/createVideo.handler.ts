import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { VideoCreateInput } from '../../dto/video-create.input';
import { VideoViewModel } from '../../types/video-view-model';
import { mapToVideoViewModel } from '../mappers/map-to-driver-view-model.util';
import { ValidationErrorDto } from '../../../core/types/validationError.dto';
import { videosService } from '../../domain/videos-service';

export const createVideoHandler = async (
  req: Request<{}, {}, VideoCreateInput>,
  res: Response<VideoViewModel | ValidationErrorDto>,
) => {
  try {
    const resp = await videosService.createVideo(req.body);
    if (!resp.data) {
      res.status(HttpStatus.InternalServerError).send();
      return;
    }
    res.status(HttpStatus.Created).send(mapToVideoViewModel(resp.data));
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
