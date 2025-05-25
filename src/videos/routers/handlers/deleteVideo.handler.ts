import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { videosRepository } from '../../repositories/videos-repository';

export const deleteVideoHandler = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleteResult = videosRepository.deleteVideo(id);

  if (!deleteResult.success) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: deleteResult.message }]),
      );
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
};
