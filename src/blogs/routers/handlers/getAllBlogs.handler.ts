import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs-repository';

export const getAllBlogsHandler = (req: Request, res: Response) => {
  const blogs = blogsRepository.getAllBlogs();
  res.status(HttpStatus.Ok).send(blogs);
};
