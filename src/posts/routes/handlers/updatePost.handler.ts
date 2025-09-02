import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostUpdateInput } from '../input/post-update.input';
import { postsService } from '../../application/posts.service';

export const updatePostHandler = async (
  req: Request<{ id: string }, {}, PostUpdateInput>,
  res: Response,
) => {
  await postsService.updatePost(req.params.id, req.body.data.attributes);

  res.sendStatus(HttpStatus.NoContent);
};
