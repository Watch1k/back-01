import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { ValidationErrorDto } from '../../../core/types/validationError.dto';
import { videosService } from '../../domain/videos-service';

export const deleteVideoHandler = async (
  req: Request,
  res: Response<ValidationErrorDto>,
) => {
  try {
    const id = req.params.id;
    const deleteResult = await videosService.deleteVideo(id);

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
