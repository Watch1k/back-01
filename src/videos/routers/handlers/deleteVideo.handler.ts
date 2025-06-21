import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { videosRepository } from '../../repositories/videos-repository';
import { ValidationErrorDto } from '../../../core/types/validationError.dto';

export const deleteVideoHandler = async (
  req: Request,
  res: Response<ValidationErrorDto>,
) => {
  try {
    const id = req.params.id;
    const deleteResult = await videosRepository.deleteVideo(id);

    if (!deleteResult.success) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: deleteResult.message }]),
        );
      return;
    }

    res.status(HttpStatus.NoContent).send();
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
