import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export const deletePostHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await postsService.deletePost(req.params.id);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
};
