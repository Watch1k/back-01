import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { VideoCreateInput } from '../../dto/video-create.input';
import { videosRepository } from '../../repositories/videos-repository';
import { videoInputDtoValidation } from '../../validation/videoInputDtoValidation';

export const createVideoHandler = (
  req: Request<{}, {}, VideoCreateInput>,
  res: Response,
) => {
  const errors = videoInputDtoValidation(req.body);

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    return;
  }

  const newVideo = videosRepository.createVideo(req.body);
  res.status(HttpStatus.Created).send(newVideo);
};
