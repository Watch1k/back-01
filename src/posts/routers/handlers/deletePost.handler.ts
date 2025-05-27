import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../repositories/posts-repository';

export const deletePostHandler = (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = postsRepository.deletePost(req.params.id);

  if (!result.success) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
};
