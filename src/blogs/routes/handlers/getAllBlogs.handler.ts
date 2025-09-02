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
    const blogsListOutput = mapToBlogListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.status(HttpStatus.Ok).send(blogsListOutput);
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
