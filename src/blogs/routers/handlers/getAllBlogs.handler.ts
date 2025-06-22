import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs-repository';
import { mapToBlogModel } from '../mappers/map-to-blog-view-model.util';

export const getAllBlogsHandler = async (req: Request, res: Response) => {
  try {
    const videos = await blogsRepository.getAllBlogs();
    res.status(HttpStatus.Ok).send(videos.map(mapToBlogModel));
  } catch {
    res.status(HttpStatus.InternalServerError).send();
  }
};
