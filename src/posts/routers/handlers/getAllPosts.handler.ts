import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../repositories/posts-repository';
import { mapToPostViewModel } from '../../mappers/map-to-post-view-model.util';

export const getAllPostsHandler = async (req: Request, res: Response) => {
  try {
    const posts = await postsRepository.getAllPosts();
    res.status(HttpStatus.Ok).send(posts.map(mapToPostViewModel));
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
