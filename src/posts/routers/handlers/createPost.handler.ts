import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostCreateInput } from '../../dto/post-create.input';
import { postsRepository } from '../../repositories/posts-repository';
import { mapToPostViewModel } from '../../mappers/map-to-post-view-model.util';

export const createPostHandler = async (
  req: Request<{}, {}, PostCreateInput>,
  res: Response,
) => {
  try {
    const resp = await postsRepository.createPost(req.body);
    if (!resp.data) {
      res.status(HttpStatus.InternalServerError).send();
      return;
    }
    res.status(HttpStatus.Created).send(mapToPostViewModel(resp.data));
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
