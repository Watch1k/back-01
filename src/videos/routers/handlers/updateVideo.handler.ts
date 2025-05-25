import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { VideoUpdateInput } from '../../dto/video-update.input';
import { videosRepository } from '../../repositories/videos-repository';
import { videoInputDtoValidation } from '../../validation/videoInputDtoValidation';

export const updateVideoHandler = (
  req: Request<{ id: string }, {}, VideoUpdateInput>,
  res: Response,
) => {
  const errors = videoInputDtoValidation(req.body);

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    return;
  }

  const id = parseInt(req.params.id);
  const updateResult = videosRepository.updateVideo({
    id,
    input: req.body,
  });

  if (!updateResult.success) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: updateResult.message }]),
      );
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
};
