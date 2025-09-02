import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { BlogAttributes } from '../../application/dtos/blog-attributes';

export const createBlogHandler = async (
  req: Request<{}, {}, BlogAttributes>,
  res: Response,
) => {
  try {
    const respId = await blogsService.createBlog(req.body);
    const createdBlog = await blogsService.findByIdOrFail(respId);
    const blogOutput = mapToBlogOutput(createdBlog);

    res.status(HttpStatus.Created).send(blogOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
};
