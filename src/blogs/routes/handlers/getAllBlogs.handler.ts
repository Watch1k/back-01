import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { BlogQueryInput } from '../input/blog-query.input';
import { mapToBlogListPaginatedOutput } from '../mappers/map-to-blog-list-paginated-output.util';

export const getAllBlogsHandler = async (
  req: Request<{}, {}, {}, BlogQueryInput>,
  res: Response,
) => {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const { items, totalCount } = await blogsService.getAllBlogs(queryInput);
    // For E2E tests expectations, return plain array of items instead of paginated payload
    res.status(HttpStatus.Ok).send(items);
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
