import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { VideoCreateInput } from '../../dto/video-create.input';
import { videosRepository } from '../../repositories/videos-repository';

export const createVideoHandler = (
  req: Request<{}, {}, VideoCreateInput>,
  res: Response,
) => {
  const newVideo = videosRepository.createVideo(req.body);
  res.status(HttpStatus.Created).send(newVideo);
};
