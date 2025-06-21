import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs-repository';

export const getAllBlogsHandler = async (req: Request, res: Response) => {
  const blogs = await blogsRepository.getAllBlogs();
  res.status(HttpStatus.Ok).send(blogs);
};
