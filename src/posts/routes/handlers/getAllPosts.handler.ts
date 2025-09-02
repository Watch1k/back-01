import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../application/posts.service';
import { PostQueryInput } from '../input/post-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { errorsHandler } from '../../../core/errors/errors.handler';

export const getAllPostsHandler = async (
  req: Request<{}, {}, {}, PostQueryInput>,
  res: Response,
) => {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const { items } = await postsService.getAllPosts(queryInput);
    // For E2E tests expectations, return plain array of items instead of paginated payload
    res.status(HttpStatus.Ok).send(items);
  } catch (e) {
    errorsHandler(e, res);
  }
};
