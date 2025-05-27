import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostCreateInput } from '../../dto/post-create.input';
import { postsRepository } from '../../repositories/posts-repository';

export const createPostHandler = (
  req: Request<{}, {}, PostCreateInput>,
  res: Response,
) => {
  const newPost = postsRepository.createPost(req.body);
  res.status(HttpStatus.Created).send(newPost);
};