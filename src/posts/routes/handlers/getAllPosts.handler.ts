import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../application/posts.service';
import { PostQueryInput } from '../input/post-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPostListPaginatedOutput } from '../mappers/map-to-post-list-paginated-output.util';

export const getAllPostsHandler = async (
  req: Request<{}, {}, {}, PostQueryInput>,
  res: Response,
) => {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const { items, totalCount } = await postsService.getAllPosts(queryInput);
    const postsListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.status(HttpStatus.Ok).send(postsListOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
};
