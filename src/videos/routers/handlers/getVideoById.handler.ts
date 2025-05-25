import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { videosRepository } from '../../repositories/videos-repository';

export const getVideoByIdHandler = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const video = videosRepository.findVideo(id);

  if (!video) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Video not found' }]));
    return;
  }
  res.status(200).send(video);
};
