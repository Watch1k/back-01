import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { BlogAttributes } from '../../application/dtos/blog-attributes';

export const updateBlogHandler = async (
  req: Request<{ id: string }, {}, BlogAttributes>,
  res: Response,
) => {
  await blogsService.updateBlog(req.params.id, req.body);

  res.status(HttpStatus.NoContent).send();
};
