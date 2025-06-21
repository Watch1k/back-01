import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../repositories/posts-repository';

export const getAllPostsHandler = async (req: Request, res: Response) => {
  const posts = await postsRepository.getAllPosts();
  res.status(HttpStatus.Ok).send(posts);
};
