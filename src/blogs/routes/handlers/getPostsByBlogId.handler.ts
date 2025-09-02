import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../../posts/application/posts.service';
import { PostQueryInput } from '../../../posts/routes/input/post-query.input';
import { mapToPostListPaginatedOutput } from '../../../posts/routes/mappers/map-to-post-list-paginated-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';

export const getPostsByBlogIdHandler = async (
  req: Request<{ id: string }, {}, {}, PostQueryInput>,
  res: Response,
) => {
  try {
    const blogId = req.params.id;
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const { items, totalCount } = await postsService.findPostByBlogId(
      queryInput,
      blogId,
    );
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
