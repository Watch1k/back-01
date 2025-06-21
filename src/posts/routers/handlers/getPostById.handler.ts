import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../repositories/posts-repository';

export const getPostByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const post = await postsRepository.findPost(req.params.id);

  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  res.status(HttpStatus.Ok).send(post);
};
