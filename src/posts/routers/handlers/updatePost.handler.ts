import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostUpdateInput } from '../../dto/post-update.input';
import { postsRepository } from '../../repositories/posts-repository';

export const updatePostHandler = async (
  req: Request<{ id: string }, {}, PostUpdateInput>,
  res: Response,
) => {
  const result = await postsRepository.updatePost({
    id: req.params.id,
    input: req.body,
  });

  if (!result.success) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
};
