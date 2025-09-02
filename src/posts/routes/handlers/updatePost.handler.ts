import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { PostAttributes } from '../../application/dtos/post-attributes';

export const updatePostHandler = async (
  req: Request<{ id: string }, {}, PostAttributes>,
  res: Response,
) => {
  try {
    await postsService.updatePost(req.params.id, req.body);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
};
