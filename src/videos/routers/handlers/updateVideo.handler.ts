import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { VideoUpdateInput } from '../../dto/video-update.input';
import { videosRepository } from '../../repositories/videos-repository';
import { VideoViewModel } from '../../types/video-view-model';
import { ValidationErrorDto } from '../../../core/types/validationError.dto';

export const updateVideoHandler = async (
  req: Request<{ id: string }, {}, VideoUpdateInput>,
  res: Response<VideoViewModel | ValidationErrorDto>,
) => {
  try {
    const id = req.params.id;
    const updateResult = await videosRepository.updateVideo({
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

    res.status(HttpStatus.NoContent).send();
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
