import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { BlogCreateInput } from '../../dto/blog-create.input';
import { blogsRepository } from '../../repositories/blogs-repository';

export const createBlogHandler = (
  req: Request<{}, {}, BlogCreateInput>,
  res: Response,
) => {
  const newBlog = blogsRepository.createBlog(req.body);
  res.status(HttpStatus.Created).send(newBlog);
};
